<script>
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import Toggle from "$components/helpers/Toggle.svelte";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import { scaleOrdinal, scaleLinear } from "d3-scale";
	import _ from "lodash";
	import jazmine from "$data/pitch/jazmine.csv";
	import harry from "$data/pitch/harry.csv";
	import carrie from "$data/pitch/carrie.csv";
	import demi from "$data/pitch/demi.csv";
	import legend from "$data/pitch/legend.csv";
	import fergie from "$data/pitch/fergie.csv";
	import michelle from "$data/pitch/michelle.csv";

	const xKey = "timestamp";
	const yKey = "frequency";
	const zKey = "color";
	const normalizeKey = "C";
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
	const data = [
		{
			singer: "carrie",
			data: carrie,
			key: "G"
		},
		{
			singer: "demi",
			data: demi,
			key: "G#"
		},
		{
			singer: "fergie",
			data: fergie,
			key: "G"
		},
		{
			singer: "harry",
			data: harry,
			key: "G#"
		},
		{
			singer: "jazmine",
			data: jazmine,
			key: "F"
		},
		{
			singer: "legend",
			data: legend,
			key: "A#"
		},
		{
			singer: "michelle",
			data: michelle,
			key: "D"
		}
	].map((d, i) => ({
		...d,
		i: i,
		color: seriesColors[i],
		start: +d.data[0].timestamp,
		end: +d.data[d.data.length - 1].timestamp
	}));

	const normalize = (timestamp, start, end) => {
		const shortest = _.minBy(data, (d) => d.end - d.start);
		const shortestDuration = shortest.end - shortest.start;
		const scale = scaleLinear()
			.domain([start, end])
			.range([0, shortestDuration]);

		return scale(timestamp);
	};
	const transpose = (originalHz, originalKey, transposeKey, singer) => {
		const stepsToTranspose = halfStepsBetween(originalKey, transposeKey);
		let newFrequency = originalHz * 2 ** (stepsToTranspose / 12);

		const octaveShift = singer === "harry" ? 1 : 0;
		newFrequency *= 2 ** octaveShift;

		return newFrequency;
	};
	const halfStepsBetween = (originalKey, transposeKey) => {
		const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"];
		const originalKeyIndex = keys.indexOf(originalKey);
		const transposeKeyIndex = keys.indexOf(transposeKey);
		return transposeKeyIndex - originalKeyIndex;
	};

	let toggles = [];
	let timeDomain = [0, 0];
	$: timeFilter = (d) =>
		timeDomain[1] === 0 ||
		(d.timestamp >= timeDomain[0] && d.timestamp <= timeDomain[1]);
	$: groupedData = data
		.map((l) => ({
			i: l.i,
			color: seriesColors[l.i],
			singer: l.singer,
			values: l.data
				.map((d) => ({
					...d,
					singer: l.singer,
					frequency: transpose(+d.frequency, l.key, normalizeKey, l.singer),
					timestamp: normalize(+d.timestamp, l.start, l.end)
				}))
				.filter(timeFilter)
		}))
		.filter((d, i) => toggles[d.i] === "on");
	$: flatData = groupedData.length ? flatten(groupedData, "values") : [];
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 7, right: 10, bottom: 20, left: 50 }}
		x={xKey}
		y={yKey}
		z={zKey}
		yDomain={[0, null]}
		{flatData}
		data={groupedData}
	>
		<Svg>
			<AxisX gridlines={false} formatTick={(d) => `${d}s`} />
			<AxisY formatTick={(d) => `${d} Hz`} />
			<MultiLine />
		</Svg>
	</LayerCake>
</div>

<div class="controls">
	<div class="names">
		<h3>singers</h3>
		{#each data as { singer, i, color }}
			{@const faded = toggles[i] !== "on"}
			<div style="display: flex; align-items: center">
				{#if singer !== "michelle"}<audio
						src={`assets/sound/${singer}.mp3`}
						controls={true}
						class:faded
					/>{/if}

				<div class="name" style={`--color: ${color}`} class:faded>
					{singer}
				</div>
				<Toggle label="" style="inner" bind:value={toggles[i]} />
			</div>
		{/each}
	</div>

	<div class="time">
		<h3>timespan</h3>
		<input
			placeholder="start"
			on:input={(e) => (timeDomain[0] = Number(e.target.value))}
		/>
		<input
			placeholder="end"
			on:input={(e) => (timeDomain[1] = Number(e.target.value))}
		/>
	</div>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 400px;
	}
	.name {
		width: fit-content;
		margin: 1rem;
		border-bottom: 6px solid var(--color);
	}
	.faded {
		opacity: 0.2;
	}
	.controls {
		display: flex;
		align-items: start;
		justify-content: space-evenly;
		margin: 2rem;
	}
</style>
