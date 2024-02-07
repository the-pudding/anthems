<script>
	import data from "$data/repeat-performers.csv";
	import { scaleLinear } from "d3-scale";
	import _ from "lodash";

	export let title = "";

	let width;

	const min = +_.minBy(data, (d) => +d.similarity_score).similarity_score;
	const max = +_.maxBy(data, (d) => +d.similarity_score).similarity_score;

	$: xScale = scaleLinear()
		.domain([min, max])
		.range([50, width - 200]);
</script>

<div class="spectrum-chart">
	<div class="title">{title}</div>
	<div class="legend">
		<p>◀ More similar</p>
		<p>More different ▶</p>
	</div>

	<div class="chart-wrapper" bind:clientWidth={width}>
		<div class="line" />

		{#each data as { id_start, similarity_score }}
			{@const left = xScale(+similarity_score)}
			<img src={`assets/cutouts/${id_start}.png`} style:left={`${left}px`} />
		{/each}
	</div>
</div>

<style>
	.spectrum-chart {
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 100%;
		padding: 3rem 1rem 4rem 1rem;
	}
	.title {
		font-family: var(--sans);
		color: var(--color-grey-blue);
		font-weight: 700;
		text-transform: uppercase;
		margin: 0 auto 2.5rem auto;
		font-size: var(--18px);
		width: calc(100% - 2rem);
		max-width: 50rem;
		padding: 0 0 0 6.5rem;
	}
	.legend {
		width: calc(100% - 2rem);
		max-width: 50rem;
		margin: 0 auto 1rem auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-family: var(--sans);
		font-size: var(--14px);
		color: var(--color-fg);
		padding: 0 0 0 4rem;
	}
	.legend p:first-of-type {
		margin: 0 0 0 2.5rem;
	}
	.legend p:last-of-type {
		margin: 0;
	}
	.chart-wrapper {
		flex: 1;
		width: 100%;
		position: relative;
	}
	img {
		top: 40%;
		transform: translate(0, -50%);
		position: absolute;
		height: 150px;
		pointer-events: auto;
	}
	.line {
		height: 2px;
		background: var(--color-fg);
		opacity: 0.6;
		width: 100%;
		position: absolute;
		top: 40%;
	}
</style>
