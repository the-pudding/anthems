<script>
	import Title from "$components/Title.svelte";
	import Intro from "$components/Intro.svelte";
	import Phrases from "$components/Phrases.svelte";
	import Heatmap from "$components/Heatmap.svelte";
	import Audio from "$components/Audio.svelte";
	import Methods from "$components/Methods.svelte";
	import Footer from "$components/Footer.svelte";
	import { locked } from "$stores/misc.js";
</script>

<article>
	<Title />
	<Intro />
	<div class:locked={$locked}>
		<Phrases />
		<Heatmap />
		<Methods />
		<Footer />
	</div>
	<Audio />
</article>

<style>
	article {
		padding: 3rem;
		padding-bottom: 0;
	}
	div {
		height: 100vh;
		overflow: visible;
	}
	div.locked {
		overflow: hidden;
	}

	@media (max-width: 600px) {
		article {
			padding: 1rem;
		}
	}
</style>
