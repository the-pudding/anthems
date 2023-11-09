<script>
	import MultiLine from "$components/layercake/todo/MultiLine.svelte";
	import AxisX from "$components/layercake/AxisX.svg.svelte";
	import AxisY from "$components/layercake/AxisY.svg.svelte";
	import { LayerCake, Svg, flatten } from "layercake";
	import { getContext } from "svelte";

	const { lineData, timeDomain } = getContext("exploration");

	const xKey = "timestamp";
	const yKey = "frequency";
	const zKey = "color";

	$: flatData = $lineData.length ? flatten($lineData, "pitchData") : [];

	// TODO: bring this back just for big chart
	// $: timeFilter = (d) =>
	// 	$timeDomain[1] === 0 ||
	// 	(d.timestamp >= $timeDomain[0] && d.timestamp <= $timeDomain[1]);
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 7, right: 10, bottom: 20, left: 50 }}
		x={xKey}
		y={yKey}
		z={zKey}
		xDomain={$timeDomain[0] === 0 ? [0, null] : $timeDomain}
		yDomain={[0, null]}
		{flatData}
		data={$lineData}
	>
		<Svg>
			<AxisX gridlines={false} formatTick={(d) => `${d}s`} />
			<AxisY formatTick={(d) => `${d} Hz`} />
			<MultiLine />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 400px;
	}
</style>
