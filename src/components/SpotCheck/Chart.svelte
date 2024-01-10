<script>
	import Toggles from "$components/SpotCheck/Toggles.svelte";
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import { scaleOrdinal } from "d3-scale";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";

	export let data;
	export let flag;
	export let flagged;
	export let lyrics;

	let hide = [];

	const xKey = "adjusted_timestamp";
	const yKey = "frequency";
	const zKey = "id";

	const seriesColors = [
		"#e6194b",
		"#3cb44b",
		"#ffe119",
		"#4363d8",
		"#f58231",
		"#911eb4",
		"#46f0f0",
		"#f032e6",
		"#bcf60c",
		"#fabebe",
		"#008080",
		"#e6beff",
		"#9a6324",
		"#800000"
	];

	data.forEach((d) => {
		d.pitch = d.pitch.map((p) => ({
			...p,
			id: d.id
		}));
	});

	$: flatData = flatten(data, "pitch");
	$: zScale = scaleOrdinal()
		.domain(data.map((d) => d.id))
		.range(seriesColors);
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
			zRange={seriesColors}
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

	<Toggles {data} {zScale} {flag} {flagged} {lyrics} bind:hide />
</div>

<style>
	.chart-container {
		width: 600px;
		height: 400px;
	}
	.wrapper {
		display: flex;
	}
</style>
