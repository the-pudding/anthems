<script>
	import { getContext, onMount } from "svelte";
	import _ from "lodash";
	import chaosScore from "$utils/chaosScore.js";
	// cluster for a word - o-2
	// cluster for a singer's whole performance - jazmine

	const { lineData } = getContext("exploration");

	const getWordData = (singer, word) => {
		const performance = $lineData.find((l) => l.singer === singer);

		const wordNotes = performance.noteData.filter((n) => n.word === word);
		const noteData = wordNotes.map((n) => ({
			...n,
			timestamp: n.timestamp - wordNotes[0].timestamp
		}));
		const filterPitches = (p) =>
			p.timestamp >= wordNotes[0].timestamp &&
			p.timestamp <=
				wordNotes[wordNotes.length - 1].timestamp +
					wordNotes[wordNotes.length - 1].duration;

		const pitchData = performance.pitchData.filter(filterPitches).map((p) => ({
			...p,
			timestamp: p.timestamp - wordNotes[0].timestamp
		}));
		return {
			word: word,
			noteData,
			pitchData: pitchData
		};
	};

	const uniqueWords = _.uniq($lineData[0].noteData.map((d) => d.word));

	const chunks = uniqueWords.map((word) => getWordData("jazmine", word));
	const shapes = chunks.map((d) =>
		d.pitchData.map((p) => ({ frequency: p.frequency }))
	);

	const distanceMatrix = shapes.map((shape, i) => {
		return shapes.map((otherShape, j) => {
			const dtwDistance = chaosScore(shape, otherShape);
			return dtwDistance;
		});
	});

	console.log({ distanceMatrix });
</script>

<div class="grid-container" style="--num-shapes: {shapes.length}">
	<div class="grid-item label" />
	{#each shapes as shape, i}
		<div class="grid-item label">{uniqueWords[i]}</div>
	{/each}
	{#each distanceMatrix as row, j}
		<div class="grid-item label">{uniqueWords[j]}</div>
		{#each row as distance}
			<div class="grid-item">{distance.toFixed(2)}</div>
		{/each}
	{/each}
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: auto repeat(var(--num-shapes), auto);
		grid-gap: 10px;
		font-size: 12px;
	}
	.grid-item {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid black;
	}
	.label {
		font-weight: bold;
	}
</style>
