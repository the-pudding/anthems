<script>
	import Chart from "$components/Phrases.Chart.svelte";
	import Audio from "$components/Phrases.Audio.svelte";
	import Nav from "$components/Phrases.Nav.svelte";
	import Slide from "$components/Phrases.Slide.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import { currentPhraseI, currentStepI } from "$stores/misc.js";
	import copy from "$data/copy.json";
	import ids from "$data/ids.csv";

	let currentSlideI = 0;
	let sliderEl;
	let f;
	let currentTime;
	let idPlaying;

	const onTap = ({ detail }) => {
		if (idPlaying) pauseAudio(idPlaying);

		if (detail === "right") {
			if ($currentStepI + 1 < stepsInPhrase) {
				$currentStepI += 1;
			} else if (currentSlideI + 1 < slides.length) {
				$currentStepI = 0;
				sliderEl.next();
			}
		} else {
			if ($currentStepI - 1 >= 0) {
				$currentStepI -= 1;
			} else if (currentSlideI > 0) {
				const prevSlide = slides[currentSlideI - 1];
				$currentStepI =
					prevSlide.type === "chart" ? 0 : prevSlide.steps.length - 1;
				sliderEl.prev();
			}
		}
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

	const slides = copy.slides.map((d) => ({
		...d,
		i: +d.i,
		phraseI: +d.phraseI
	}));
	const phrases = copy.slides.filter((d) => d.type === "phrase");

	$: currentSlide = slides[currentSlideI];
	$: currentPhrase = phrases[$currentPhraseI];
	$: $currentPhraseI = currentSlide.phraseI;
	$: stepsInPhrase =
		currentSlide.type === "chart" ? 1 : currentPhrase.steps.length;
</script>

<section id="phrase-by-phrase">
	<Slider bind:this={sliderEl} bind:current={currentSlideI}>
		{#each slides as slide}
			{@const active = +slide.i === currentSlideI}
			<div class="slide-wrapper" class:active>
				{#if slide.type === "phrase"}
					<Slide slideI={+slide.i} phrase={slide} {playAudio} />
				{:else}
					<Chart
						slideI={+slide.i}
						id={slide.chart}
						text={slide.text}
						active={+slide.i === currentSlideI}
					/>
				{/if}
			</div>
		{/each}
	</Slider>

	<Nav lyrics={currentPhrase.lyrics} {sliderEl} />
	<Audio />
</section>

<Tap on:tap={onTap} full={true} enableKeyboard={true} size={"50%"} />

<style>
	section {
		height: 100vh;
		overflow: hidden;
	}
	.slide-wrapper {
		opacity: 0.5;
	}
	.slide-wrapper.active {
		opacity: 1;
	}
</style>
