<script>
	import Line from "$components/Heatmap.Line.svelte";
	import { playing } from "$stores/misc.js";
	import full from "$data/pitch/desktop/full.csv";

	export let i;
	export let id;
	export let activeColumn;
	export let activeCell;
	export let background;
	export let phraseMissing;
	export let start;
	export let end;

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
	$: lineData = full
		.map((d) => ({ timestamp: +d.timestamp, frequency: +d[id] }))
		.filter((d) => d.timestamp >= start && d.timestamp <= end);
</script>

<button
	class="phrase-box phrase-box-{i}"
	class:expanded
	class:playing={isPlaying}
	class:missing={phraseMissing}
	style:background
	on:click={() => playPhrase(i)}
>
	{#if expanded}
		<Line data={lineData} />
	{/if}
</button>

<style>
	.phrase-box {
		background: var(--color-light-blue);
		width: 6.25%;
		margin: 0.125rem;
		padding: 0;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: width var(--1s);
		color: var(--color-grey-blue);
	}
	.expanded {
		width: 60%;
	}
	.playing {
		outline: 2px solid var(--color-red) !important;
	}
	.phrase-box:hover {
		outline: 2px solid var(--color-red) !important;
	}
	.missing:hover {
		cursor: not-allowed;
		outline: 0 !important;
	}
</style>
