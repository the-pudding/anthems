<script>
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import { scaleOrdinal } from "d3-scale";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";

	export let data;

	let hide = [];

	const xKey = "timestamp";
	const yKey = "frequency";
	const zKey = "id";

	data.forEach((d) => {
		d.pitch = d.pitch.map((p) => ({
			...p,
			id: d.id
		}));
	});

	$: flatData = flatten(data, "pitch");
	$: zScale = scaleOrdinal().domain(data.map((d) => d.id));
</script>

<div class="wrapper">
	<div class="chart-container">
		<LayerCake
			padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
			x={xKey}
			y={yKey}
			z={zKey}
			{zScale}
			zDomain={data.map((d) => d.id)}
			yNice={4}
			yDomain={[0, null]}
			{flatData}
			{data}
		>
			<Svg>
				<AxisX gridlines={false} ticks={2} formatTick={(d) => `${d}s`} />
				<AxisY gridlines={false} ticks={4} formatTick={(d) => `${d}Hz`} />
				<MultiLine {hide} />
			</Svg>
		</LayerCake>
	</div>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 600px;
	}
	.wrapper {
		display: flex;
	}
</style>
