<script>
	import { currentPhraseI, currentStepI } from "$stores/misc.js";
	import _ from "lodash";
	import copy from "$data/copy.json";

	export let lyrics;
	export let sliderEl;

	const onClick = (i) => {
		const phraseI = _.findIndex(copy.slides, (d) => +d.phraseI === i);
		if (phraseI !== -1) {
			sliderEl.jump(phraseI);
			$currentStepI = 0;
		}
	};
</script>

<div class="progress">
	{#each _.range(16) as phrase}
		{@const active = phrase === $currentPhraseI}
		<div class="circle" class:active on:click={() => onClick(phrase)}>
			{active ? lyrics : ""}
		</div>
	{/each}
</div>

<style>
	.progress {
		height: 6rem;
		max-width: 700px;
		margin: auto;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		z-index: 2;
		position: relative;
		pointer-events: auto;
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

	@media (max-width: 600px) {
		.progress {
			height: 3rem;
		}
		.circle {
			width: 0.5rem;
			height: 0.5rem;
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
