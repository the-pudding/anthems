<script>
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { currentStepI, currentPhraseI } from "$stores/misc.js";
	import _ from "lodash";

	export let phraseI;
	export let featured;
	export let highlight;
	export let playAudio;

	const onClick = (id) => {
		if (highlight === id) {
			highlight = undefined;
		} else {
			highlight = id;
			playAudio(id);
		}
	};

	$: visible = $currentPhraseI !== 0 || $currentStepI >= 3;
	$: top = featured.filter((d) => d.type === "top");
	$: noteworthy = featured.filter((d) => d.type === "our-pick");
</script>

<div class="wrapper" class:visible>
	{#if top.length}
		<h3>Top divas</h3>
		{#each top as { id }, i}
			<div class={`section top`}>
				<div class="pics">
					<Face {id} {onClick} {highlight} {phraseI} />
				</div>
			</div>
		{/each}
	{/if}

	{#if noteworthy.length}
		<h3>Noteworthy</h3>
		{#each noteworthy as { id }, i}
			<div class={`section our-picks`}>
				<div class="pics">
					<Face {id} {onClick} {highlight} {phraseI} />
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
		color: #7ca4ae;
		font-weight: bold;
		text-transform: uppercase;
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
