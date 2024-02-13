<script>
	import Filters from "$components/Heatmap.Filters.svelte";
	import ids from "$data/ids.csv";
	import Row from "$components/Heatmap.Row.svelte";
	import copy from "$data/copy.json";
	import { playing, entered } from "$stores/misc.js";

	let sortedFilteredIds = ids.filter((d) => d.id !== "standard");
	let activeColumn;
	let activeCell;

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
		<div class="legend">
			<p>◀ Less Diva</p>
			<div class="gradient"></div>
			<p>More Diva ▶</p>
		</div>
		<div class="top-row">
			{#each phrases as phrase, i}
				<div
					class="top-row-phrase top-row-phrase-{i}"
					aria-label="phrase-{i}"
					class:active={activeColumn === i}
				>
					{phrase.lyrics}
				</div>
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
		padding: 4rem 1rem 0 1rem;
		max-width: 600px;
		margin: auto;
	}
	#transition-to-heatmap p {
		line-height: 1.8;
	}
	.sticky {
		position: sticky;
		top: 0;
		z-index: 2;
		box-shadow: rgba(0, 0, 0, 0.5) 0 2px 8px;
	}
	.legend {
		width: 100%;
		padding: 0rem 1rem 0rem 16.5rem;
		display: flex;
		flex-direction: row;
		background: var(--color-extra-dark-blue);
		align-items: center;
	}
	.legend p {
		font-size: var(--14px);
		font-family: var(--sans);
		text-align: right;
	}
	.legend p:last-of-type {
		text-align: left;
	}
	.legend .gradient {
		width: 100%;
		flex: 1;
		margin: 0 0.5rem;
		height: 1.5rem;
		border: 1px solid var(--color-fg);
		background: linear-gradient(
			90deg,
			rgba(124, 164, 174, 0) 0%,
			rgba(124, 164, 174, 1) 100%
		);
	}
	.top-row {
		padding: 0.5rem 1rem 0.5rem 16.5rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		background: var(--color-extra-dark-blue);
		border-bottom: 1px solid var(--color-fg);
		border-radius: 0;
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
		transition: width calc(var(--1s) * 0.7) ease-in-out;
		background: none;
		color: var(--color-fg);
		padding: 0;
		border-radius: 0;
	}
	.active {
		width: 30%;
		font-weight: 700;
		border-bottom: 3px solid var(--color-red);
	}
	:global(#heatmap span.icon) {
		pointer-events: none;
	}

	@media (max-width: 800px) {
		.top-row {
			display: none;
		}
		#transition-to-heatmap p {
			font-size: var(--14px);
		}
		.legend {
			width: 100%;
			padding: 0rem 1rem 0.5rem 1rem;
			border-bottom: 1px solid var(--color-fg);
		}
	}
</style>
