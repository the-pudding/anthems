<script>
	import Standard from "$components/Lines.Standard.svelte";
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import { scaleOrdinal } from "d3-scale";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import _ from "lodash";
	import { fade } from "svelte/transition";

	export let data;
	export let highlight;
	export let isolate;
	export let phraseI;
	export let featuredIds;
	export let showStandard;
	export let intro;
	export let hideAll;
	export let videoVisible;
	export let step;

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
		? data.find((d) => d.id === highlight)?.pitch
		: undefined;
	$: highlightEnd = highlightData
		? _.last(highlightData.filter((d) => d.frequency)).timestamp
		: undefined;
</script>

<div class="chart-container">
	{#if intro}
		<div class="chart-header-slot">
			{#if !videoVisible}
				<h3>Vocal Pitch Throughout Anthem</h3>
			{/if}
		</div>
		{#if !videoVisible && step >= 3}
			<img
				id="intro-line-img"
				src="/assets/intro-lines.png"
				alt="vocal pitch lines throughout 138 performance"
				transition:fade
			/>
		{/if}
	{/if}
	<LayerCake
		padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
		x={xKey}
		y={yKey}
		z={zKey}
		{zScale}
		zDomain={[data.map((d) => d.id)]}
		yNice={4}
		yDomain={[0, 900]}
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
				ticks={intro && !hideAll ? 3 : 0}
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
	.chart-header-slot {
		width: 100%;
		margin-top: 3rem;
		height: 3rem;
	}
	:global(#intro .layercake-container) {
		z-index: 999;
	}
	#intro-line-img {
		left: 2rem;
		top: 3rem;
		width: calc(100% - 4rem);
		height: 500px;
		position: absolute;
		z-index: 1;
	}
	h3 {
		font-family: var(--sans);
		font-weight: 700;
		font-size: var(--16px);
		color: var(--color-grey-blue);
		margin: 0 0 1rem 0;
		text-transform: uppercase;
	}
	@media (max-width: 600px) {
		#intro-line-img {
			height: 250px;
		}
	}
</style>
