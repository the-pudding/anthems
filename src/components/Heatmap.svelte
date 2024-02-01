<script>
	import Filters from "$components/Heatmap.Filters.svelte";
	import ids from "$data/ids.csv";
	import Row from "$components/Heatmap.Row.svelte";
	import copy from "$data/copy.json";
	import { playing, ready } from "$stores/misc.js";

	let sortedFilteredIds = ids;
	let activeColumn;
	let activeCell;

	const phrases = copy.slides.filter((d) => d.type === "phrase");

	const onColumnClick = (i) => {
		if (activeColumn === i) activeColumn = undefined;
		else activeColumn = i;

		if (activeCell) activeCell = undefined;

		$playing = undefined;
	};
</script>

<section id="heatmap" class:visible={$ready}>
	<div class="sticky">
		<Filters bind:sortedFilteredIds />
		<div class="top-row">
			{#each phrases as phrase, i}
				<button
					class="top-row-phrase top-row-phrase-{i}"
					class:active={activeColumn === i}
					on:click={() => onColumnClick(i)}
				>
					{phrase.lyrics}
				</button>
			{/each}
		</div>
	</div>

	<div class="performer-rows">
		{#each sortedFilteredIds as performance}
			{#if performance.id !== "standard"}
				<Row data={performance} bind:activeColumn bind:activeCell />
			{/if}
		{/each}
	</div>
</section>

<style>
	section {
		width: 100%;
		display: none;
	}
	section.visible {
		display: block;
	}
	.sticky {
		position: sticky;
		top: 0;
		z-index: 2;
	}
	.top-row {
		padding: 0.5rem 1rem 0.5rem 21rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		background: var(--color-bg);
		border-bottom: 1px solid var(--color-fg);
		z-index: 1000;
	}
	.top-row-phrase {
		width: 6.25%;
		text-overflow: ellipsis;
		margin: 0.125rem;
		height: 2rem;
		font-size: var(--14px);
		font-family: var(--sans);
		overflow: hidden;
		white-space: nowrap;
		transition: width var(--1s);
		background: none;
		color: var(--color-fg);
		padding: 0;
	}
	.top-row-phrase:hover {
		background: var(--color-gray-800);
	}
	.active {
		width: 30%;
		font-weight: 700;
	}
	:global(#heatmap span.icon) {
		pointer-events: none;
	}
</style>
