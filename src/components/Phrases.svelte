<script>
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import { currentPhrase, currentPhraseStep } from "$stores/misc.js";
	import copy from "$data/copy.json";

	let sliderEl;
	const phrases = copy.phrases
		.filter((d) => d.steps)
		.map((d) => ({ ...d, i: +d.i }));

	$: stepsInPhrase = phrases[$currentPhrase].steps.length;

	const onTap = ({ detail }) => {
		if (detail === "right") {
			if ($currentPhraseStep + 1 < stepsInPhrase) {
				$currentPhraseStep += 1;
			} else if ($currentPhrase + 1 < phrases.length) {
				$currentPhraseStep = 0;
				sliderEl.next();
			}
		} else {
			if ($currentPhraseStep - 1 >= 0) {
				$currentPhraseStep -= 1;
			} else if ($currentPhrase > 0) {
				const prevPhrase = phrases[$currentPhrase - 1];
				$currentPhraseStep = prevPhrase.steps.length - 1;
				sliderEl.prev();
			}
		}
	};
</script>

<article>
	<Slider bind:this={sliderEl} bind:current={$currentPhrase}>
		{#each phrases as phrase}
			<Slide index={phrase.i}>
				<h2>{phrase.lyrics}</h2>
				<p>step {$currentPhraseStep + 1} / {stepsInPhrase}</p>
			</Slide>
		{/each}
	</Slider>
</article>

<Tap on:tap={onTap} full={true} enableKeyboard={true} size={"50%"} />

<style>
	article {
		height: 100vh;
	}
</style>
