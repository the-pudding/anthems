<script>
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { playing } from "$stores/misc.js";
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
</script>

<div class="wrapper">
	{#if sliderOpen}
		<button
			class="close-slider"
			on:click={closeSlider}
			class:visible={sliderOpen}
			in:fade={{ duration: 500, delay: 1000 }}
			><Icon name={"x"} size="1rem" stroke="white" />
		</button>
	{/if}
	<button class="standard" on:click={selectStandard}
		>Standard <span>{@html play}</span></button
	>
	<button class="open-slider" on:click={openSlider}
		>Show divas
		<Icon name={"star"} size="1rem" stroke="white" />
	</button>
	<div class="faces-wrapper" class:visible={sliderOpen}>
		<div class="faces">
			<h3>Top divas</h3>
			{#each featured as { id, type }, i}
				{#if type === "our-pick" && i > 0 && featured[i - 1].type === "top"}
					<h3>Our picks</h3>
				{/if}

				<div class="face">
					<Face {id} bind:highlight {phraseI} />
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
		box-shadow: rgba(0, 0, 0, 0.25) 0 2px 8px;
	}
	.open-slider:hover {
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
	.open-slider {
		display: none;
		border: 1px solid var(--color-fg);
		background: transparent;
		text-transform: uppercase;
		font-weight: 700;
		height: 2.5rem;
		padding: 0.5rem;
		color: var(--color-fg);
		border-radius: 4px;
		transition: all calc(var(--1s) * 0.5) ease-in-out;
	}
	:global(.open-slider span) {
		margin: 0.125rem 0 0 0.25rem;
	}
	:global(.open-slider svg polygon) {
		stroke: var(--color-fg);
		fill: var(--color-fg);
	}
	.close-slider {
		display: none;
	}

	@media (max-width: 1000px) {
		.open-slider {
			display: flex;
			align-items: center;
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
			transition: height calc(var(--1s) * 0.7) ease-in-out, padding-top calc(var(--1s) * 0.7) ease-in-out, padding-bottom calc(var(--1s) * 0.7) ease-in-out;
			border-bottom: 1px solid var(--color-grey-blue);
			background: var(--color-extra-dark-blue);
			width: 100%;
			height: 0;
			max-width: none;
			margin-right: 0;
			margin-bottom: 0;
			padding-top: 0;
			padding-right: 5rem;
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
		.close-slider {
			position: absolute;
			top: 1.5rem;
			right: 2rem;
			z-index: 10;
			display: none;
			background: var(--color-fg);
			border-radius: 50%;
			height: 2.5rem;
			width: 2.5rem;
			z-index: 999;
			transition: all calc(var(--1s) * 0.25) ease-in-out;
			box-shadow: rgba(0, 0, 0, 0.5) 0 2px 8px;
		}
		.close-slider:hover {
			box-shadow: rgba(0, 0, 0, 0.5) 0 2px 8px;
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
			padding: 1rem 3.5rem 0 1rem;
		}
		.faces {
			margin-right: 4rem;
		}
		.close-slider {
			top: 5rem;
			right: 1.25rem;
		}
		.open-slider, .standard {
			font-size: var(--14px);
		}
		:global(.standard span svg) {
			margin: -0.4rem 0 0 0;
		}
	}
	@media (max-width: 600px) {
		.wrapper {
			padding: 0 3.5rem 0 0;
		}
		.close-slider {
			top: 4rem;
			right: 0.8rem;
		}
	}
</style>
