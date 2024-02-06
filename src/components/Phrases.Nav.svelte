<script>
	import { currentPhraseI, currentStepI, locked } from "$stores/misc.js";
	import _ from "lodash";
	import copy from "$data/copy.json";
	import { tick } from "svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { onMount } from "svelte";

	export let lyrics;
	export let sliderEl;
	
	const phrases = copy.slides.filter((d) => d.type === "phrase");
	let selected;
	let dropdownI;
	let selectEl;

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
		const match = phrases.find((el) => el.lyrics == i)
		dropdownI = +match.i;
		
		sliderEl.jump(dropdownI);
	}

	function updateDropdown(currentPhraseI) {
		if (selectEl) {
			const options = Array.from(selectEl.options);
			const optionToSelect = options.find(item => item.value == phrases[currentPhraseI].lyrics);
			optionToSelect.selected = true;
			dropdownI = currentPhraseI;
		}
	}
	$: updateDropdown($currentPhraseI);
	$: pulse = $currentPhraseI == 15 ? true : false;
</script>

<div class="progress">
	<div class="bar-wrapper">
		<div class="horiz-bar"></div>
		<div class="select-wrapper" style="left: calc({dropdownI*4.5}%)">
			<select bind:value={selected} on:change={() => onChange(selected)} name="phrases" id="nav-phrases">
				{#each phrases as phrase}
					<option value={phrase.lyrics}>{phrase.lyrics}</option>
				{/each}
			</select>
		</div>
	</div>
	<!-- {#each _.range(16) as phrase}
		{@const active = phrase === $currentPhraseI}
		<div class="circle" class:active on:click={() => onClick(phrase)}>
			{active ? lyrics : ""}
		</div>
	{/each} -->
	<div class="skip">
		<div class="circle" class:pulse on:click={skip}>
			<Icon name="chevron-down" size="1.75rem" fill="none" />
		</div>
		<p>More data</p>
	</div>
</div>

<style>
	.progress {
		height: 6rem;
		max-width: 700px;
		margin: auto;
		display: flex;
		flex-direction: row;
		/* justify-content: space-evenly; */
		align-items: center;
		z-index: 2;
		position: relative;
		pointer-events: auto;
	}
	.bar-wrapper {
		width:calc(100% - 8rem);
		height: 2rem;
		position: relative;
	}
	.select-wrapper {
		position: absolute;
		width: 100%;
		top: 50%;
		height: 2rem;
		transform: translate(0, -50%);
		width: 7rem;
		background: var(--color-fg);
		border-radius: 1rem;
		z-index: 999;
		transition: left 0.5s linear;
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
		height: 2px;
		border-top: 2px solid var(--color-grey-blue);
		z-index: 1;
	}
	.circle {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--color-grey-blue);
		line-height: calc(2rem - 8px);
	}
	.circle:hover {
		cursor: pointer;
		opacity: 0.5;
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
		width: 8rem;
		margin: 0 0 0 3rem;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.skip .circle {
		background: var(--color-red);
		width: 1.75rem;
		height: 1.75rem;
		margin-right: 0.5rem
	}
	.pulse {
		animation: pulse-animation 1.25s infinite;
	}
	.skip p {
		font-family: var(--sans);
	}

	@keyframes pulse-animation {
		0% {
			transform: scale(1)
		}
		50% {
			transform: scale(1.25)
		}
		100% {
			transform: scale(1)
		}
	}

	@media (max-width: 600px) {
		.progress {
			height: 3rem;
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
	}
</style>
