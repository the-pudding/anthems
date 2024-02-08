<script>
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { currentStepI, currentPhraseI, playing } from "$stores/misc.js";
	import _ from "lodash";
	import play from "$svg/play.svg";
	import Icon from "$components/helpers/Icon.svelte";

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

	function divaPageChangeFWD() {
		currDivaPage = currDivaPage >= Math.ceil(totalDivaArray.length/3) ? Math.ceil(totalDivaArray.length/3) : currDivaPage + 1;
		if (currDivaPage == 0) {
			currDivaCollection = lastPhrase ? totalDivaArray.slice(0,4) : totalDivaArray.slice(0,3);
		} else if (currDivaPage == 1) {
			currDivaCollection = lastPhrase ? totalDivaArray.slice(4,8) : totalDivaArray.slice(3,6);
		} else if (currDivaPage == 2) {
			currDivaCollection = lastPhrase ? totalDivaArray.slice(8,10) : totalDivaArray.slice(6,9);
		}
	}

	function divaPageChangeBCK() {
		currDivaPage = currDivaPage <= 0 ? 0 : currDivaPage - 1;
		if (currDivaPage == 0) {
			currDivaCollection = lastPhrase ? totalDivaArray.slice(0,4) : totalDivaArray.slice(0,3);
		} else if (currDivaPage == 1) {
			currDivaCollection = lastPhrase ? totalDivaArray.slice(4,8) : totalDivaArray.slice(3,6);
		} else if (currDivaPage == 2) {
			currDivaCollection = lastPhrase ? totalDivaArray.slice(8,10) : totalDivaArray.slice(6,9);
		}
	}

	function updateDivaPage($currentPhraseI) {
		currDivaPage = 0;
	}

	$: visible = $currentPhraseI !== 0 || $currentStepI >= 3;
	$: top = featured.filter((d) => d.type === "top");
	$: noteworthy = featured.filter((d) => d.type === "our-pick");
	$: lastPhrase = $currentPhraseI == 15;
	$: totalDivaArray = top.concat(noteworthy);
	$: currDivaCollection = lastPhrase ? totalDivaArray.slice(0,4) : totalDivaArray.slice(0,3);
	$: currDivaPage = 0;
	$: updateDivaPage($currentPhraseI)
	$: leftBtnLocked = currDivaPage == 0;
	$: rightBtnLocked = currDivaCollection.length < 3;
	$: divaTextHead = !lastPhrase && currDivaPage > 0 ? "Our Picks" : "Top Divas";
	$: innerHeight = 0;
</script>

</script>

{#if innerHeight}
	<div
		class="wrapper"
		class:visible
		class:lastPhrase
		style="height: {innerHeight}px"
	>
		<button class="standard" on:click={selectStandard}
			>Standard <span>{@html play}</span></button
		>

	{#if totalDivaArray.length > 4}
		<div class="pagination">
			<button id="left-btn" on:click={divaPageChangeBCK} class:leftBtnLocked>
				<Icon name="chevron-left" size="1.25rem" fill="none" />
			</button>
			<h3>{divaTextHead}</h3>
			<button id="right-btn" on:click={divaPageChangeFWD} class:rightBtnLocked>
				<Icon name="chevron-right" size="1.25rem" fill="none" />
			</button>
		</div>
	{#each currDivaCollection as { id }, i}
		<div class={`section top`}>
			<div class="pics">
				<Face {id} bind:highlight {phraseI} />
			</div>
		</div>
	{/each}
	{:else}
		{#if top.length}
		<div class="pagination">
			<h3>Top Divas</h3>
		</div>
			{#each top as { id }, i}
				<div class={`section top`}>
					<div class="pics">
						<Face {id} bind:highlight {phraseI} />
					</div>
				</div>
			{/each}
		{/if}
	{/if}
<!-- 
	{#if noteworthy.length}
		<h3>Our Picks</h3>
		{#each noteworthy as { id }, i}
			<div class={`section our-picks`}>
				<div class="pics">
					<Face {id} bind:highlight {phraseI} />
				</div>
			</div>
		{/each}
	{/if} -->
</div>

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
	.pagination {
		margin: 1.5rem 0 1rem 0;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.pagination button {
		background: transparent;
		padding: 0;
		margin: 0;
		pointer-events: auto;
	}
	.pagination button.leftBtnLocked, .pagination button.rightBtnLocked {
		pointer-events: none;
		opacity: 0.25;
		cursor: not-allowed;
	}
	:global(.pagination button svg path) {
		stroke: var(--color-fg);
	}
	h3 {
		font-size: 1rem;
		width: 100%;
		font-family: var(--sans);
		color: var(--color-fg);
		font-weight: bold;
		text-transform: uppercase;
		text-align: center;
		margin: -0.25rem 0 0 0;
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
			display: flex;
			justify-content: center;
		}
		h3 {
			margin-top: 0;
			margin-bottom: 0.5rem;
		}
	}
</style>
