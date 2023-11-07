<!--
	@component
	Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
	import { getContext } from "svelte";

	const { data, xGet, yGet, zGet, y, z } = getContext("LayerCake");

	$: path = (values) => {
		return (
			"M" +
			values
				.map((d) => {
					return $xGet(d) + "," + $yGet(d);
				})
				.join("L")
		);
	};

	const segmentData = (data) => {
		const segments = [];
		let currentSegment = [];
		for (const d of data) {
			const value = $y(d);
			if (value !== 0) {
				currentSegment.push(d);
			} else {
				if (currentSegment.length > 0) {
					segments.push(currentSegment);
					currentSegment = [];
				}
			}
		}
		if (currentSegment.length > 0) {
			segments.push(currentSegment);
		}
		return segments;
	};
</script>

<g class="multiline">
	{#each $data as group}
		{@const segments = segmentData(group.values)}
		<g id={$z(group)}>
			{#each segments as segment}
				<path class="path-line" d={path(segment)} stroke={$zGet(segment[0])} />
			{/each}
		</g>
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
		opacity: 0.75;
	}
</style>
