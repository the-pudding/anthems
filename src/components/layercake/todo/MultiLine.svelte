<!--
	@component
	Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
	import { getContext } from "svelte";
	import _ from "lodash";

	const { data, xGet, yGet, xScale, yScale, y, z } = getContext("LayerCake");
	const { normalizeWords } = getContext("exploration");

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
		{@const segments = segmentData(group.pitchData)}
		<g id={group.singer}>
			<g class="pitch">
				{#each segments as segment}
					<path class="path-line" d={path(segment)} stroke={$z(group)} />
				{/each}
			</g>

			{#if group.noteData}
				<g class="notes">
					{#each group.noteData as { timestamp, frequency, duration, word }, i}
						{@const prev = i - 1 < 0 ? null : group.noteData[i - 1]}
						{@const markWord =
							$normalizeWords &&
							group.singer === "michelle" &&
							(prev === null || prev.word.split("-")[0] !== word.split("-")[0])}
						<rect
							x={$xScale(timestamp)}
							y={$yScale(frequency) - 5}
							width={$xScale(duration)}
							height={10}
							fill={$z(group)}
							opacity="0.5"
						/>

						{#if markWord}
							<line
								x1={$xScale(timestamp)}
								y1={$yScale.range()[0]}
								x2={$xScale(timestamp)}
								y2={$yScale.range()[1]}
								stroke="var(--color-gray-700)"
							/>
							<text x={$xScale(timestamp)}>{word.split("-")[0]}</text>
						{/if}
					{/each}
				</g>
			{/if}
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

	text {
		font-size: 8px;
	}
</style>
