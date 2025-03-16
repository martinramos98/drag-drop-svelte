import { Spring } from "svelte/motion";
import { isPointOverDrop } from "$lib/utils/drag.util.js";
export enum DragOverDropState {
  DRAG_ENTERED,
  DRAG_OVER,
  DROP_NONE,
}
export class DragController {
  private elementToMove:HTMLElement | null;
  private anchorElement:HTMLElement | null;
  private _dragging = $state(false)
  private _disableDrag:boolean = $state(false)
  private previousClientMouseValue = { x: 0, y: 0 };
  private actualPositionTranslation = { x: 0, y: 0 };
  private dragOnDropState:DragOverDropState = DragOverDropState.DROP_NONE;
  private springPosition = new Spring({ x: 0, y: 0 }, {stiffness:0.16,damping:0.45});
  private lastDropOverElement:HTMLElement | null = null;
  constructor() {
    this.elementToMove = null;
    this.anchorElement = null;
    this.endDrag = this.endDrag.bind(this)
    this.moveDrag = this.moveDrag.bind(this)
  }
  get dragging(){
    return this._dragging;
  }
  get disableDrag(){
    return this._disableDrag;
  }
  get translation(){
    return this.springPosition;
  }
  asAnchorDrag(node:HTMLElement){
    this.anchorElement = node;
    this.anchorElement.classList.add("draggable");
    node.addEventListener("mousedown",this.startDrag.bind(this));
    
  }
  asDrag(node:HTMLElement){
    this.elementToMove = node;
    node.style.viewTransitionName = "drag-" + node.id;
    node.addEventListener("dragstart",(ev) => { ev.preventDefault(); });
  } 
  private startDrag(ev:MouseEvent){
    this.previousClientMouseValue = { x: ev.clientX, y: ev.clientY };
		this._dragging = true;
		window.addEventListener('mousemove',this.moveDrag);
		window.addEventListener('mouseup', this.endDrag);
		ev.preventDefault();
		ev.stopImmediatePropagation();
  }

  private endDrag(ev:MouseEvent){
		const dropEl = isPointOverDrop(ev.clientX, ev.clientY, this.elementToMove as HTMLElement);
		if (dropEl) {
			dropEl.dispatchEvent(
				new CustomEvent('onDrop', {
					detail: {
						element: this.elementToMove,
						dropEndFb: () => {
							this.actualPositionTranslation.x = 0;
							this.actualPositionTranslation.y = 0;
							this.springPosition.target = this.actualPositionTranslation;
							this._dragging = false;
						}
					}
				})
			);
		} else {
			this.actualPositionTranslation.x = 0;
			this.actualPositionTranslation.y = 0;
			this.springPosition.target = this.actualPositionTranslation;
			this._dragging = false;
		}

		window.removeEventListener('mousemove', this.moveDrag);
		window.removeEventListener('mouseup', this.endDrag);

  }
  private moveDrag(ev:MouseEvent){
    this.actualPositionTranslation = {
			x: this.actualPositionTranslation.x + (ev.clientX - this.previousClientMouseValue.x),
			y: this.actualPositionTranslation.y + (ev.clientY - this.previousClientMouseValue.y)
		};

		const dropEl = isPointOverDrop(ev.clientX, ev.clientY, this.elementToMove as HTMLElement);
		if (!!dropEl && this.dragOnDropState === DragOverDropState.DROP_NONE) {
			this.dragOnDropState = DragOverDropState.DRAG_ENTERED;
			dropEl.dispatchEvent(new CustomEvent('onDragEnter'));
			this.lastDropOverElement = dropEl;
		} else if (!dropEl && this.dragOnDropState === DragOverDropState.DRAG_ENTERED) {
			this.dragOnDropState = DragOverDropState.DROP_NONE;
			this.lastDropOverElement?.dispatchEvent(new CustomEvent('OnDragLeave'));
		} else if (!!dropEl && this.dragOnDropState === DragOverDropState.DRAG_ENTERED) {
			dropEl.dispatchEvent(new CustomEvent('onDragOver'));
		}
		this.springPosition.target = this.actualPositionTranslation;
		this.previousClientMouseValue = { x: ev.clientX, y: ev.clientY };


  }

}