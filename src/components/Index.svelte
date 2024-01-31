<script>
	import Title from "$components/Title.svelte";
	import Intro from "$components/Intro.svelte";
	import Phrases from "$components/Phrases.svelte";
	import Heatmap from "$components/Heatmap.svelte";
	import Audio from "$components/Audio.svelte";

	// TODO: methods, footer
</script>

<article>
	<!-- <Title />
	<Intro /> -->
	<!-- <Phrases /> -->
	<Heatmap />
	<Audio />
</article>

<style>
	article {
		padding: 3rem;
	}

	@media (max-width: 600px) {
		article {
			padding: 1rem;
		}
	}
</style>
