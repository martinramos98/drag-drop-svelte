import {
	isClassInRestrictionList,
	isIdInRestrictionList,
} from "$lib/utils/drop.util.js";
export interface DropRestrictions {
	id?: string[];
	class?: string[];
}
export class DropController {
	private _isDragOver = $state(false);
	private restrictions: DropRestrictions;
	disable = $state(false);
	constructor(restrictions?: DropRestrictions) {
		this.restrictions = restrictions ?? { id: [], class: [] };
		this.asDrop = this.asDrop.bind(this);
	}
	get isDragOver() {
		return this._isDragOver;
	}
	asDrop(node: HTMLElement) {
		node.style.viewTransitionName = node.id;
		node.classList.add("dropable");
		$effect(() => {
			if (this.disable) {
				node.setAttribute("data-disable-drop", "true");
			} else {
				node.setAttribute("data-disable-drop", "false");
			}
		});
		node.addEventListener("onDrop", async (ev: CustomEvent) => {
			this._isDragOver = false;
			if (
				isClassInRestrictionList(
					this.restrictions.class ?? [],
					ev.detail.classList,
				) ||
				isIdInRestrictionList(ev.detail.element.id, this.restrictions.id ?? [])
			) {
				return;
			}
			const transition = document.startViewTransition(() => {
				ev.detail.changeDOM();
			});
			await transition.ready;
			ev.detail.dropEndFb();
		});
		node.addEventListener("onDragEnter", () => {
			this._isDragOver = true;
		});
		node.addEventListener("OnDragLeave", () => {
			this._isDragOver = false;
		});
	}
}
