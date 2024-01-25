<script>
	import data from "$data/processed_standard_words.csv";
	import { currentPhraseI } from "$stores/misc.js";
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";

	const { yScale, xScale } = getContext("LayerCake");
	const blockH = 15;

	$: phraseData = data.filter((d) => +d.phrase === $currentPhraseI);
	$: firstTs = +phraseData[0].timestamp;
	$: blockData = phraseData.map((d) => ({
		...d,
		timestamp: +d.timestamp - firstTs,
		duration: +d.duration,
		frequency: +d.frequency,
		phrase: +d.phrase
	}));
</script>

<g class="standard" transition:fade>
	{#each blockData as { timestamp, duration, frequency }}
		<rect
			x={$xScale(timestamp)}
			y={$yScale(frequency) - blockH / 2}
			width={$xScale(duration)}
			height={blockH}
		/>
	{/each}
</g>

<style>
	rect {
		stroke-width: 2px;
		stroke: #e3b97f;
		fill: transparent;
		opacity: 0.8;
	}
</style>
