<script>
	import Box from "$components/Heatmap.Box.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import _ from "lodash";
	import { playing } from "$stores/misc.js";
	import getPerformerData from "$utils/getPerformerData.js";

	export let data;
	export let activeColumn;
	export let activeCell;

	const { performer, event, year } = getPerformerData(data.id);

	const playAll = () => {
		const id = data.id;
		if (id === $playing?.id) {
			$playing = undefined;
		} else {
			$playing = { id, phraseI: undefined };
		}
	};

	$: paused = $playing?.id !== data.id;
</script>

<div class="heatmap-row">
	<div class="details-wrapper">
		<button
			id={`${data.id}-heatmap-btn`}
			class="play-btn"
			class:playing={!paused}
			on:click={playAll}
		>
			{#key paused}
				<Icon
					name={paused ? "play" : "pause"}
					fill={"var(--color-dark-blue)"}
					stroke={"transparent"}
					strokeWidth={0}
				/>
			{/key}
		</button>
		<div class="details">
			<p class="name">{performer}</p>
			<p class="event"><strong>{year}</strong> {event}</p>
			<p class="event">key: {data.key}</p>
		</div>
	</div>
	<div class="box-wrapper">
		{#each _.range(1, 17) as phrase, i}
			{@const phraseIndex = `phrase${[i]}_diva`}
			{@const background = `rgba(124, 164, 174, ${data[phraseIndex] / 1000})`}
			<Box {i} id={data.id} bind:activeCell bind:activeColumn {background} />
		{/each}
	</div>
</div>

<style>
	.heatmap-row {
		width: 100%;
		border-top: 1px solid var(--color-fg);
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
	}
	.heatmap-row:first-of-type {
		border-top: none;
	}
	.details-wrapper {
		width: 18rem;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.play-btn {
		background: var(--color-fg);
		height: 2rem;
		width: 2rem;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 0.5rem 0 0;
	}
	.play-btn.playing {
		background: var(--color-red);
	}
	.name,
	.event {
		color: var(--color-fg);
		margin: 0;
		padding: 0;
		font-size: var(--14px);
	}
	.name {
		font-family: Newsagent;
		font-size: var(--28px);
	}
	.event {
		font-family: var(--sans);
	}
	.box-wrapper {
		width: calc(100% - 20rem);
		display: flex;
		flex-direction: row;
	}
</style>
