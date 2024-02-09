<script>
	import { LayerCake, Svg } from "layercake";
	import { scaleBand } from "d3-scale";
	import Bar from "$components/layercake/Bar.svelte";
	import LineMarker from "$components/layercake/Bar.LineMarker.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import ids from "$data/ids.csv";
	import _ from "lodash";

	export let data;
	export let title;
	export let xKey = "avg_diva";
	export let yKey;
	export let yFormat = (d) => d;
	export let active;
	export let animate;
	export let highlight;
	export let showNumber;
	export let showAvg = true;
	export let showLegend = true;

	data.forEach((d) => {
		d[xKey] = +d[xKey];
	});

	let avg = _.meanBy(ids, (d) => +d["overall_diva"]);
	let small = data.length < 10;

	const longestLabel = yFormat(
		_.maxBy(data, (d) => yFormat(d[yKey]).length)[yKey]
	);
</script>

<h3>{title}</h3>
<div class="chart-container" class:small>
	<LayerCake
		padding={{
			top: showAvg && showLegend ? 30 : 0,
			bottom: 50,
			left: longestLabel.length * 5 + 20,
			right: 50
		}}
		x={xKey}
		y={yKey}
		yScale={scaleBand().paddingInner(0.4)}
		yDomain={data.map((d) => d[yKey])}
		xDomain={[0, null]}
		{data}
	>
		<Svg>
			<AxisY gridlines={false} baseline={false} formatTick={yFormat} />
			<Bar fill="var(--color-grey-blue)" {showNumber} {highlight} />

			{#if showLegend}
				<LineMarker value={0} label="Standard" />
			{/if}
			{#if showAvg}
				<LineMarker value={avg} label="Average" />
			{/if}
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		flex: 1;
	}
	.chart-container.small {
		flex: none;
		height: 60%;
	}
	h3 {
		font-family: var(--sans);
		color: var(--color-grey-blue);
		font-weight: 700;
		text-transform: uppercase;
		margin-bottom: 2.5rem;
		font-size: var(--18px);
		width: calc(100% - 2rem);
		max-width: 50rem;
	}

	@media (max-width: 600px) {
		h3 {
			font-size: var(--16px);
			padding: 0;
			margin-bottom: 2rem;
		}
		.chart-container.small {
			flex: 1;
			max-height: 300px;
		}
	}
</style>
