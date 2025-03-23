export function isPointOverDrop(
	x: number,
	y: number,
	dragTarget: HTMLElement,
): HTMLElement | undefined | -1 {
	const els = document.elementsFromPoint(x, y);
	if(els.length === 1) return -1;
	for (const el of els) {
		if (
			el.classList.contains("dropable") &&
			el.getAttribute("data-disable-drop") === "false" &&
			!(dragTarget.parentElement?.contains(el))
		) {
			return el as HTMLElement;
		}
	}
}

export function moveToSideWhileDragging(
	x: number,
	y: number,
	placeholder: HTMLElement,
	draggedId:string
): null | ViewTransition {
	for (const el of document.elementsFromPoint(x, y)) {
		if (el.classList.contains("draggable") && el.id !== draggedId) {
			const rect = el.getBoundingClientRect();
			const middle = rect.x + rect.width / 2;
			if (x < middle && el.parentElement?.previousElementSibling !== placeholder && el.id !== draggedId) {
				return document.startViewTransition(() => { 
					el.parentElement?.before(placeholder);
				 })
			}
			if (x > middle && el.parentElement?.nextElementSibling !== placeholder) {
				return document.startViewTransition(() => {
					el.parentElement?.after(placeholder);
				})
			}
		}
	}
	return null;
}