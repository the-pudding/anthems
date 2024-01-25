<script>
	import Standard from "$components/Lines.Standard.svelte";
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import { scaleOrdinal } from "d3-scale";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import { currentPhraseI, currentStepI } from "$stores/misc.js";

	export let data;
	export let highlight;
	export let phraseI;
	export let featuredIds;

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
	$: showStandard = $currentPhraseI !== 0 || $currentStepI >= 1;
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
				<AxisX gridlines={false} ticks={2} formatTick={(d) => `${d} sec`} />
				<AxisY gridlines={false} ticks={2} formatTick={(d) => `${d} Hz`} />
				<MultiLine {highlight} {phraseI} {featuredIds} />
				{#if showStandard}
					<Standard />
				{/if}
			</Svg>
		</LayerCake>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex: 1;
	}
	.chart-container {
		width: 100%;
	}
</style>
