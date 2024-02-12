<script>
	import PlayableText from "$components/PlayableText.svelte";
	import Chart from "$components/Phrases.Chart.svelte";
	import Nav from "$components/Phrases.Nav.svelte";
	import Slide from "$components/Phrases.Slide.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import {
		currentSlideI,
		currentPhraseI,
		currentStepI,
		playing,
		locked
	} from "$stores/misc.js";
	import copy from "$data/copy.json";
	import _ from "lodash";
	import { onMount, tick } from "svelte";

	let sliderEl;

	const onTap = async ({ detail }) => {
		if ($playing) $playing = undefined;

		if (detail === "right") {
			if ($currentStepI + 1 < stepsInPhrase) {
				$currentStepI += 1;
			} else if ($currentSlideI + 1 < slides.length) {
				$currentStepI = 0;
				sliderEl.next();
			} else {
				$locked = false;
				await tick();
				const heatmap = document.getElementById("transition-to-heatmap");
				heatmap.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		} else {
			if ($currentStepI - 1 >= 0) {
				$currentStepI -= 1;
			} else if ($currentSlideI > 0) {
				const prevSlide = slides[$currentSlideI - 1];
				$currentStepI =
					prevSlide.type === "chart" ? 0 : prevSlide.steps.length - 1;
				sliderEl.prev();
			}
		}
	};
	const slides = copy.slides.map((d) => ({
		...d,
		i: +d.i,
		phraseI: +d.phraseI
	}));
	const phrases = copy.slides.filter((d) => d.type === "phrase");

	$: currentSlide = slides[$currentSlideI];
	$: currentPhrase = phrases[$currentPhraseI];
	$: $currentPhraseI = currentSlide.phraseI;
	$: stepsInPhrase =
		currentSlide.type === "chart" ? 1 : currentPhrase.steps.length;

	onMount(() => {
		const playable = document.querySelectorAll("#phrase-by-phrase .playable");
		playable.forEach((el) => {
			const text = el.innerText;
			const id = el.dataset.id;
			const phraseI = el.dataset.phrase;
			el.innerText = "";
			new PlayableText({
				target: el,
				props: {
					id,
					phraseI,
					text
				}
			});
		});
	});
</script>

<section id="phrase-by-phrase">
	<Slider bind:this={sliderEl} bind:current={$currentSlideI}>
		{#each slides as slide}
			{@const active = +slide.i === $currentSlideI}
			<div
				class="slide-wrapper"
				class:chart={slide.type === "chart"}
				class:active
			>
				{#if slide.type === "phrase"}
					<Slide slideI={+slide.i} phrase={slide} {active} />
				{:else if slide.type === "chart"}
					<Chart
						slideI={+slide.i}
						id={slide.chart}
						text={slide.text}
						active={+slide.i === $currentSlideI}
					/>
				{/if}
			</div>
		{/each}
	</Slider>

	<Tap on:tap={onTap} full={true} enableKeyboard={true} size={"50%"} />

	<Nav {sliderEl} />
</section>

<style>
	section {
		height: 100svh;
		overflow: hidden;
		position: relative;
		width: 100%;
	}
	.slide-wrapper {
		opacity: 0.5;
		height: 100%;
		pointer-events: none;
		overflow: scroll;
	}
	.slide-wrapper.chart {
		opacity: 0.1;
	}
	.slide-wrapper.active {
		opacity: 1;
		pointer-events: auto;
	}
</style>
