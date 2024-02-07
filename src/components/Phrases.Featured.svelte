<script>
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { currentStepI, currentPhraseI, playing } from "$stores/misc.js";
	import _ from "lodash";
	import play from "$svg/play.svg";

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
	$: lastPhrase = $currentPhraseI == 15;
	$: innerHeight = 0;
	$: console.log(innerHeight)
</script>

<svelte:window bind:innerHeight />

{#if innerHeight}
	<div class="wrapper" class:visible class:lastPhrase style="height: {innerHeight}px">
		<button class="standard" on:click={selectStandard}>Standard <span>{@html play}</span></button>

		{#if top.length}
			<h3>Top divas</h3>
			{#each top as { id }, i}
				<div class={`section top`}>
					<div class="pics">
						<Face {id} bind:highlight {phraseI} />
					</div>
				</div>
			{/each}
			{#if lastPhrase}
				<button id="more-divas">More Divas</button>
			{/if}
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
{/if}

<style>
	.wrapper {
		margin-right: 3rem;
		padding-top: 1rem;
		max-width: 8rem;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.5s ease-in-out;
		display: flex;
		flex-direction: column;
		position: relative;
		/* align-items: center; */
	}
	.wrapper.visible {
		visibility: visible;
		opacity: 1;
	}
	.wrapper.lastPhrase {
		height: 100%;
		overflow: hidden;
	}
	h3 {
		font-size: 1rem;
		font-family: var(--sans);
		color: var(--color-fg);
		font-weight: bold;
		text-transform: uppercase;
		text-align: center;
		margin: 1rem 0 0 0;
	}
	.section {
		min-height: 9rem;
	}
	#more-divas {
		position: absolute;
		bottom: 0;
		left: 0;
	}
	.standard {
		width: 100%;
		height: 2rem;
		pointer-events: auto;
		text-transform: uppercase;
		font-weight: bold;
		font-family: var(--sans);
		background: var(--color-grey-blue);
		width: fit-content;
		padding: 0.25rem 2rem 0.25rem 0.5rem;
		border-radius: 0.25rem;
		color: var(--color-dark-blue);
		position: relative;
	}
	:global(.standard span) {
		position: absolute;
		right: 0;
	}
	:global(.standard span svg) {
		height: 1.25rem;
		margin: -0.3rem 0 0 0;
	}
	:global(.standard span svg path) {
		fill: var(--color-fg);
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
