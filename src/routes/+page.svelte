<script lang="ts">
	import Drag from '$lib/drag/Drag.svelte';
	import DragNDrop from '$lib/dragndrop/DragNDrop.svelte';
	import Drop from '$lib/drop/Drop.svelte';
	let draggables: string[] = $state(['drag', 'test', 'poo']);
</script>

<!-- {#snippet Drag(dragController: DragController, id: string, idx: number)}
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
{/snippet} -->
<h1>Drag and Drop Svelte</h1>
<main class="">
	<Drop id={'drop-main'} orientation={'horizontal'}>
		<Drag id={'drag-1'} class="my-draggable">
			<span>Drag me 1</span>
		</Drag>
		<Drag id={'drag-2'} class="my-draggable">
			<span>Drag me 2</span>
		</Drag>
		<Drag id={'drag-3'} class="my-draggable">
			<span>Drag me 3 </span>
		</Drag>
		<!-- <DragNDrop asElement={'div'} id={'drop-1'} class={['drop-zone']}></DragNDrop>
		<DragNDrop asElement={'div'} id={'drop-2'} class={['drop-zone']}></DragNDrop>
		<DragNDrop asElement={'div'} id={'dnd-items'} class={['drop-zone']}></DragNDrop> -->
	</Drop>
	<Drop class="drop-1 drop-zone" id={'drop-1'} orientation={'horizontal'}>
		<!-- <button class="my-button" onclick={addNewDrag}>Add new Item</button>
		{#each draggables as draggable, index}
			<Drag class="my-draggable" id={draggable + index}>{draggable} {index}</Drag>
		{/each} -->
	</Drop>
	<Drop class="drop-2 drop-zone" id={'drop-2'} orientation={'horizontal'} />

	<!-- {#each draggables as draggable, idx}
		{@render Drag(new DragController(), `${draggable}-${idx}`, idx)}
	{/each} -->
</main>

<style>
	:global {
		.my-dnd {
			width: 100% !important;
		}
		#drop-main {
			gap: 10px;
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
		#dnd-items {
			background-color: #8f7c9054;
			border-radius: 20px;
			margin: 20px 0;
		}
		.my-button {
			background-color: rgb(4, 55, 94);
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
