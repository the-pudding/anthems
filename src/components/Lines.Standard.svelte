<script>
	import data from "$data/processed_standard_words.csv";
	import { currentPhraseI } from "$stores/misc.js";
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";
	import stretch from "$utils/stretch.js";

	export let highlightEnd;

	const { yScale, xScale } = getContext("LayerCake");
	const blockH = 15;

	$: phraseData = data.filter((d) => +d.phrase === $currentPhraseI);
	$: firstTs = +phraseData[0].timestamp;
	$: original = phraseData.map((d) => ({
		...d,
		timestamp: +d.timestamp - firstTs,
		duration: +d.duration,
		frequency: +d.frequency,
		phrase: +d.phrase
	}));
	$: blockData = highlightEnd ? stretch(original, highlightEnd) : original;
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
		stroke: var(--color-gold);
		fill: transparent;
		opacity: 0.8;
	}
</style>
