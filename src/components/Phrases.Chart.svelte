<script>
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import BarChart from "$components/BarChart.svelte";
	import Spectrum from "$components/Spectrum.svelte";
	import divaByEvent from "$data/diva_by_event.csv";
	import divaByGenre from "$data/diva_by_genre.csv";
	import divaByPhrase from "$data/diva_by_phrase.csv";
	import keys from "$data/keys.csv";
	import copy from "$data/copy.json";
	import _ from "lodash";
	import { currentSlideI } from "$stores/misc.js";

	export let id;
	export let text;
	export let slideI;

	const lyrics = copy.slides
		.filter((d) => d.type === "phrase")
		.map((d) => d.lyrics);
</script>

<Slide index={slideI}>
	<div class="container">
		<p class="text">{@html text}</p>
		{#if id === "event"}
			<BarChart
				data={divaByEvent}
				title={"Average Diva Score by Event Type"}
				yKey={"eventType"}
			/>
		{:else if id === "genre"}
			<BarChart
				data={divaByGenre}
				title={"Average Diva Score by Music Genre"}
				yKey={"artistGenre"}
				yFormat={(d) => (d === "rnb" ? "R&B" : d)}
			/>
		{:else if id === "phrase"}
			<BarChart
				data={divaByPhrase}
				title={"Average Diva Score by Phrase"}
				yKey={"phrase_i"}
				yFormat={(d) =>
					`${+d + 1}. ${lyrics[+d].split(" ").slice(0, 2).join(" ")}...`}
				active={$currentSlideI === slideI}
				animate={true}
			/>
		{:else if id === "key"}
			<BarChart
				data={keys}
				title={"Distribution of Musical Keys"}
				xKey={"count"}
				yKey={"steps_from_C"}
				yFormat={(d) => keys.find((k) => +k.steps_from_C === +d)?.key}
				highlight={[-2, 6]}
				showNumber={true}
				showLegend={false}
			/>
		{:else if id === "repeat"}
			<Spectrum title={"How Similar Repeat Performers are to Themselves"} />
		{/if}
	</div>
</Slide>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.text {
		max-width: 600px;
		pointer-events: auto;
		line-height: 1.75;
		margin-left: 6rem;
	}

	@media (max-width: 600px) {
		.container {
			padding-top: 3rem;
		}
		.text {
			font-size: var(--14px);
			margin-left: 0;
		}
	}
</style>
