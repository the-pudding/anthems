<script>
	import Lines from "$components/Lines.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import { currentPhrase, currentPhraseStep } from "$stores/misc.js";
	import copy from "$data/copy.json";
	import ids from "$data/ids.csv";
	import pitch from "$data/pitch_normalized.csv";
	import example from "$data/pitch-transposed/aaliyah_nba-regular-season-game_1995_pitch.csv";

	let sliderEl;
	const phrases = copy.phrases
		.filter((d) => d.steps)
		.map((d) => ({ ...d, i: +d.i }));

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
				`phrase${$currentPhrase}_start`
			];
			const end = ids.find((d) => d.id === id)[`phrase${$currentPhrase}_end`];
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

	const allIds = ids.map((d) => d.id);
	const allPitch = castFloat(pitch);

	$: stepsInPhrase = phrases[$currentPhrase].steps.length;
	$: text = phrases[$currentPhrase].steps[$currentPhraseStep].text;
	$: data = prepareLineData($currentPhrase);
</script>

<article>
	<Slider bind:this={sliderEl} bind:current={$currentPhrase}>
		{#each phrases as phrase}
			<Slide index={phrase.i}>
				<h2>{phrase.lyrics}</h2>
				<p>step {$currentPhraseStep + 1} / {stepsInPhrase}</p>
				<p>{text}</p>
				<Lines {data} hide={[]} />
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
