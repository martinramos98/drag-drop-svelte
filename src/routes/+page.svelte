<svelte:options runes={true} />

<script lang="ts">
	import { DragController } from '$lib/drag/drag.controller.svelte.js';

	// import { asDraggable } from '$lib/drag/drag.svelte.js';
	// import Drag from '$lib/drag/Drag.svelte';
	import { DropController } from '$lib/drop/drop.controller.svelte.js';
	import Drop from '$lib/drop/Drop.svelte';
	import { Spring } from 'svelte/motion';
	let draggables: string[] = $state(['drag', 'test', 'poo']);
	function addNewDrag() {
		draggables.push('Drag');
	}
	const { asDrop: asDrop1 } = new DropController();
	const { asDrop: asDrop2 } = new DropController();
</script>

{#snippet Drag(dragController: DragController, id: string, idx: number)}
	<div
		style="translate:{dragController.translation.current.x}px {dragController.translation.current
			.y}px"
		{id}
		class="my-draggable"
		use:dragController.asAnchorDrag
		use:dragController.asDrag
	>
		Drag Me {idx}
	</div>
{/snippet}
<h1>Drag and Drop Svelte</h1>
<main class="">
	<!-- <Drag id={'drag-1'} class="my-draggable">
		<span>Drag me 1</span>
	</Drag>
	<Drag id={'drag-2'} class="my-draggable">
		<span>Drag me 2</span>
	</Drag>
	<Drag id={'drag-3'} class="my-draggable">
		<span>Drag me 3 </span>
	</Drag> -->
	<!-- <Drop class="drop-1 drop-zone" id={'drop-1'}>
		<button class="my-button" onclick={addNewDrag}>Add new Item</button>
		{#each draggables as draggable, index}
			<Drag class="my-draggable" id={draggable + index}>{draggable} {index}</Drag>
		{/each}
	</Drop>
	<Drag id={'drag-4'} class="my-dnd">
		<Drop class="drop-2 drop-zone" id={'drop-2'} />
	</Drag> -->
	{#each draggables as draggable, idx}
		{@render Drag(new DragController(), `${draggable}-${idx}`, idx)}
	{/each}
	<section use:asDrop1 class="drop-zone" id="drop-1"></section>
	<section use:asDrop2 class="drop-zone" id="drop-2"></section>
</main>

<style>
	:global {
		.my-dnd {
			width: 100% !important;
		}
		.drop-zone {
			display: flex;
			flex-direction: row;
			gap: 20px;
			padding: 20px;
			z-index: 5;
			position: relative;
			min-height: 100px;
			min-width: 100px;
		}
		#drop-1 {
			background-color: rgba(167, 162, 132, 0.15);
			border-radius: 20px;
			margin: 20px 0;
		}
		#drop-2 {
			background-color: #7c908254;
			border-radius: 20px;
			margin: 20px 0;
		}
		.my-button {
			background-color: rgb(4, 55, 94);
			view-transition-name: my-button;
			width: fit-content;
			height: fit-content;
			color: currentColor;
			font-family:
				system-ui,
				-apple-system,
				BlinkMacSystemFont,
				'Segoe UI',
				Roboto,
				Oxygen,
				Ubuntu,
				Cantarell,
				'Open Sans',
				'Helvetica Neue',
				sans-serif;
			cursor: pointer;
			border: none;
			padding: 20px;
			border-radius: 20px;
			appearance: none;
		}
		.my-draggable {
			user-select: none;
			background-color: rgb(4, 55, 94);
			width: fit-content;
			padding: 20px;
			border-radius: 20px;
			cursor: grab;
			will-change: translate;
		}
	}
	main {
		position: relative;
	}
	:root {
		background-color: #242424;
		color: #ededed;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}
</style>
