<script>
	import { currentStepI } from "$stores/misc.js";
	import _ from "lodash";

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
</script>

{#if topDivas && ourPicks}
	<div class="wrapper">
		{#each [topDivas, ourPicks] as data, i}
			{@const title = i === 0 ? "Top Divas" : "Our Picks"}
			{@const list =
				i === 0 ? data.split(",").map((d) => d.trim()) : data.map((d) => d.id)}
			<div class={`section ${_.kebabCase(title)}`}>
				<h3>{title}</h3>
				<div class="pics">
					{#each list as id}
						<img
							class:selected={id === selected}
							src={`assets/cutouts/${id.split("_")[0]}.png`}
							on:click={() => onClick(id)}
						/>
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
		img {
			height: 100%;
			width: auto;
			margin: 0;
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
