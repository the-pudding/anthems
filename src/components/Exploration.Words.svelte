<script>
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import _ from "lodash";
	import { extent, max } from "d3-array";
	import { getContext } from "svelte";

	const { lineData } = getContext("exploration");

	const xKey = "timestamp";
	const yKey = "frequency";
	const zKey = "color";

	const uniqueWords = _.uniq($lineData[0].noteData.map((d) => d.word));

	const getWordData = (word) => {
		return $lineData.map((d) => {
			const wordNotes = d.noteData.filter((n) => n.word === word);
			return {
				...d,
				noteData: wordNotes.map((n) => ({
					...n,
					timestamp: n.timestamp - wordNotes[0].timestamp
				})),
				pitchData: d.pitchData
					.filter(
						(p) =>
							p.timestamp >= wordNotes[0].timestamp &&
							p.timestamp <=
								wordNotes[wordNotes.length - 1].timestamp +
									wordNotes[wordNotes.length - 1].duration
					)
					.map((p) => ({
						...p,
						timestamp: p.timestamp - wordNotes[0].timestamp
					}))
			};
		});
	};
</script>

<div class="wrapper">
	{#each uniqueWords as word}
		{@const wordData = getWordData(word)}
		{@const flatData = wordData.length ? flatten(wordData, "pitchData") : []}
		<div class="chart-container">
			<h4>{word}</h4>
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
	{/each}
</div>

<style>
	.wrapper {
		display: flex;
		flex-wrap: wrap;
	}
	.chart-container {
		width: 200px;
		height: 200px;
		margin: 2rem;
	}
</style>
