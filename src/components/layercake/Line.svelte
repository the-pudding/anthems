<script>
	import { getContext } from "svelte";
	import { line, curveLinear } from "d3";

	const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");

	export let stroke = "#ccc";
	export let curve = curveLinear;
	export let dataOverride;

	const segmentData = () => {
		let segments = [];
		let currentSegment = [];

		$data.forEach((d) => {
			if (d.frequency > 0) {
				currentSegment.push(d);
			} else if (currentSegment.length) {
				segments.push(currentSegment);
				currentSegment = [];
			}
		});

		if (currentSegment.length) {
			segments.push(currentSegment);
		}
		return segments;
	};

	$: segments = segmentData($data);
	$: lineGenerator = line()
		.x((d) => $xScale(d.timestamp))
		.y((d) => $yScale(d.frequency))
		.defined((d) => d.frequency > 0);
</script>

{#each segments as segment}
	<path d={lineGenerator(segment)} fill="none" stroke="var(--color-fg)" />
{/each}

<style>
	path {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>
