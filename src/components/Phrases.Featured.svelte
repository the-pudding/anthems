<script>
	import Face from "$components/Phrases.Featured.Face.svelte";
	import { currentStepI, currentPhraseI } from "$stores/misc.js";
	import _ from "lodash";

	export let phraseI;
	export let topDivas;
	export let ourPicks;
	export let highlight;
	export let playAudio;

	let selected;

	const onStep = () => {
		selected = undefined;
	};
	const onClick = (id) => {
		if (selected === id) {
			selected = undefined;
			highlight = undefined;
		} else {
			selected = id;
			highlight = id;
			playAudio(id);
		}
	};

	$: $currentStepI, onStep();
	$: visible = $currentPhraseI !== 0 || $currentStepI >= 3;
</script>

{#if topDivas && ourPicks}
	<div class="wrapper" class:visible>
		{#each [topDivas, ourPicks] as data, i}
			{@const title = i === 0 ? "Top Divas" : "Our Picks"}
			{@const list =
				i === 0 ? data.split(",").map((d) => d.trim()) : data.map((d) => d.id)}
			<div class={`section ${_.kebabCase(title)}`}>
				<h3>{title}</h3>
				<div class="pics">
					{#each list as id}
						<Face {id} {onClick} {selected} {phraseI} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

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
