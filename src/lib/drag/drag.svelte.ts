import { Spring } from 'svelte/motion';

export function asDraggable(
	node: HTMLElement,
	params?: { anchor?: HTMLElement; dragStart?: () => void; dragEnd?: () => void, acutalPosition:Spring<{x:number,y:number}> },
	onDrag?: () => void
) {
	node.classList.add('draggable');
	node.addEventListener('mousedown', startDrag);
  const elementToMove = params?.anchor || node;

	// let originalTranslateValues: string | undefined;
	let previousClientMouseValue = { x: 0, y: 0 };
	let actualPositionTranslation = { x: 0, y: 0 };
	const springPosition = new Spring({ x: 0, y: 0 });
  $effect(() => { 
    elementToMove.style.translate = `${springPosition.current.x} ${springPosition.current.y}px`;
   })
  function startDrag(ev: MouseEvent) {
		// const elComputeStyle = getComputedStyle(elementToMove);
		// originalTranslateValues = elComputeStyle.translate;
		previousClientMouseValue = { x: ev.clientX, y: ev.clientY };
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', endDrag);
	}
	function endDrag() {
		actualPositionTranslation.x = 0;
		actualPositionTranslation.y = 0;
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', endDrag);
	}
	function onMouseMove(ev: MouseEvent) {
		actualPositionTranslation = {
			x: actualPositionTranslation.x + (ev.clientX - previousClientMouseValue.x),
			y: actualPositionTranslation.y + (ev.clientY - previousClientMouseValue.y)
		};
		springPosition.target = actualPositionTranslation;
		previousClientMouseValue = { x: ev.clientX, y: ev.clientY };
		onDrag?.();
	}
}
