<script>
	import { playing } from "$stores/misc.js";

	export let i;
	export let id;
	export let activeColumn;
	export let activeCell;
	export let background;

	const playPhrase = (i) => {
		if (activeCell && activeCell.row === id && activeCell.col === i) {
			activeCell = undefined;
			$playing = undefined;
		} else {
			activeCell = { row: id, col: i };
			$playing = { id: id, phraseI: i };
		}
		if (activeColumn && i !== activeColumn) activeColumn = undefined;
	};

	$: expanded =
		activeColumn === i ||
		(activeCell && activeCell.row === id && activeCell.col === i);
	$: isPlaying = activeCell && activeCell.row === id && activeCell.col === i;
</script>

<button
	class="phrase-box phrase-box-{i}"
	class:expanded
	class:playing={isPlaying}
	style:background
	on:click={() => playPhrase(i)}
>
</button>

<style>
	.phrase-box {
		background: var(--color-light-blue);
		width: 6.25%;
		margin: 0.125rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: width var(--1s);
	}
	.expanded {
		width: 30%;
	}
	.playing {
		outline: 2px solid var(--color-red) !important;
	}
</style>
