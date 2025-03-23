<script lang="ts">
	import { DropController } from './drop.controller.svelte.js';
	import { type Snippet } from 'svelte';
	import type { Action } from 'svelte/action';
	export interface DropProps {
		asElement?: string;
		children?: Snippet;
		class?: string;
		onDrop?: () => void;
		onDragOver?: () => void;
		onDragEnter?: () => void;
		OnDragLeave?: () => void;
		disableDrop?: boolean;
		orientation: 'horizontal' | 'vertical' | 'grid';
		action?: Action;
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
		orientation,
		id,
		disableDrop = false,
		action = () => {},
		...props
	}: DropProps = $props();
	const dropController = new DropController();
	$effect(() => {
		dropController.disable = disableDrop;
	});
</script>

<svelte:element
	this={asElement}
	use:action
	data-disable-drop={dropController.disable}
	data-drag-over={dropController.isDragOver}
	data-drop-orientation={orientation}
	{id}
	class={['dropable', className]}
	{...props}
	style="view-transition-name:drop-{id};"
	use:dropController.asDrop
	ondragstart={(ev) => ev.preventDefault()}
>
	{@render children?.()}
</svelte:element>

<style>
	.dropable {
		padding: 20px;
		z-index: 5;
		position: relative;
		display: flex;
		min-height: 100px;
		min-width: 100px;
		&[data-drop-orientation='horizontal'] {
			flex-direction: row;
		}

		&[data-drop-orientation='vertical'] {
			flex-direction: column;
		}
	}
	:global {
		.dropable:has(.draggable[data-dragging='true']) {
			z-index: 10;
		}
	}
</style>
