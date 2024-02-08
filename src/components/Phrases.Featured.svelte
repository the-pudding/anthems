<script>
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { currentStepI, currentPhraseI, playing } from "$stores/misc.js";
	import _ from "lodash";
	import play from "$svg/play.svg";

	export let phraseI;
	export let featured;
	export let highlight;

	let showingMore = false;

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

	$: visible = $currentPhraseI !== 0 || $currentStepI >= 3;
	$: top = featured.filter((d) => d.type === "top");
	$: noteworthy = featured.filter((d) => d.type === "our-pick");
	$: allFaces = [...top, ...noteworthy];
	$: visibleFaces = allFaces.slice(0, 3);
</script>

<div class="wrapper">
	<button class="standard" on:click={selectStandard}
		>Standard <span>{@html play}</span></button
	>
	<div class="faces" class:visible class:scrollable={showingMore}>
		<h3>Top divas</h3>
		{#each visibleFaces as { id, type }, i}
			{#if type === "our-pick" && i > 0 && visibleFaces[i - 1].type === "top"}
				<h3>Our picks</h3>
			{/if}

			<div class="face">
				<Face {id} bind:highlight {phraseI} />
			</div>
		{/each}

		<button
			class="show-more"
			on:click={showMore}
			class:visible={!showingMore && allFaces.length > 3}>show more</button
		>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
	}
	.faces {
		margin-right: 3rem;
		padding-top: 1rem;
		max-width: 8rem;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.5s ease-in-out;
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100%;
		overflow: hidden;
	}
	.faces.scrollable {
		overflow: scroll;
	}
	.faces.visible {
		visibility: visible;
		opacity: 1;
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
		pointer-events: auto;
		visibility: hidden;
	}
	.show-more.visible {
		visibility: visible;
	}
	.face {
		min-height: 9rem;
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
		margin-bottom: 1rem;
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
		.faces {
			display: flex;
			justify-content: space-between;
			width: 100%;
			max-width: none;
			margin-right: 0;
			margin-bottom: 3rem;
		}
		.face {
			display: flex;
		}
	}

	@media (max-width: 600px) {
		.face {
			height: 50px;
		}
		h3 {
			margin-top: 0;
			margin-bottom: 0.5rem;
		}
	}
</style>
