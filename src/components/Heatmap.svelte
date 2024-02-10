<script>
	import Filters from "$components/Heatmap.Filters.svelte";
	import ids from "$data/ids.csv";
	import Row from "$components/Heatmap.Row.svelte";
	import copy from "$data/copy.json";
	import { playing, entered } from "$stores/misc.js";

	let sortedFilteredIds = ids.filter((d) => d.id !== "standard");
	let activeColumn;
	let activeCell;
	let sectionEl;

	const phrases = copy.slides.filter((d) => d.type === "phrase");

	const onColumnClick = (i) => {
		if (activeColumn === i) activeColumn = undefined;
		else activeColumn = i;

		if (activeCell) activeCell = undefined;

		$playing = undefined;
	};
	const scrollToTop = () => {
		if (!$entered) return;
		const heatmap = document.querySelector("#heatmap");
		if (heatmap) heatmap.scrollIntoView();
	};

	$: sortedFilteredIds, scrollToTop();
</script>

<div id="transition-to-heatmap">
	{#each copy.transition as { value }}
		<p>{@html value}</p>
	{/each}
</div>

<section id="heatmap">
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
		{#each sortedFilteredIds as performance, i (performance.id)}
			<Row {i} data={performance} bind:activeColumn bind:activeCell />
		{/each}
	</div>
</section>

<style>
	section {
		width: 100%;
		margin-top: 8rem;
		position: relative;
	}
	#transition-to-heatmap {
		padding-top: 4rem;
		max-width: 600px;
		margin: auto;
	}
	.sticky {
		position: sticky;
		top: 0;
		z-index: 2;
	}
	.top-row {
		padding: 0.5rem 1rem 0.5rem 16rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		background: var(--color-extra-dark-blue);
		border-bottom: 1px solid var(--color-fg);
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
		/* color: var(--color-red); */
		font-weight: 700;
		border-bottom: 3px solid var(--color-red);
		/* background: var(--color-dark-blue); */
	}
	.active {
		width: 30%;
		font-weight: 700;
	}
	:global(#heatmap span.icon) {
		pointer-events: none;
	}

	@media (max-width: 800px) {
		.top-row {
			display: none;
		}
	}
</style>
