import { Spring } from 'svelte/motion';
import { isPointOverDrop, moveToSideWhileDragging } from '$lib/utils/drag.util.js';
export enum DragOverDropState {
	DRAG_ENTERED,
	DRAG_OVER,
	DROP_NONE
}
export class DragController {
	disable: boolean = $state(false);
	private elementToMove: HTMLElement | null;
	private anchorElement: HTMLElement | null;
	private _dragging = $state(false);
	private previousClientMouseValue = { x: 0, y: 0 };
	private actualPositionTranslation = { x: 0, y: 0 };
	private dragOnDropState: DragOverDropState = DragOverDropState.DROP_NONE;
	private data: unknown | undefined = undefined;
	private placeholder: HTMLElement | null = null;
	private placeholderTransition: ViewTransition | null = null;
	private springPosition = new Spring(
		{ x: 0, y: 0 },
		{
			stiffness: 0.16,
			damping: 0.45
		}
	);
	private lastDropOverElement: HTMLElement | null = null;

	constructor(withData?: unknown) {
		this.elementToMove = null;
		this.anchorElement = null;
		this.endDrag = this.endDrag.bind(this);
		this.dropOverStatusHandler = this.dropOverStatusHandler.bind(this);
		this.placeholderMovementHandler = this.placeholderMovementHandler.bind(this);
		this.draggingMovementHandler = this.draggingMovementHandler.bind(this);
		this.asAnchorDrag = this.asAnchorDrag.bind(this);
		this.asDrag = this.asDrag.bind(this);

		this.data = withData;
	}
	get dragging() {
		return this._dragging;
	}
	get translation() {
		return this.springPosition;
	}
	asAnchorDrag(node: HTMLElement) {
		this.anchorElement = node;
		this.anchorElement.classList.add('draggable');
		node.addEventListener('mousedown', this.startDrag.bind(this));
	}
	asDrag(node: HTMLElement) {
		this.elementToMove = node;
		node.addEventListener('dragstart', (ev) => {
			ev.preventDefault();
		});
	}
	private startDrag(ev: MouseEvent) {
		this.previousClientMouseValue = { x: ev.clientX, y: ev.clientY };
		this._dragging = true;
		window.addEventListener('mousemove',this.dropOverStatusHandler );
		window.addEventListener('mousemove', this.placeholderMovementHandler);
		window.addEventListener('mousemove', this.draggingMovementHandler);
		window.addEventListener('mouseup', this.endDrag);
		this.placeholder = this.elementToMove?.cloneNode(true) as HTMLElement;
		this.placeholder.id += '-placeholder';
		this.placeholder.style.cssText = `opacity: 0.2; position: static; pointer-events: none;translate:0px;view-transition-name:none;z-index:-1;`;
		this.placeholder.classList.remove('draggable');
		this.placeholder.classList.add('placeholder');
		this.elementToMove?.parentElement?.after(this.placeholder);
		this.elementToMove.style.top = `${this.elementToMove.offsetTop}px`;
		this.elementToMove.style.left = `${this.elementToMove.offsetLeft}px`;
		ev.preventDefault();
		ev.stopImmediatePropagation();
	}

	private async endDrag(ev: MouseEvent) {
		if (this.placeholderTransition ) {
			await this.placeholderTransition.finished
		}
		const dropEl = isPointOverDrop(ev.clientX, ev.clientY, this.elementToMove as HTMLElement);
		if(dropEl === -1) throw new Error("Element is dropped when transition still running");
		if (dropEl) {
			dropEl.dispatchEvent(
				new CustomEvent('onDrop', {
					detail: {
						data: this.data,
						element: this.elementToMove?.parentElement,
						dropEndFb: () => {
							this.actualPositionTranslation.x = 0;
							this.actualPositionTranslation.y = 0;
							this.springPosition.target = this.actualPositionTranslation;
							this._dragging = false;
							this.elementToMove?.style.removeProperty('top');
							this.elementToMove?.style.removeProperty('left');
						},
						changeDOM: () => {
							this.placeholder?.after(this.elementToMove?.parentElement as HTMLElement);
							this.placeholder?.remove();
							this.placeholder = null;
						}
					}
				})
			);
		} else {
			this.placeholder?.remove();
			this.placeholder = null;
			this.actualPositionTranslation.x = 0;
			this.actualPositionTranslation.y = 0;
			this.elementToMove?.style.removeProperty('top');
			this.elementToMove?.style.removeProperty('left');
			this.springPosition.target = this.actualPositionTranslation;
			this._dragging = false;
		}
		window.removeEventListener('mousemove', this.draggingMovementHandler);
		window.removeEventListener('mousemove', this.dropOverStatusHandler);
		window.removeEventListener('mousemove', this.placeholderMovementHandler);
		window.removeEventListener('mouseup', this.endDrag);
	}
	private async dropOverStatusHandler(ev: MouseEvent) {
		const dropEl = isPointOverDrop(ev.clientX, ev.clientY, this.elementToMove as HTMLElement);
		if(dropEl === -1) return;
		if (
			!!dropEl &&
			(this.dragOnDropState === DragOverDropState.DROP_NONE || this.lastDropOverElement !== dropEl)
		) {
			this.dragOnDropState = DragOverDropState.DRAG_ENTERED;
			this.lastDropOverElement = dropEl;
			dropEl.dispatchEvent(new CustomEvent('onDragEnter'));
			document.startViewTransition(() => { 
				this.lastDropOverElement?.appendChild(this.placeholder as HTMLElement);
			 })
		} else if (!dropEl && this.dragOnDropState === DragOverDropState.DRAG_ENTERED && !this.placeholderTransition) {
			this.dragOnDropState = DragOverDropState.DROP_NONE;
			this.lastDropOverElement?.dispatchEvent(new CustomEvent('OnDragLeave'));
		} else if (!!dropEl && this.dragOnDropState === DragOverDropState.DRAG_ENTERED) {
			dropEl.dispatchEvent(new CustomEvent('onDragOver'));
		}

	}

	private placeholderMovementHandler(ev:MouseEvent){
		if (!this.placeholderTransition && this.dragOnDropState === DragOverDropState.DRAG_ENTERED) {
        this.placeholderTransition = moveToSideWhileDragging(
					ev.clientX,
					ev.clientY,
					this.placeholder as HTMLElement,
					this.elementToMove?.id as string
				);
				this.placeholderTransition?.finished.then(() => {
						this.placeholderTransition = null;

				});
			}
	}
	private draggingMovementHandler(ev: MouseEvent) {
		this.actualPositionTranslation = {
			x: this.actualPositionTranslation.x + (ev.clientX - this.previousClientMouseValue.x),
			y: this.actualPositionTranslation.y + (ev.clientY - this.previousClientMouseValue.y)
		};

		this.springPosition.target = this.actualPositionTranslation;
		this.previousClientMouseValue = { x: ev.clientX, y: ev.clientY };
	}
}
