<script>
	import Standard from "$components/Lines.Standard.svelte";
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import { scaleOrdinal } from "d3-scale";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import _ from "lodash";

	export let data;
	export let highlight;
	export let isolate;
	export let phraseI;
	export let featuredIds;
	export let showStandard;
	export let intro;
	export let hideAll;

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
	$: highlightData = highlight
		? data.find((d) => d.id === highlight).pitch
		: undefined;
	$: highlightEnd = highlightData
		? _.last(highlightData.filter((d) => d.frequency)).timestamp
		: undefined;
</script>

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
			<AxisX
				gridlines={false}
				ticks={intro && !hideAll ? 4 : 0}
				formatTick={(d) => `${d} sec`}
			/>
			<AxisY
				gridlines={false}
				ticks={intro && !hideAll ? 2 : 0}
				formatTick={(d) => `${d} Hz`}
			/>
			{#if showStandard}
				<Standard {highlightEnd} {intro} />
			{/if}
			<MultiLine
				{highlight}
				{isolate}
				{phraseI}
				{featuredIds}
				{intro}
				{hideAll}
			/>
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
	}
</style>
