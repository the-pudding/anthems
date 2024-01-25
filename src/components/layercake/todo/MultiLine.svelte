<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
	import { getContext } from "svelte";
	import { line, curveCardinal } from "d3-shape";
	import { draw } from "svelte/transition";

	const { data, xGet, yGet, xScale } = getContext("LayerCake");

	export let highlight;

	const segmentPath = (values) => {
		const lineGenerator = line()
			.defined((d) => d.frequency > 0)
			.x((d) => $xGet(d))
			.y((d) => $yGet(d))
			.curve(curveCardinal);

		console.log(lineGenerator(values));

		return lineGenerator(values);
	};
</script>

{#key $xScale.range()}
	<g class="line-group">
		{#each $data as group}
			{@const fade = highlight && group.id !== highlight}
			{@const highlighted = highlight && group.id === highlight}
			<path
				id={group.id}
				class:fade
				class:highlighted={highlight}
				d={segmentPath(group.pitch)}
			/>

			{#if highlighted}
				<path class="animated" d={segmentPath(group.pitch)} />
			{/if}
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
	path.highlighted {
		opacity: 1;
	}
	path.fade {
		opacity: 0.025;
	}
	path.animated {
		opacity: 1;
		stroke: red;
		stroke-width: 6px;
	}
</style>
