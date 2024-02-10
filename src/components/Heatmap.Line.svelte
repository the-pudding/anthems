<script>
	import { LayerCake, Svg } from "layercake";
	import Line from "$components/layercake/Line.svelte";

	export let data;

	const xKey = "timestamp";
	const yKey = "frequency";

	data.forEach((d) => {
		d[yKey] = +d[yKey];
	});
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
		x={xKey}
		y={yKey}
		yNice={4}
		yDomain={[0, null]}
		{data}
	>
		<Svg>
			<Line />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
	}

	:global(.phrase-box .chart-container svg path) {
		stroke: var(--color-fg);
	}
</style>
