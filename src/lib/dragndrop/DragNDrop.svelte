<script lang="ts">
	import { DropController } from '$lib/drop/drop.controller.svelte.js';
	import { DragController } from '$lib/drag/drag.controller.svelte.js';
	import { type Snippet } from 'svelte';
	import { type Action } from 'svelte/action';
	export interface DragNDropProps {
		asElement?: string;
		children?: Snippet<[any]>;
		class?: string[] | string;
		disableDrop?: boolean;
		disableDrag?: boolean;
		action?: Action;
		dropInsideDrag?: {
			startContent?: Snippet;
			endContent?: Snippet;
		};
		drag: Snippet;
		id: string;
		data?: any;
	}
	const {
		children,
		asElement = 'div',
		id,
		action = () => {},
		class: className,
		disableDrop = false,
		disableDrag = false,
		...props
	}: DragNDropProps = $props();
	const dragController = new DragController();
	const dropController = new DropController();
	const asAnchor = dragController.asAnchorDrag;
	$effect(() => {
		dragController.disable = disableDrag;
		dropController.disable = disableDrop;
	});
</script>

<div
	style="display:contents;--drag-translate: {dragController.translation.current.x}px {dragController
		.translation.current.y}px;"
>
	<svelte:element
		this={asElement}
		use:action
		use:dropController.asDrop
		class={['draggable', 'dropable', className]}
		data-dragging={dragController.dragging}
		style="view-transition-name:dnd-{id}"
		{...props}
		ondragstart={(ev) => ev.preventDefault()}
	>
		{#if props.dropInsideDrag}
			{@render children?.()}
		{/if}
	</svelte:element>
</div>

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
	.draggable {
		cursor: grab;
		height: fit-content;
		width: fit-content;
		z-index: 10;
		translate: var(--drag-translate);
		position: relative;
	}
	[data-dragging='true'] {
		cursor: grabbing;
		z-index: 1000;
		will-change: translate;
	}
	html::view-transition-group(.draggable) {
		animation-duration: 0.3s;
	}
</style>
