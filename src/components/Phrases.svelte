<script>
	import Lines from "$components/Lines.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import { currentPhraseI, currentStepI } from "$stores/misc.js";
	import copy from "$data/copy.json";
	import ids from "$data/ids.csv";
	import pitch from "$data/pitch_normalized.csv";

	let sliderEl;

	const onTap = ({ detail }) => {
		if (detail === "right") {
			if ($currentStepI + 1 < stepsInPhrase) {
				$currentStepI += 1;
			} else if ($currentPhraseI + 1 < phrases.length) {
				$currentStepI = 0;
				sliderEl.next();
			}
		} else {
			if ($currentStepI - 1 >= 0) {
				$currentStepI -= 1;
			} else if ($currentPhraseI > 0) {
				const prevPhrase = phrases[$currentPhraseI - 1];
				$currentStepI = prevPhrase.steps.length - 1;
				sliderEl.prev();
			}
		}
	};
	const castFloat = (arr) => {
		return arr.map((obj) =>
			Object.fromEntries(
				Object.entries(obj).map(([key, value]) => [
					key,
					value === "" ? 0 : parseFloat(value)
				])
			)
		);
	};
	const prepareLineData = () => {
		return allIds.map((id) => {
			const start = ids.find((d) => d.id === id)[
				`phrase${$currentPhraseI}_start`
			];
			const end = ids.find((d) => d.id === id)[`phrase${$currentPhraseI}_end`];
			return {
				id: id,
				pitch: allPitch
					.filter((item) => item.timestamp >= start && item.timestamp <= end)
					.map((item) => ({
						timestamp: item.timestamp,
						frequency: item[id]
					}))
			};
		});
	};

	const phrases = copy.phrases
		.filter((d) => d.steps)
		.map((d) => ({ ...d, i: +d.i }));
	const allIds = ids.map((d) => d.id);
	const allPitch = castFloat(pitch);

	$: currentPhrase = phrases[$currentPhraseI];
	$: currentStep = currentPhrase.steps[$currentStepI];
	$: stepsInPhrase = currentPhrase.steps.length;
	$: data = prepareLineData($currentPhraseI);
	$: text = currentStep.text;
	$: highlight = currentStep.highlight;
</script>

<article>
	<Slider bind:this={sliderEl} bind:current={$currentPhraseI}>
		{#each phrases as phrase}
			<Slide index={phrase.i}>
				<h2>{phrase.lyrics}</h2>
				<p>step {$currentStepI + 1} / {stepsInPhrase}</p>
				<p>{text}</p>
				<Lines {data} {highlight} />
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
