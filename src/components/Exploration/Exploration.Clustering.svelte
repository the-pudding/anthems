<script>
	import Range from "$components/helpers/Range.svelte";
	import Line from "$components/Exploration/Exploration.Line.svelte";
	import Audio from "$components/Exploration/Exploration.Audio.svelte";
	import { getContext } from "svelte";
	import _ from "lodash";

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
					wordNotes[wordNotes.length - 1].duration &&
			p.frequency >= 100;

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
	const chunks = ["jazmine"]
		.map((singer) => uniqueWords.map((word) => getWordData(singer, word)))
		.flat();
	const shapes = chunks.map((d) => ({ word: d.word, pitchData: d.pitchData }));
</script>

<div class="shapes">
	{#each uniqueWords as word, i}
		{@const pitches = shapes[i].pitchData}
		{@const singer = pitches[0].singer}
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

<style>
	.shapes {
		display: flex;
		flex-wrap: wrap;
		margin: 3rem 0;
	}
</style>
