<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
	import { getContext } from "svelte";
	import { line, curveCardinal } from "d3-shape";

	const { data, xGet, yGet, xScale } = getContext("LayerCake");

	export let highlight;

	const segmentPath = (values) => {
		const lineGenerator = line()
			.defined((d) => d.frequency > 0)
			.x((d) => $xGet(d))
			.y((d) => $yGet(d))
			.curve(curveCardinal);

		return lineGenerator(values);
	};
</script>

{#key $xScale.range()}
	<g class="line-group">
		{#each $data as group}
			<path
				id={group.id}
				class:fade={highlight && group.id !== highlight}
				class:highlight={highlight && group.id === highlight}
				d={segmentPath(group.pitch)}
			/>
		{/each}
	</g>
{/key}

<style>
	path {
		fill: none;
		stroke: var(--color-fg);
		opacity: 0.1;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
		transition: opacity 0.5s ease-in-out;
	}
	path.highlight {
		opacity: 1;
	}
	path.fade {
		opacity: 0.025;
	}
</style>
