<script>
	import { currentPhraseI, currentStepI, currentSlideI, locked } from "$stores/misc.js";
	import _ from "lodash";
	import copy from "$data/copy.json";
	import { tick } from "svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { onMount } from "svelte";
	import { scaleLinear } from "d3-scale";

	export let sliderEl;

	const phrases = copy.slides.filter((d) => d.type === "phrase");
	let selected;
	let dropdownI;
	let selectEl;
	let progressWidth;

	onMount(() => {
		selectEl = document.querySelector("#nav-phrases");
	});

	const onClick = (i) => {
		const phraseI = _.findIndex(copy.slides, (d) => +d.phraseI === i);
		if (phraseI !== -1) {
			sliderEl.jump(phraseI);
			$currentStepI = 0;
		}
	};
	const skip = async () => {
		$locked = false;
		await tick();
		const heatmap = document.getElementById("transition-to-heatmap");
		heatmap.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const onChange = (i) => {
		const match = phrases.find((el) => el.lyrics == i);
		dropdownI = +match.i;
		sliderEl.jump(dropdownI);
	};

	function updateDropdown() {
		if (selectEl) {
			const options = Array.from(selectEl.options);
			const optionToSelect = options.find(
				(item) => item.value == phrases[$currentPhraseI].lyrics
			);
			optionToSelect.selected = true;
			dropdownI = $currentPhraseI;
		}
	}

	// function setFraction($currentPhraseI) {
	// 	const prevSlide = $currentSlideI == 0 ? 0 : $currentSlideI - 1;
	// 	console.log(prevSlide, $currentSlideI)
	// 	if (prevSlide == $currentSlideI) {
	// 		let phraseMatch = phrases.find((el) => el.i == $currentSlideI);
	// 		let numSteps = phraseMatch.steps.length;
	// 		return `${$currentPhraseI + 1}/${numSteps}`
	// 	}
	// }
	$: xScale = scaleLinear()
		.domain([0, 15])
		.range([0, progressWidth || 0]);
	$: $currentPhraseI, updateDropdown();
	$: pulse = $currentPhraseI == 15;
	// $: fractionText = setFraction($currentStepI);
</script>

<div class="progress">
	<div class="bar-wrapper" bind:clientWidth={progressWidth}>
		<div class="horiz-bar"></div>
		<div class="select-wrapper" style={`left: ${xScale($currentStepI)}px`}>
			<select
				bind:value={selected}
				on:change={() => onChange(selected)}
				name="phrases"
				aria-label="select a phrase"
				id="nav-phrases"
			>
				{#each phrases as phrase}
					<option value={phrase.lyrics}>{phrase.lyrics}</option>
				{/each}
			</select>
		</div>
		<!-- <p class="slide-hint" style={`left: ${xScale($currentPhraseI)}px`}>{fractionText}</p> -->
	</div>

	<div class="skip">
		<div class="circle" class:pulse on:click={skip}>
			<Icon name="chevron-down" size="1.75rem" fill="none" />
		</div>
		<p class="more-data">More data</p>
	</div>
</div>

<style>
	.progress {
		height: 6rem;
		max-width: 700px;
		margin: auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		z-index: 2;
		position: relative;
		pointer-events: auto;
		padding: 0 1rem 1rem 1rem;
	}
	.bar-wrapper {
		flex: 1;
		height: 2rem;
		position: relative;
	}
	.select-wrapper {
		position: absolute;
		width: 100%;
		top: 50%;
		padding: 0.25rem;
		transform: translate(-50%, -50%);
		width: 7rem;
		background: var(--color-fg);
		border-radius: 4px;
		z-index: 999;
		transition: left calc(var(--1s) * 0.5) linear;
	}
	.select-wrapper:hover {
		background: #fbf3df;
	}
	.slide-hint {
		position: absolute;
		color: var(--color-grey-blue);
		top: 1.5rem;
		transform: translate(-50%, 0);
		font-family: var(--sans);
		font-size: var(--14px);
		transition: left calc(var(--1s) * 0.5) linear;
	}
	select {
		width: 100%;
		overflow: hidden;
		background-color: transparent;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0.4rem 2rem 0.4rem 1rem;
		background-position: right 1rem center;
	}
	.horiz-bar {
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 1px;
		border-top: 1px solid var(--color-grey-blue);
		z-index: 1;
	}
	.circle {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: var(--color-grey-blue);
		line-height: calc(2rem - 8px);
	}
	.circle:hover {
		cursor: pointer;
		transform: scale(1.25);
		transition: all calc(var(--1s) * 0.25) linear;
	}
	.active {
		width: auto;
		height: 2rem;
		border-radius: 1rem;
		padding: 4px 8px;
		background: var(--color-fg);
		font-size: 14px;
		font-family: var(--sans);
		color: var(--color-bg);
		white-space: nowrap;
		width: 5rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.skip {
		position: relative;
		margin-left: 6rem;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.skip .circle {
		background: var(--color-red);
		width: 2.5rem;
		height: 2.5rem;
		margin-right: 0.65rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	:global(.skip .circle svg) {
		margin-top: 5px;
	}
	.pulse {
		animation: pulse-animation calc(var(--1s) * 1.25) infinite;
	}
	.skip p {
		font-family: var(--sans);
	}

	@keyframes pulse-animation {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.25);
		}
		100% {
			transform: scale(1);
		}
	}

	@media (max-width: 800px) {
		.progress {
			max-width: 500px;
		}
	}

	@media (max-width: 600px) {
		.progress {
			height: 4rem;
			max-width: none;
		}
		.circle {
			width: 4rem;
			height: 4rem;
			line-height: calc(1rem - 4px);
		}
		.active {
			height: 1rem;
			padding: 2px 4px;
			font-size: 10px;
			width: 4rem;
		}
		.more-data {
			display: none;
		}
		.skip {
			margin-left: 1rem;
		}
		.bar-wrapper {
			margin: 0 4.5rem;
		}
	}
</style>
