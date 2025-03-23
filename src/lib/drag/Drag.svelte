<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DragController } from './drag.controller.svelte.js';
	export interface DragProps {
		asElement?: string;
		children: Snippet<[any]>;
		class?: string;
		onDrag?: () => void;
		onDragStart?: () => void;
		onDragEnd?: () => void;
		disableDrag?: boolean;
		data?: any;
	}
	const {
		asElement = 'div',
		children,
		class: className,
		onDrag,
		onDragStart,
		onDragEnd,
		disableDrag = false,
		data,
		id,
		...props
	}: DragProps & Partial<any> = $props();
	const dragController = new DragController(data);
	const asAnchor = dragController.asAnchorDrag;
	$effect(() => {
		dragController.disable = disableDrag;
	});
</script>

<div
	data-drag-id={id}
	style="display:contents;--draggable-translate:{dragController.translation.current
		.x}px {dragController.translation.current.y}px;"
>
	<svelte:element
		this={asElement}
		use:dragController.asDrag
		use:asAnchor
		data-dragging={dragController.dragging}
		data-disable-drag={dragController.disable}
		class={[!disableDrag && 'draggable', className]}
		{id}
		{...props}
		style="view-transition-name:drag-{id}"
	>
		{@render children?.(asAnchor)}
	</svelte:element>
</div>

<style>
	.draggable {
		translate: var(--draggable-translate);
	}
	.draggable,
	.placeholder {
		cursor: grab;
		height: fit-content;
		width: fit-content;
		z-index: 10;
		position: relative;
		/* view-transition-class: draggable; */
	}
	[data-dragging='true'] {
		will-change: translate;
		cursor: grabbing;
		z-index: 1000;
		position: absolute;
	}
	html::view-transition-group(.draggable) {
		animation-duration: 0.3s;
	}
</style>
