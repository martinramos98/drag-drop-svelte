<script lang="ts">
	import { isPointOverDrop } from '$lib/utils/drag.util.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { Spring } from 'svelte/motion';
	export interface DragProps {
		asElement?: string;
		children: Snippet<[any]>;
		class?: string;
		onDrag?: () => void;
		onDragStart?: () => void;
		onDragEnd?: () => void;
		disableDrag?: boolean;
		withCustomAnchor?: boolean;
	}
	const {
		asElement = 'div',
		children,
		class: className,
		onDrag,
		onDragStart,
		onDragEnd,
		disableDrag,
		withCustomAnchor = false,
		id,
		...props
	}: DragProps & Partial<any> = $props();
	let previousClientMouseValue = { x: 0, y: 0 };
	let actualPositionTranslation = { x: 0, y: 0 };
	let dragging = $state(false);
	let dragOnDropState: 'entered' | 'none' | 'over' = 'none';
	const springPosition = new Spring(
		{ x: 0, y: 0 },
		{
			damping: 0.45,
			stiffness: 0.16
		}
	);
	let elementToMove: HTMLElement;
	let lastDropEntered: HTMLElement;
	function startDrag(ev: MouseEvent) {
		previousClientMouseValue = { x: ev.clientX, y: ev.clientY };
		dragging = true;
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', endDrag);
		onDragStart?.();
		ev.preventDefault();
		ev.stopImmediatePropagation();
	}
	function endDrag(ev: MouseEvent) {
		console.log('end drag');
		const dropEl = isPointOverDrop(ev.clientX, ev.clientY, elementToMove);
		if (dropEl) {
			dropEl.dispatchEvent(
				new CustomEvent('onDrop', {
					detail: {
						element: elementToMove,
						dropEndFb: () => {
							actualPositionTranslation.x = 0;
							actualPositionTranslation.y = 0;
							springPosition.target = actualPositionTranslation;
							dragging = false;
						}
					}
				})
			);
		} else {
			actualPositionTranslation.x = 0;
			actualPositionTranslation.y = 0;
			springPosition.target = actualPositionTranslation;
			dragging = false;
		}
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', endDrag);
	}
	function onMouseMove(ev: MouseEvent) {
		actualPositionTranslation = {
			x: actualPositionTranslation.x + (ev.clientX - previousClientMouseValue.x),
			y: actualPositionTranslation.y + (ev.clientY - previousClientMouseValue.y)
		};

		const dropEl = isPointOverDrop(ev.clientX, ev.clientY, elementToMove);
		if (!!dropEl && dragOnDropState === 'none') {
			dragOnDropState = 'entered';
			dropEl.dispatchEvent(new CustomEvent('onDragEnter'));
			lastDropEntered = dropEl;
		} else if (!dropEl && dragOnDropState === 'entered') {
			dragOnDropState = 'none';
			lastDropEntered.dispatchEvent(new CustomEvent('OnDragLeave'));
		} else if (!!dropEl && dragOnDropState === 'entered') {
			dropEl.dispatchEvent(new CustomEvent('onDragOver'));
		}
		springPosition.target = actualPositionTranslation;
		previousClientMouseValue = { x: ev.clientX, y: ev.clientY };

		onDrag?.();
	}
	function asAnchorDrag(node: HTMLElement) {
		if (disableDrag) return;
		node.addEventListener('mousedown', startDrag);
	}
	function asAnchorDragDefaultElement(node: HTMLElement) {
		if (!withCustomAnchor && !disableDrag) asAnchorDrag(node);
	}
</script>

<svelte:element
	this={asElement}
	bind:this={elementToMove}
	use:asAnchorDragDefaultElement
	data-dragging={dragging}
	class={[!disableDrag && 'draggable', className]}
	{...props}
	style="translate: {springPosition.current.x}px {springPosition.current
		.y}px; view-transition-name:{id}"
>
	{@render children?.(asAnchorDrag)}
</svelte:element>

<style>
	.draggable {
		will-change: translate;
		cursor: grab;
		height: fit-content;
		width: fit-content;
		z-index: 10;
		position: relative;
		/* view-transition-class: draggable; */
	}
	[data-dragging='true'] {
		cursor: grabbing;
		z-index: 1000;
	}
	html::view-transition-group(.draggable) {
		animation-duration: 0.3s;
	}
</style>
