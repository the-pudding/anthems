<script>
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
		ready
	} from "$stores/misc.js";
	import copy from "$data/copy.json";
	import ids from "$data/ids.csv";
	import inView from "$actions/inView.js";
	import _ from "lodash";

	// const findTopDivas = () => {
	// 	const topDivas = [];
	// 	_.range(16).forEach((i) => {
	// 		const sorted = _.orderBy(ids, (d) => +d[`phrase${i}_diva`], "desc");
	// 		const topIds = sorted.slice(0, 3).map((d) => {
	// 			return d.id;
	// 		});
	// 		topDivas.push({ i: i, ids: topIds });
	// 	});
	// 	console.log(topDivas);
	// };
	// findTopDivas();

	let sliderEl;
	let tapVisible;

	const onTap = ({ detail }) => {
		if ($playing) $playing = undefined;

		if (detail === "right") {
			if ($currentStepI + 1 < stepsInPhrase) {
				$currentStepI += 1;
			} else if ($currentSlideI + 1 < slides.length) {
				$currentStepI = 0;
				sliderEl.next();
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
	const sectionEnter = () => {
		tapVisible = true;
	};
	const sectionExit = () => {
		tapVisible = false;
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
</script>

<section
	id="phrase-by-phrase"
	class:visible={$ready}
	use:inView
	on:enter={sectionEnter}
	on:exit={sectionExit}
>
	<Slider bind:this={sliderEl} bind:current={$currentSlideI}>
		{#each slides as slide}
			{@const active = +slide.i === $currentSlideI}
			<div
				class="slide-wrapper"
				class:chart={slide.type === "chart"}
				class:active
			>
				{#if slide.type === "phrase"}
					<Slide slideI={+slide.i} phrase={slide} />
				{:else}
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

	<Nav lyrics={currentPhrase.lyrics} {sliderEl} />
	<Tap
		on:tap={onTap}
		full={true}
		enableKeyboard={true}
		visible={tapVisible}
		size={"50%"}
	/>
</section>

<style>
	section {
		height: 100vh;
		overflow: hidden;
		display: none;
	}
	section.visible {
		display: block;
	}
	.slide-wrapper {
		opacity: 0.5;
		height: 100%;
	}
	.slide-wrapper.chart {
		opacity: 0.1;
	}
	.slide-wrapper.active {
		opacity: 1;
	}
</style>
