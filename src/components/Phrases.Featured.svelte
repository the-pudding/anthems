<script>
	import { currentStepI } from "$stores/misc.js";

	export let topDivas;
	export let ourPicks;
	export let highlight;

	let selected;

	const onClick = (id) => {
		if (selected === id) {
			selected = undefined;
			highlight = undefined;
		} else {
			selected = id;
			highlight = id;
			// play id's audio for this phrase - should we cut all the examples down and store?
		}
	};

	// an audio component that takes: id, phraseI
	// it exports a function that lets you play it
	// it finds that id's start and end for that phrase
	// plays the audio starting at start and stops at end

	const onStep = () => {
		selected = undefined;
	};

	$: $currentStepI, onStep();
</script>

<div class="wrapper">
	{#if topDivas}
		<h3>Top Divas</h3>
		{#each topDivas.split(",").map((d) => d.trim()) as id}
			<img
				class:selected={id === selected}
				src={`assets/cutouts/${id.split("_")[0]}.png`}
				on:click={() => onClick(id)}
			/>
			<audio src={`assets/vocals/${id}.mp3`} />
		{/each}
	{/if}

	{#if ourPicks}
		<h3>Our Picks</h3>
		{#each ourPicks as { id, note }}
			<div class="pick">
				<img
					class:selected={id === selected}
					src={`assets/cutouts/${id.split("_")[0]}.png`}
					on:click={() => onClick(id)}
				/>
				<audio src={`assets/vocals/${id}.mp3`} />
			</div>
		{/each}
	{/if}
</div>

<style>
	.wrapper {
		margin-right: 1rem;
		max-width: 100px;
	}
	h3 {
		font-size: 1rem;
		font-family: var(--sans);
		color: #7ca4ae;
		font-weight: bold;
		text-transform: uppercase;
	}
	.pick {
		position: relative;
	}
	.note {
		position: absolute;
		font-family: var(--sans);
		top: 50%;
		left: 100%;
		transform: translate(0, -50%);
		width: 100%;
	}
	img {
		width: 60%;
		margin: 1rem 0;
		pointer-events: auto;
	}
	img:hover {
		opacity: 0.5;
		cursor: pointer;
	}
	img.selected {
		border: 3px solid red;
	}
</style>
