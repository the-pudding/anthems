<script>
	import { LayerCake, Svg } from "layercake";

	import Line from "$components/layercake/Line.svelte";
	import Area from "$components/layercake/Area.svelte";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";

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
			<AxisX gridlines={false} ticks={2} formatTick={(d) => `${d}s`} />
			<AxisY gridlines={false} ticks={4} formatTick={(d) => `${d}Hz`} />
			<Line stroke="lightblue" />
			<!-- <Area fill="lightblue" /> -->
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100px;
		height: 100px;
	}
</style>
