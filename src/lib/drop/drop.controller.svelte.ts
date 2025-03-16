import { isClassInRestrictionList, isIdInRestrictionList } from '$lib/utils/drop.util.js';
export interface DropRestrictions {
	id?: string[];
	class?: string[];
}
export class DropController {
	private isDragOver = $state(false);
	private restrictions: DropRestrictions;
	constructor(restrictions?: DropRestrictions) {
		this.restrictions = restrictions ?? { id: [], class: [] };
	}
	asDrop(node: HTMLElement) {
		node.style.viewTransitionName = node.id;
		node.classList.add('dropable');
		node.addEventListener('onDrop', async (ev: CustomEvent) => {
			this.isDragOver = false;
			if (
				isClassInRestrictionList(this.restrictions.class ?? [], ev.detail.classList) ||
				isIdInRestrictionList(ev.detail.element.id, this.restrictions.id ?? [])
			)
				return;
			const transition = document.startViewTransition(() => {
				node.prepend(ev.detail.element);
			});
			await transition.ready;
			ev.detail.dropEndFb();
		});
		node.addEventListener('onDragEnter', () => {
			this.isDragOver = true;
		});
		node.addEventListener('OnDragLeave', () => {
			this.isDragOver = false;
		});
	}
}
