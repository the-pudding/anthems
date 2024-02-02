<script>
	import _ from "lodash";
	import ids from "$data/ids.csv";
	import { playing } from "$stores/misc.js";

	export let phraseI;
	export let data;
	export let highlight;

	let selected;

	$: sortedData = _.orderBy(
		data,
		(d) => {
			const id = d.id;
			const divaScore = ids.find((d) => d.id === id)[`phrase${phraseI}_diva`];
			return +divaScore;
		},
		"desc"
	);

	const onUpdate = () => {
		highlight = selected;
		if (selected) $playing = { id: selected, phraseI };
	};
	const unselect = () => {
		selected = undefined;
		highlight = undefined;
	};

	$: selected, onUpdate();
</script>

<div class="popup">
	<strong>phrase {phraseI}</strong>
	<button on:click={unselect}>unselect all</button>
	{#if sortedData}
		{#each sortedData as { id } (id)}
			<label>
				<input type="radio" bind:group={selected} value={id} />
				{id}
			</label>
		{/each}
	{/if}
</div>

<style>
	.popup {
		background: var(--color-fg);
		color: var(--color-bg);
		height: 200px;
		padding: 1rem;
		position: absolute;
		right: 0;
		pointer-events: auto;
		overflow: scroll;
		font-size: 0.8rem;
		z-index: 1000;
	}
	label {
		display: flex;
	}
	:global(input[type="radio"]) {
		-webkit-appearance: radio;
		-moz-appearance: radio;
		appearance: radio;
	}
</style>
