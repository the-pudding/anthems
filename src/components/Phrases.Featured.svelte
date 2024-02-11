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
		<Icon name={"music-4"} size="1rem" stroke="white" />
	</button>

	<div class="faces" class:visible={sliderOpen}>
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
		height: 2rem;
		text-transform: uppercase;
		font-weight: bold;
		font-family: var(--sans);
		background: var(--color-grey-blue);
		width: fit-content;
		padding: 0.25rem 2rem 0.25rem 0.5rem;
		color: var(--color-dark-blue);
		position: relative;
		margin-bottom: 1rem;
		transition: all 250ms;
	}
	.standard:hover,
	.open-slider:hover,
	.close-slider:hover {
		background: var(--color-red);
		transform: translateY(-2px);
		box-shadow: rgba(2, 39, 61, 1) 0 4px 12px;
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
		background: var(--color-grey-blue);
		text-transform: uppercase;
		font-weight: 700;
		height: 2rem;
	}
	:global(.open-slider span) {
		margin: 0 0 0 0.25rem;
	}
	:global(.open-slider svg path) {
		stroke: var(--color-fg);
		fill: none;
	}
	:global(.open-slider svg circle) {
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
		}
		.standard {
			margin: 0;
		}
		h3 {
			display: none;
		}
		.faces {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			position: absolute;
			width: calc(100% + 2.5rem);
			max-width: none;
			margin-right: 0;
			margin-bottom: 0;
			padding: 1rem 5rem 1rem 1rem;
			top: -1rem;
			left: -1rem;
			background: var(--color-extra-dark-blue);
			height: auto;
			transform: translate(0, calc(-100% + -5rem));
			transition: transform calc(var(--1s) * 0.7) ease-in-out;
			border-bottom: 1px solid var(--color-grey-blue);
			direction: ltr;
		}
		.face {
			display: flex;
			min-width: 8rem;
			max-width: 8rem;
		}
		.faces.visible {
			transform: translate(0, 0);
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
			top: 4rem;
			right: 1rem;
			z-index: 10;
			display: none;
			background: var(--color-fg);
			border-radius: 50%;
			height: 2rem;
			width: 2rem;
		}
		.close-slider:hover {
		}
		.close-slider.visible {
			display: flex;
		}
	}
</style>
