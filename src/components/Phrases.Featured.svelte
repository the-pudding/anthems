<script>
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { currentPhraseI, currentStepI, playing } from "$stores/misc.js";
	import _ from "lodash";
	import play from "$svg/play.svg";
	import Icon from "$components/helpers/Icon.svelte";
	import { fade } from "svelte/transition";

	export let phraseI;
	export let featured;
	export let highlight;

	let sliderOpen = false;

	const selectStandard = () => {
		if (highlight === "standard") {
			$playing = undefined;
		} else {
			$playing = { id: "standard", phraseI };
		}
	};
	const openSlider = () => {
		sliderOpen = true;
	};
	const closeSlider = () => {
		sliderOpen = false;
	};

	$: visible = $currentPhraseI !== 0 || $currentStepI > 2;
</script>

<div class="wrapper" class:visible>
	<button class="standard" on:click={selectStandard}
		>Standard <span>{@html play}</span></button
	>
	{#if sliderOpen}
		<button
			class="close-slider"
			on:click={closeSlider}
			class:visible={sliderOpen}
			in:fade={{ duration: 250, delay: 500 }}
			><p>Hide divas</p>
			<Icon name={"x"} size="1rem" stroke="white" />
		</button>
	{:else}
		<button
			class="open-slider"
			on:click={openSlider}
			in:fade={{ duration: 250, delay: 500 }}
			>Show divas
			<Icon name={"star"} size="1rem" stroke="white" />
		</button>
	{/if}
	<div class="faces-wrapper" class:visible={sliderOpen}>
		<div class="faces">
			<h3>Top divas</h3>
			{#each featured.filter((d) => d.type !== "hidden") as { id, type }, i}
				{#if type === "our-pick" && i > 0 && featured[i - 1].type === "top"}
					<h3>Our picks</h3>
				{/if}

				<div class="face">
					<Face {id} name={id.split("_")[0]} bind:highlight {phraseI} />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		padding: 0.5rem 4rem 0 0;
		align-items: center;
		opacity: 0;
		transition: opacity var(--1s);
	}
	.wrapper.visible {
		opacity: 1;
	}
	button {
		pointer-events: auto;
	}
	.faces-wrapper {
		height: 100%;
		overflow: scroll;
		position: relative;
	}
	.faces {
		max-width: 8rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		height: 100%;
		overflow: scroll;
		direction: rtl;
	}
	.faces:last-child {
		padding-bottom: 2rem;
	}
	h3 {
		font-size: 1rem;
		font-family: var(--sans);
		color: var(--color-fg);
		font-weight: bold;
		text-transform: uppercase;
		text-align: center;
		margin: 1.5rem 0 0.25rem 0;
	}
	.show-more {
		display: none;
	}
	.show-more.visible {
		display: flex;
	}
	.standard {
		width: 100%;
		text-transform: uppercase;
		font-weight: bold;
		font-family: var(--sans);
		background: var(--color-grey-blue);
		width: fit-content;
		padding: 0.75rem 2rem 0.75rem 0.75rem;
		color: var(--color-dark-blue);
		position: relative;
		margin-bottom: 1rem;
		border-radius: 4px;
		transition: all calc(var(--1s) * 0.5) ease-in-out;
	}
	.standard:hover,
	.open-slider:hover,
	.close-slider:hover {
		background: var(--color-red);
		transform: translateY(-2px);
		color: var(--color-extra-dark-blue);
		box-shadow: rgba(0, 0, 0, 0.25) 0 2px 8px;
	}
	.open-slider:hover,
	.close-slider:hover {
		border: 1px solid var(--color-red);
		color: var(--color-extra-dark-blue);
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
	.open-slider,
	.close-slider {
		display: none;
		border: 1px solid var(--color-fg);
		background: transparent;
		font-weight: 700;
		height: 2.5rem;
		padding: 0.5rem;
		color: var(--color-fg);
		border-radius: 4px;
		transition: all calc(var(--1s) * 0.5) ease-in-out;
	}
	:global(.open-slider span, .close-slider span) {
		margin: 0.125rem 0 0 0.25rem;
	}
	:global(.open-slider svg polygon, .close-slider svg polygon) {
		stroke: var(--color-fg);
		fill: var(--color-fg);
	}
	.close-slider {
		display: none;
	}

	@media (max-width: 1000px) {
		.faces:last-child {
			padding-right: 4rem;
			padding-bottom: 0;
		}
		.open-slider,
		.close-slider {
			display: flex;
			align-items: center;
		}
		.close-slider {
			width: 2.5rem;
			height: 2.5rem;
			z-index: 999;
			border-radius: 50%;
			background: var(--color-red);
			border: 1px solid var(--color-red);
		}
		:global(.close-slider svg path) {
			stroke: var(--color-extra-dark-blue);
		}
		.close-slider p {
			display: none;
		}
		:global(.close-slider span) {
			margin: 0.125rem 0 0 0;
		}
		.wrapper {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			z-index: 10;
			padding: 0.5rem 1rem 0 1rem;
		}
		.standard {
			margin: 0;
		}
		h3 {
			display: none;
		}
		.faces-wrapper {
			position: absolute;
			transition:
				height calc(var(--1s) * 0.7) ease-in-out,
				padding-top calc(var(--1s) * 0.7) ease-in-out,
				padding-bottom calc(var(--1s) * 0.7) ease-in-out;
			border-bottom: 1px solid var(--color-grey-blue);
			background: var(--color-extra-dark-blue);
			width: 100%;
			height: 0;
			max-width: none;
			margin-right: 0;
			margin-bottom: 0;
			padding-top: 0;
			top: 0;
			left: 0;
		}
		.faces-wrapper.visible {
			height: 10rem;
			padding-top: 1rem;
			padding-bottom: 1rem;
		}
		.faces {
			display: flex;
			flex-direction: row;
			align-items: center;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			direction: ltr;
			max-width: none;
		}
		.face {
			display: flex;
			min-width: 8rem;
			max-width: 8rem;
		}
		.show-more {
			display: none;
			margin-right: 1rem;
			font-size: var(--14px);
			white-space: nowrap;
		}
		.show-more.visible {
			display: flex;
		}
		.close-slider.visible {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		:global(.close-slider span) {
			margin-top: 3px;
		}
	}
	@media (max-width: 600px) {
		.wrapper {
			padding: 0 3.5rem 0 0;
		}
		.faces {
			margin-right: 4rem;
		}
		.face:last-of-type {
			margin-right: 4rem;
		}
		.open-slider,
		.standard,
		.close-slider {
			font-size: var(--14px);
		}
		.open-slider,
		.close-slider {
			position: absolute;
			top: -3.5rem;
			left: 8.5rem;
		}
		.close-slider {
			width: auto;
			height: auto;
			border-radius: 4px;
			background: var(--color-red);
			border: 1px solid var(--color-red);
		}
		.close-slider p {
			display: inline-block;
			margin: 0;
			color: var(--color-extra-dark-blue);
		}
		.standard {
			position: absolute;
			top: -3.5rem;
			left: 0;
		}
		:global(.close-slider span) {
			margin: 0.125rem 0 0 0.25rem;
		}
		:global(.standard span svg) {
			margin: -0.4rem 0 0 0;
		}
	}
</style>
