<script>
	import Icon from "$components/helpers/Icon.svelte";
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { playing } from "$stores/misc.js";
	import _ from "lodash";
	import play from "$svg/play.svg";

	export let phraseI;
	export let featured;
	export let highlight;

	let showingMore = false;
	let sliderOpen = false;

	const selectStandard = () => {
		if (highlight === "standard") {
			$playing = undefined;
		} else {
			$playing = { id: "standard", phraseI };
		}
	};
	const showMore = () => {
		showingMore = true;
		visibleFaces = allFaces;
	};
	const openSlider = () => {
		sliderOpen = true;
	};
	const closeSlider = () => {
		sliderOpen = false;
	};

	$: top = featured.filter((d) => d.type === "top");
	$: noteworthy = featured.filter((d) => d.type === "our-pick");
	$: allFaces = [...top, ...noteworthy];
	$: visibleFaces = allFaces.slice(0, 3);
</script>

<div class="wrapper">
	<button class="close-slider" on:click={closeSlider} class:visible={sliderOpen}
		>x</button
	>

	<button class="standard" on:click={selectStandard}
		>Standard <span>{@html play}</span></button
	>
	<button class="open-slider" on:click={openSlider}>Show divas</button>

	<div class="faces" class:scrollable={showingMore} class:visible={sliderOpen}>
		<h3>Top divas</h3>
		{#each visibleFaces as { id, type }, i}
			{#if type === "our-pick" && i > 0 && visibleFaces[i - 1].type === "top"}
				<h3>Our picks</h3>
			{/if}

			<div class="face">
				<Face
					id={id === "amber-riley_mlb-allstar-game_2010"
						? "beyonce_super-bowl_2004"
						: id}
					bind:highlight
					{phraseI}
				/>
			</div>
		{/each}

		{#if allFaces.length > 3}
			<button class="show-more" on:click={showMore} class:visible={!showingMore}
				>Show more</button
			>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
	}
	button {
		pointer-events: auto;
	}
	.faces {
		margin-right: 3rem;
		padding-top: 1rem;
		max-width: 8rem;
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100%;
		overflow: hidden;
	}
	.faces.scrollable {
		overflow: scroll;
	}
	h3 {
		font-size: 1rem;
		font-family: var(--sans);
		color: var(--color-fg);
		font-weight: bold;
		text-transform: uppercase;
		text-align: center;
		margin: 0 0 1rem 0;
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
		border-radius: 0.25rem;
		color: var(--color-dark-blue);
		position: relative;
		margin-bottom: 1rem;
	}
	.standard:hover {
		opacity: 0.6;
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
	}
	.close-slider {
		display: none;
	}

	@media (max-width: 1000px) {
		.open-slider {
			display: flex;
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
			width: 100%;
			max-width: none;
			margin-right: 0;
			margin-bottom: 0;
			top: 0;
			left: 0;
			background: var(--color-extra-dark-blue);
			height: auto;
			transform: translate(0, calc(-100% + -5rem));
			transition: transform calc(var(--1s) * 0.7) ease-in-out;
			overflow-x: scroll;
		}
		.face {
			display: flex;
			min-width: calc(33% - 2rem);
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
			top: 0;
			right: 0;
			z-index: 10;
			display: none;
		}
		.close-slider.visible {
			display: flex;
		}
	}
</style>
