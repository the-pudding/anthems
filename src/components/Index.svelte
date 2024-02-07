<script>
	import Title from "$components/Title.svelte";
	import Intro from "$components/Intro.svelte";
	import Phrases from "$components/Phrases.svelte";
	import Heatmap from "$components/Heatmap.svelte";
	import Audio from "$components/Audio.svelte";
	import Methods from "$components/Methods.svelte";
	import Footer from "$components/Footer.svelte";
	import { locked, entered } from "$stores/misc.js";
</script>

<article>
	<div class="start" class:locked={!$entered}>
		<Title />
		<Intro />
	</div>

	<div class="middle" class:locked={$locked} class:visible={$entered}>
		<Phrases />
		<Heatmap />
		<Methods />
		<Footer />
	</div>
	<Audio />
</article>

<style>
	article {
		padding: 0;
	}
	.start {
		height: auto;
		overflow: visible;
	}
	.middle {
		height: 100vh;
		display: none;
		overflow: visible;
	}
	.middle.visible {
		display: block;
	}
	div.locked {
		height: 100vh;
		overflow: hidden;
	}

	@media (max-width: 600px) {
		article {
			padding: 1rem;
		}
	}
</style>
