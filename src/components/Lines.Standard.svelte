<script>
	import data from "$data/processed_standard_words.csv";
	import { currentPhraseI, playing } from "$stores/misc.js";
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";
	import stretch from "$utils/stretch.js";
	import viewport from "$stores/viewport.js";

	export let highlightEnd;
	export let intro;

	const { yScale, xScale } = getContext("LayerCake");
	const blockH = 15;

	$: highlight = $playing?.id === "standard";
	$: mobile = $viewport.width < 600;
	$: fullEndTs = mobile ? 154 : 154.6;
	$: phraseData = intro
		? data
		: data.filter((d) => +d.phrase === $currentPhraseI);
	$: firstTs = +phraseData[0].timestamp;
	$: original = phraseData.map((d) => ({
		...d,
		timestamp: +d.timestamp - firstTs,
		duration: +d.duration,
		frequency: +d.frequency,
		phrase: +d.phrase
	}));
	$: blockData = highlightEnd
		? stretch(original, highlightEnd)
		: intro
		? stretch(original, fullEndTs)
		: original;
</script>

<g class="standard" transition:fade>
	{#each blockData as { timestamp, duration, frequency }}
		<rect
			class:intro
			class:highlight
			x={$xScale(timestamp)}
			y={$yScale(frequency) - blockH / 2}
			width={$xScale.range().some((d) => d < 0) ? 0 : $xScale(duration)}
			height={blockH}
		/>
	{/each}
</g>

<style>
	rect {
		stroke-width: 2px;
		fill: var(--color-grey-blue);
		transition: fill calc(var(--1s) * 0.5);
	}
	rect.intro {
		stroke: var(--color-gold);
		stroke-width: 2px;
		fill: var(--color-red);
	}
	rect.highlight {
		fill: var(--color-red);
	}
</style>
