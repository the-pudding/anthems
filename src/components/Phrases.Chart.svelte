<script>
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import BarChart from "$components/BarChart.svelte";
	import divaByEvent from "$data/diva_by_event.csv";
	import divaByGenre from "$data/diva_by_genre.csv";

	export let id;
	export let text;
	export let slideI;
</script>

<Slide index={slideI}>
	<p class="text">{@html text}</p>
	{#if id === "event"}
		<BarChart data={divaByEvent} title={"Event Type"} key={"eventType"} />
	{:else if id === "genre"}
		<BarChart data={divaByGenre} title={"Music Genre"} key={"artistGenre"} />
	{/if}
</Slide>

<style>
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
