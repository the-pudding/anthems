<script>
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { currentStepI, currentPhraseI, playing } from "$stores/misc.js";
	import _ from "lodash";

	export let phraseI;
	export let featured;
	export let highlight;

	const selectStandard = () => {
		if (highlight === "standard") {
			$playing = undefined;
		} else {
			$playing = { id: "standard", phraseI };
		}
	};

	$: visible = $currentPhraseI !== 0 || $currentStepI >= 3;
	$: top = featured.filter((d) => d.type === "top");
	$: noteworthy = featured.filter((d) => d.type === "our-pick");
</script>

<div class="wrapper" class:visible>
	<button class="standard" on:click={selectStandard}>Standard</button>

	{#if top.length}
		<h3>Top divas</h3>
		{#each top as { id }, i}
			<div class={`section top`}>
				<div class="pics">
					<Face {id} bind:highlight {phraseI} />
				</div>
			</div>
		{/each}
	{/if}

	{#if noteworthy.length}
		<h3>Our Picks</h3>
		{#each noteworthy as { id }, i}
			<div class={`section our-picks`}>
				<div class="pics">
					<Face {id} bind:highlight {phraseI} />
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.wrapper {
		margin-right: 3rem;
		max-width: 100px;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.5s ease-in-out;
	}
	.wrapper.visible {
		visibility: visible;
		opacity: 1;
	}
	h3 {
		font-size: 1rem;
		font-family: var(--sans);
		color: var(--color-grey-blue);
		font-weight: bold;
		text-transform: uppercase;
	}
	.standard {
		pointer-events: auto;
		text-transform: uppercase;
		font-weight: bold;
		font-family: var(--sans);
		background: var(--color-grey-blue);
		width: fit-content;
		padding: 2px 0.75rem;
		border-radius: 0;
		color: var(--color-fg);
	}

	@media (max-width: 1000px) {
		.wrapper {
			display: flex;
			justify-content: space-between;
			width: 100%;
			max-width: none;
			margin-right: 0;
			margin-bottom: 3rem;
		}
		.pics {
			display: flex;
			height: 80px;
		}
		.our-picks {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
		}
	}

	@media (max-width: 600px) {
		.pics {
			height: 50px;
		}
		h3 {
			margin-top: 0;
			margin-bottom: 0.5rem;
		}
	}
</style>
