<script>
	import Audio from "$components/Phrases.Audio.svelte";
	import Nav from "$components/Phrases.Nav.svelte";
	import Slide from "$components/Phrases.Slide.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import { currentPhraseI, currentStepI } from "$stores/misc.js";
	import copy from "$data/copy.json";
	import ids from "$data/ids.csv";
	import play from "$svg/play.svg";
	import { onMount } from "svelte";

	let sliderEl;
	let highlight;
	let f;
	let currentTime;
	let idPlaying;

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
	const onNewStep = () => {
		highlight = phrases[$currentPhraseI].steps[$currentStepI].highlight;
		if (idPlaying) pauseAudio(idPlaying);
	};
	const playAudio = (id) => {
		if (idPlaying) pauseAudio(idPlaying);

		const audioEl = document.getElementById(`${id}-audio`);
		const myId = ids.find((d) => d.id === id);
		const start = +myId[`phrase${$currentPhraseI}_start`];
		const end = +myId[`phrase${$currentPhraseI}_end`];

		idPlaying = id;
		audioEl.currentTime = start;
		audioEl.play();

		const checkTime = () => {
			currentTime = audioEl.currentTime;
			if (currentTime >= end) {
				idPlaying = undefined;
				audioEl.pause();
				audioEl.currentTime = start;
				cancelAnimationFrame(f);
			} else {
				f = requestAnimationFrame(checkTime);
			}
		};

		f = requestAnimationFrame(checkTime);
	};
	const pauseAudio = (id) => {
		const audioEl = document.getElementById(`${id}-audio`);
		audioEl.pause();
		cancelAnimationFrame(f);
		idPlaying = undefined;
	};

	const phrases = copy.phrases
		.filter((d) => d.steps)
		.map((d) => ({ ...d, i: +d.i }));

	$: currentPhrase = phrases[$currentPhraseI];
	$: stepsInPhrase = currentPhrase.steps.length;
	$: $currentStepI, onNewStep();

	onMount(() => {
		const playableText = document.querySelectorAll("span.playable");
		playableText.forEach((el) => {
			el.addEventListener("click", () => {
				const id = el.dataset.id;
				highlight = id;
				playAudio(id);
			});
			el.insertAdjacentHTML("beforeend", play);
		});
	});
</script>

<article>
	<Slider bind:this={sliderEl} bind:current={$currentPhraseI}>
		{#each phrases as phrase}
			<Slide {phrase} {playAudio} bind:highlight />
		{/each}
	</Slider>

	<Nav lyrics={currentPhrase.lyrics} {sliderEl} />
	<Audio />
</article>

<Tap on:tap={onTap} full={true} enableKeyboard={true} size={"50%"} />

<style>
	article {
		height: 100vh;
		overflow: hidden;
	}
</style>
