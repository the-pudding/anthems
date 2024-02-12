<script>
	import Box from "$components/Heatmap.Box.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import _ from "lodash";
	import { playing, currentTime } from "$stores/misc.js";
	import getPerformerData from "$utils/getPerformerData.js";
	import viewport from "$stores/viewport.js";

	export let i;
	export let data;
	export let activeColumn;
	export let activeCell;

	const { performer, event, year, key, rank } = getPerformerData(data.id);
	const phraseStartsAndEnds = _.range(0, 16).map((i) => {
		return {
			start: +data[`phrase${[i]}_start`],
			end: +data[`phrase${[i]}_end`]
		};
	});

	const playAll = () => {
		const id = data.id;
		if (id === $playing?.id) {
			$playing = undefined;
		} else {
			$playing = { id, phraseI: undefined };
		}
	};
	const updateActiveCell = () => {
		if (currentPhraseI === undefined || currentPhraseI === -1) {
			return;
		} else {
			activeCell = { row: data.id, col: currentPhraseI };
		}
	};

	$: playingMeFull =
		$playing && $playing.id === data.id && $playing.phraseI === undefined;
	$: currentPhraseI = playingMeFull
		? phraseStartsAndEnds.findIndex(
				(d) => d.start <= $currentTime && d.end >= $currentTime
		  )
		: undefined;
	$: currentPhraseI, updateActiveCell();
	$: mobile = $viewport.width < 600;
	$: paused = $playing?.id !== data.id;
</script>

<div class="heatmap-row" class:first={i === 0}>
	<div class="details-wrapper">
		<button
			id={`${data.id}-heatmap-btn`}
			class="play-btn"
			class:playing={!paused}
			on:click={playAll}
			aria-label="play"
		>
			{#key paused}
				<Icon
					name={paused ? "play" : "pause"}
					fill={"var(--color-dark-blue)"}
					stroke={"transparent"}
					size={mobile ? "1rem" : "1.25em"}
					strokeWidth={0}
				/>
			{/key}
		</button>
		<div class="details">
			<div class="top-row">
				<p class="name">{performer}</p>
				<p class="event">{year} {event}</p>
			</div>
			<p class="rank">
				<strong>#{rank}</strong> Diva / Key: {key}
			</p>
		</div>
	</div>
	<div class="box-wrapper">
		{#each _.range(1, 17) as phrase, i}
			{@const phraseIndex = `phrase${[i]}_diva`}
			{@const phraseMissing = !data[phraseIndex]}
			{@const background = phraseMissing
				? "url(assets/x-paper.png) center center / 65% no-repeat"
				: `rgba(124, 164, 174, ${data[phraseIndex] / 1000})`}
			<Box
				{i}
				id={data.id}
				bind:activeCell
				bind:activeColumn
				{background}
				{phraseMissing}
				start={+data[`phrase${[i]}_start`]}
				end={+data[`phrase${[i]}_end`]}
			/>
		{/each}
	</div>
</div>

<style>
	.heatmap-row {
		width: 100%;
		border-top: 1px solid var(--color-fg);
		display: flex;
		align-items: center;
		padding: 0.5rem 1.5rem;
	}
	.heatmap-row:first-of-type {
		border-top: none;
	}
	.details-wrapper {
		width: 15rem;
		display: flex;
		flex-direction: row;
		align-items: start;
		padding: 0.25rem 0 0.5rem 0;
	}
	.details {
		display: flex;
		flex-direction: column;
	}
	.play-btn {
		background: var(--color-fg);
		height: 2rem;
		width: 2rem;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0.4rem 0.5rem 0 0;
		transition: all calc(var(--1s) * 0.25) ease-in-out;
		box-shadow: rgba(0, 0, 0, 0.25) 0 2px 8px;
	}
	.play-btn:hover {
		background: var(--color-red);
		transform: translateY(-2px);
	}
	:global(.play-btn span) {
		padding: 0.25rem 0 0 0;
		margin-left: 0.125rem;
	}
	:global(.play-btn.playing span) {
		padding: 0.25rem 0 0 0;
		margin-left: 0;
	}
	.play-btn.playing {
		background: var(--color-red);
	}
	.name,
	.event,
	.rank {
		font-family: var(--sans);
		color: var(--color-fg);
		margin: 0;
		padding: 0;
		font-size: var(--14px);
	}
	.name {
		font-family: Newsagent;
		font-size: var(--28px);
	}
	.box-wrapper {
		flex: 1;
		display: flex;
		flex-direction: row;
	}

	@media (max-width: 600px) {
		.heatmap-row {
			flex-direction: column;
			align-items: start;
			padding: 0.5rem 1rem;
		}
		.details-wrapper {
			width: 100%;
			align-items: center;
		}
		.box-wrapper {
			width: 100%;
		}
		.details {
			flex-direction: column;
			width: 100%;
		}
		.top-row {
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		.name,
		.event,
		.rank {
			font-size: 13px;
		}
		.name {
			font-size: var(--20px);
			font-family: "Newsagent";
			margin-right: 0.5rem;
		}
		.event {
			padding-top: 0.25rem;
		}
		.play-btn {
			height: 1.75rem;
			width: 1.75rem;
			margin: 0rem 0.5rem 0 0;
		}
		:global(.play-btn span) {
			padding: 0.1rem 0 0 0;
			margin-left: 0.125rem;
		}
		:global(.play-btn.playing span) {
			padding: 0.1rem 0 0 0;
			margin-left: 0;
		}
	}
</style>
