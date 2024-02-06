<script>
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import BarChart from "$components/BarChart.svelte";
	import divaByEvent from "$data/diva_by_event.csv";
	import divaByGenre from "$data/diva_by_genre.csv";
	import divaByPhrase from "$data/diva_by_phrase.csv";
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
			<BarChart data={divaByEvent} title={"Event Type"} yKey={"eventType"} />
		{:else if id === "genre"}
			<BarChart
				data={divaByGenre}
				title={"Music Genre"}
				yKey={"artistGenre"}
				yFormat={(d) => (d === "rnb" ? "R&B" : d)}
			/>
		{:else if id === "phrase"}
			<BarChart
				data={divaByPhrase}
				title={"Phrase"}
				yKey={"phrase_i"}
				yFormat={(d) =>
					`(${+d + 1}) ${lyrics[+d].split(" ").slice(0, 2).join(" ")}...`}
				active={$currentSlideI === slideI}
				animate={true}
			/>
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
		.text {
			font-size: 0.9rem;
			margin-left: 0;
		}
	}
</style>
