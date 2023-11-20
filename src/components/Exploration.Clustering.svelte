<script>
	import Range from "$components/helpers/Range.svelte";
	import Line from "$components/Exploration.Line.svelte";
	import Audio from "$components/Exploration.Audio.svelte";
	import { getContext, onMount } from "svelte";
	import _ from "lodash";
	import chaosScore from "$utils/chaosScore.js";
	import clustering from "density-clustering";
	// cluster for a word - o-2
	// cluster for a singer's whole performance - jazmine

	const { lineData, singers } = getContext("exploration");

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
			timestamp: p.timestamp - wordNotes[0].timestamp,
			realTimestamp: p.timestamp
		}));
		return {
			word: word,
			noteData,
			pitchData: pitchData
		};
	};

	const uniqueWords = _.uniq($lineData[0].noteData.map((d) => d.word));
	const chunks = ["jazmine", "carrie"]
		.map((singer) => uniqueWords.map((word) => getWordData(singer, word)))
		.flat();
	const shapes = chunks.map((d) => ({ word: d.word, pitchData: d.pitchData }));

	const distanceMatrix = shapes.map(({ pitchData }, i) => {
		return shapes.map(({ pitchData: otherPitchData }, j) => {
			const dtwDistance = chaosScore(pitchData, otherPitchData);
			return dtwDistance;
		});
	});

	let k = 10;
	const kmeans = new clustering.KMEANS();
	let flattenedMatrix = distanceMatrix.map((row) => [...row]);
	$: clusters = kmeans.run(flattenedMatrix, k);
</script>

<h3>k</h3>
<Range min={1} max={15} step={1} showTicks={true} bind:value={k} />

{#each clusters as cluster, i}
	<h3>cluster {i}</h3>
	<div class="shapes">
		{#each cluster as shapeIndex}
			{@const pitches = shapes[shapeIndex].pitchData}
			{@const singer = pitches[0].singer}
			{@const word = shapes[shapeIndex].word}
			{@const color = singers.find((s) => s.singer === singer).color}
			{@const start = pitches[0].realTimestamp}
			{@const end = pitches[pitches.length - 1].realTimestamp}
			<div class="shape">
				<div class="word">{word}</div>

				<Audio {singer} {start} {end} />
				<Line data={pitches} stroke={color} />
			</div>
		{/each}
	</div>
{/each}

<style>
	.shapes {
		display: flex;
		flex-wrap: wrap;
		margin: 3rem 0;
	}
</style>
