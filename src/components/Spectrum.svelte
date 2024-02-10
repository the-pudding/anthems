<script>
	import data from "$data/repeat-performers.csv";
	import { scaleLinear } from "d3-scale";
	import _ from "lodash";
	import Face from "$components/Phrases.Featured.Face.svelte";
	import viewport from "$stores/viewport.js";

	export let title = "";

	let width;

	const min = +_.minBy(data, (d) => +d.similarity_score).similarity_score;
	const max = +_.maxBy(data, (d) => +d.similarity_score).similarity_score;

	const ids = {
		"billy-joel": "billy-joel_super-bowl_2007",
		"carrie-underwood": "carrie-underwood_mlb-allstar-game_2006",
		"demi-lovato": "demi-lovato_super-bowl_2020",
		jewel: "jewel_super-bowl_1998",
		"jordin-sparks": "jordin-sparks_nba-finals_2017",
		"kelly-clarkson": "kelly-clarkson_indy-500_2019",
		"mary-j-blige": "mary-j-blige_world-series_2009"
	};

	$: mobile = $viewport.width < 600;
	$: paddingLeft = mobile ? 0 : 50;
	$: paddingRight = mobile ? 0 : 200;

	$: xScale = scaleLinear()
		.domain([min, max])
		.range([paddingLeft, width - paddingRight]);
</script>

<div class="spectrum-chart">
	<h3 class="title">{title}</h3>
	<div class="legend">
		<p>◀ More similar</p>
		<p>More different ▶</p>
	</div>

	<div class="chart-wrapper" bind:clientWidth={width}>
		<div class="line" />

		{#each data as { id_start, similarity_score }}
			{@const left = xScale(+similarity_score)}
			<div class="face" style:left={`${left}px`}>
				<Face id={ids[id_start]} clickable={false} />
			</div>
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
	h3 {
		font-family: var(--sans);
		color: var(--color-grey-blue);
		font-weight: 700;
		text-transform: uppercase;
		margin: 0 auto 2.5rem auto;
		font-size: var(--16px);
		width: 100%;
		max-width: 50rem;
		padding: 0
	}
	.legend {
		width: 100%;
		max-width: 50rem;
		margin: 0 auto 1rem auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-family: var(--sans);
		font-size: var(--14px);
		color: var(--color-fg);
		padding: 0;
	}
	.legend p:first-of-type {
		margin: 0;
	}
	.legend p:last-of-type {
		margin: 0;
	}
	.chart-wrapper {
		flex: 1;
		width: 100%;
		position: relative;
	}
	.face {
		width: 25%;
		position: absolute;
		top: 40%;
		transform: translate(0, -45%);
	}
	.line {
		height: 2px;
		background: var(--color-fg);
		opacity: 0.6;
		width: 100%;
		position: absolute;
		top: 40%;
	}

	@media (max-width: 600px) {
		.spectrum-chart {
			padding: 0;
		}
		h3 {
			margin: 0;
			padding: 0;
		}
		.legend {
			padding: 1rem 0 0 0;
			margin: 0;
			width: 100%;
		}
		.legend p:first-of-type,
		.legend p:last-of-type {
			margin: 0;
		}
	}
</style>
