<script>
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import _ from "lodash";
	import { extent, max } from "d3-array";
	import { getContext } from "svelte";
	import chaosScore from "$utils/chaosScore.js";

	const { lineData } = getContext("exploration");

	const xKey = "timestamp";
	const yKey = "frequency";
	const zKey = "color";

	const uniqueWords = _.uniq($lineData[0].noteData.map((d) => d.word));

	const getWordData = (word) => {
		return $lineData.map((d) => {
			const wordNotes = d.noteData.filter((n) => n.word === word);
			const noteData = wordNotes.map((n) => ({
				...n,
				timestamp: n.timestamp - wordNotes[0].timestamp
			}));
			const filterPitches = (p) =>
				p.timestamp >= wordNotes[0].timestamp &&
				p.timestamp <=
					wordNotes[wordNotes.length - 1].timestamp +
						wordNotes[wordNotes.length - 1].duration;

			const pitchData = d.pitchData.filter(filterPitches).map((p) => ({
				...p,
				timestamp: p.timestamp - wordNotes[0].timestamp
			}));
			return {
				...d,
				noteData,
				pitchData: pitchData
			};
		});
	};

	let chaosBySinger = [];

	const chaosByWord = (word, pitchData) => {
		const standardNotes = $lineData
			.find((l) => l.singer === "standard")
			.noteData.filter((n) => n.word === word);
		const standardPitch = $lineData
			.find((l) => l.singer === "standard")
			.pitchData.filter(
				(p) =>
					p.timestamp >= standardNotes[0].timestamp &&
					p.timestamp <=
						standardNotes[standardNotes.length - 1].timestamp +
							standardNotes[standardNotes.length - 1].duration
			)
			.map((p) => ({
				...p,
				timestamp: p.timestamp - standardNotes[0].timestamp
			}));

		const scores = pitchData.map((d) => {
			const score = chaosScore(d.pitchData, standardPitch);

			const existingSinger = chaosBySinger.find((s) => s.singer === d.singer);
			if (existingSinger) {
				existingSinger.score += score;
			} else {
				chaosBySinger = [
					...chaosBySinger,
					{
						singer: d.singer,
						score: score,
						color: d.color
					}
				];
			}
			return {
				singer: d.singer,
				score: score,
				color: d.color
			};
		});
		const sortedScores = _.orderBy(scores, (s) => s.score, "desc");
		return sortedScores;
	};
</script>

<div class="singer-scores">
	{#each _.orderBy(chaosBySinger, (d) => d.score, "desc") as { singer, score, color }, i}
		<div style={`--color: ${color}`}>
			{singer}: {score.toFixed(1)}
		</div>
	{/each}
</div>

<div class="wrapper">
	{#each uniqueWords as word}
		{@const wordData = getWordData(word)}
		{@const flatData = wordData.length ? flatten(wordData, "pitchData") : []}
		{@const chaosScores = chaosByWord(word, wordData)}
		{@const total = _.sumBy(chaosScores, (d) => d.score)}
		<div class="word-wrapper">
			<h4>{word}</h4>
			<div class="chart-container">
				<LayerCake
					padding={{ top: 7, right: 10, bottom: 20, left: 50 }}
					x={xKey}
					y={yKey}
					z={zKey}
					xDomain={extent(flatData, (d) => d.timestamp)}
					yDomain={[0, max(flatData, (d) => d.frequency)]}
					flaData={flatData}
					data={wordData}
				>
					<Svg>
						<AxisX gridlines={false} formatTick={(d) => `${d}s`} ticks={2} />
						<AxisY formatTick={(d) => `${d} Hz`} />
						<MultiLine />
					</Svg>
				</LayerCake>
			</div>
			<div class="scores">
				<details>
					<summary style="font-weight: bold">
						total: {total.toFixed(1)}
					</summary>
					{#each chaosScores as { singer, score, color }, i}
						<div style={`--color: ${color}`}>
							{singer}: {score.toFixed(1)}
						</div>
					{/each}
				</details>
			</div>
		</div>
	{/each}
</div>

<style>
	.wrapper {
		display: flex;
		flex-wrap: wrap;
	}
	.word-wrapper {
		display: flex;
		flex-direction: column;
		margin: 1rem;
	}
	.chart-container {
		width: 200px;
		height: 200px;
	}
	.scores div,
	.singer-scores div {
		width: fit-content;
		border-bottom: 3px solid var(--color);
	}
	.singer-scores {
		margin: 1rem;
	}
</style>
