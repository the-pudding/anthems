<script>
	import Progress from "$components/Phrases.Progress.svelte";
	import Featured from "$components/Phrases.Featured.svelte";
	import Lines from "$components/Lines.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import { currentPhraseI, currentStepI } from "$stores/misc.js";
	import copy from "$data/copy.json";
	import ids from "$data/ids.csv";
	import pitch from "$data/pitch_normalized.csv";

	let sliderEl;
	let highlight;

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

	// just happens once when the step changes
	const onStep = () => {
		highlight = phrases[$currentPhraseI].steps[$currentStepI].highlight;
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
	$: topDivas = currentPhrase.topDivas;
	$: ourPicks = currentPhrase.ourPicks;
	$: $currentStepI, onStep();
</script>

<article>
	<Slider bind:this={sliderEl} bind:current={$currentPhraseI}>
		{#each phrases as phrase}
			<Slide index={phrase.i}>
				<div class="slide">
					<Featured {topDivas} {ourPicks} bind:highlight />

					<div class="main">
						<p>step {$currentStepI + 1} / {stepsInPhrase}</p>
						<p>{text}</p>
						<Lines {data} {highlight} />
						<h2>
							{#each phrase.lyrics.split(" ") as word}
								<span>{word}</span>
							{/each}
						</h2>
					</div>
				</div>
			</Slide>
		{/each}
	</Slider>

	<Progress lyrics={currentPhrase.lyrics} {sliderEl} />
</article>

<Tap on:tap={onTap} full={true} enableKeyboard={true} size={"50%"} />

<style>
	article {
		height: 100vh;
		background: #032e47;
	}
	.slide {
		background: #02273d;
		border: 3px solid #7ca4ae;
		height: 100%;
		padding: 2rem;
		display: flex;
	}
	.main {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
	h2 {
		font-family: Newsagent;
		font-size: 5rem;
		display: flex;
		justify-content: space-evenly;
	}
</style>
