<script>
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import { scaleOrdinal } from "d3-scale";
	import jazmine from "$data/pitch/jazmine.csv";
	import harry from "$data/pitch/harry.csv";
	import carrie from "$data/pitch/carrie.csv";
	import demi from "$data/pitch/demi.csv";
	import legend from "$data/pitch/legend.csv";
	import fergie from "$data/pitch/fergie.csv";
	import michelle from "$data/pitch/michelle.csv";

	const xKey = "timestamp";
	const yKey = "frequency";
	const zKey = "singer";
	const normalizeKey = "C";

	const data = [
		// {
		// 	singer: "carrie",
		// 	data: carrie.map(castValues).filter(filterValues)
		// },
		// {
		// 	singer: "demi",
		// 	data: demi.map(castValues).filter(filterValues)
		// },
		// {
		// 	singer: "fergie",
		// 	data: fergie.map(castValues).filter(filterValues)
		// },
		{
			singer: "harry",
			data: harry,
			key: "G#"
		},
		// {
		// 	singer: "jazmine",
		// 	data: jazmine.map(castValues).filter(filterValues)
		// },
		// {
		// 	singer: "legend",
		// 	data: legend.map(castValues).filter(filterValues)
		// },
		{
			singer: "michelle",
			data: michelle,
			key: "D"
		}
	];

	const transpose = (originalHz, originalKey, transposeKey) => {
		const stepsToTranspose = halfStepsBetween(originalKey, transposeKey);
		let newFrequency = originalHz * 2 ** (stepsToTranspose / 12);

		const octaveShift = originalKey === "D" ? 0 : 1;
		newFrequency *= 2 ** octaveShift;

		return newFrequency;
	};
	const halfStepsBetween = (originalKey, transposeKey) => {
		const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"];
		const originalKeyIndex = keys.indexOf(originalKey);
		const transposeKeyIndex = keys.indexOf(transposeKey);
		return transposeKeyIndex - originalKeyIndex;
	};

	const timeFilter = (d) => true;
	// const timeFilter = (d) => d.timestamp < 15;
	const groupedData = data.map((l) => ({
		singer: l.singer,
		values: l.data
			.map((d) => ({
				...d,
				singer: l.singer,
				frequency: +d.frequency,
				timestamp: +d.timestamp
			}))
			.map((d) => ({
				...d,
				frequency: transpose(d.frequency, l.key, normalizeKey)
			}))
			.filter(timeFilter)
	}));

	const seriesNames = data.map((d) => d.singer);
	const seriesColors = [
		"#FF6B6B",
		"#4ECDC4",
		"#FFD166",
		"#A463F2",
		"#83E377",
		"#FF8C94",
		"#5DA0D1",
		"#FFAA5C",
		"#D3A4E6",
		"#6BEDB5"
	];
	const zScale = scaleOrdinal().domain(seriesNames).range(seriesColors);
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 7, right: 10, bottom: 20, left: 50 }}
		x={xKey}
		y={yKey}
		z={zKey}
		yDomain={[0, null]}
		zScale={scaleOrdinal()}
		zRange={seriesColors}
		flatData={flatten(groupedData, "values")}
		data={groupedData}
	>
		<Svg>
			<AxisX gridlines={false} formatTick={(d) => `${d}s`} />
			<AxisY formatTick={(d) => `${d} Hz`} />
			<MultiLine />
		</Svg>
	</LayerCake>
</div>

<div class="names">
	{#each data as { singer }}
		<div class="name" style={`--color: ${zScale(singer)}`}>{singer}</div>
	{/each}
</div>

<style>
	.chart-container {
		width: 100%;
		height: 400px;
	}
	.names {
		padding: 2rem;
	}
	.name {
		width: fit-content;
		margin: 1rem 0;
		border-bottom: 6px solid var(--color);
	}
</style>
