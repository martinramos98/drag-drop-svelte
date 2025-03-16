<script lang="ts">
	import { isClassInRestrictionList, isIdInRestrictionList } from '$lib/utils/drop.util.js';
	import { type Snippet } from 'svelte';
	export interface DropProps {
		asElement?: string;
		children?: Snippet;
		class?: string;
		onDrop?: () => void;
		onDragOver?: () => void;
		onDragEnter?: () => void;
		OnDragLeave?: () => void;
		disableDrop?: boolean;
		orientation: 'horizontal' | 'vertical' | 'both';
		restrictions?: {
			id: string[];
			class: string[];
		};
		id: string;
	}
	const {
		asElement = 'div',
		children,
		onDrop,
		onDragOver,
		onDragEnter,
		OnDragLeave,
		restrictions,
		class: className,
		id,
		disableDrop = false,
		...props
	}: DropProps = $props();
	let isDragOver = $state(false);
	function customEvents(node: HTMLElement) {
		node.addEventListener('onDrop', async (ev: CustomEvent) => {
			isDragOver = false;
			if (
				restrictions &&
				(isClassInRestrictionList(restrictions.class, ev.detail.classList) ||
					isIdInRestrictionList(ev.detail.element.id, restrictions.id))
			)
				return;
			const transition = document.startViewTransition(() => {
				node.prepend(ev.detail.element);
			});
			await transition.ready;
			ev.detail.dropEndFb();
			onDrop?.();
		});
		node.addEventListener('onDragOver', () => {
			onDragOver?.();
		});
		node.addEventListener('onDragEnter', () => {
			onDragEnter?.();
			isDragOver = true;
		});
		node.addEventListener('OnDragLeave', () => {
			OnDragLeave?.();
			isDragOver = false;
		});
	}
</script>

<svelte:element
	this={asElement}
	data-disable-drop={disableDrop}
	data-drag-over={isDragOver}
	{id}
	class={['dropable', className]}
	{...props}
	style="view-transition-name:{id};"
	use:customEvents
	ondragstart={(ev) => ev.preventDefault()}
>
	{@render children?.()}
</svelte:element>

<style>
	.dropable {
		padding: 20px;
		z-index: 5;
		position: relative;
		min-height: 100px;
		min-width: 100px;
	}
	:global {
		.dropable:has(.draggable[data-dragging='true']) {
			z-index: 10;
		}
	}
</style>
