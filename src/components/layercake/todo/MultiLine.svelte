<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
	import { getContext } from "svelte";

	const { data, xGet, yGet, zGet, xScale, zScale } = getContext("LayerCake");

	export let highlight;

	$: console.log({ highlight });

	const segmentPath = (values) => {
		let pathData = "";
		let moveToNext = true;

		for (const d of values) {
			if (d.frequency > 0) {
				if (moveToNext) {
					pathData += `M${$xGet(d)},${$yGet(d)} `;
					moveToNext = false;
				} else {
					pathData += `L${$xGet(d)},${$yGet(d)} `;
				}
			} else {
				moveToNext = true;
			}
		}
		return pathData;
	};
</script>

{#key $xScale.range()}
	<g class="line-group">
		{#each $data as group}
			<path
				id={group.id}
				class:fade={highlight && group.id !== highlight}
				d={segmentPath(group.pitch)}
				stroke={$zGet(group) || "black"}
			/>
		{/each}
	</g>
{/key}

<style>
	path {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
		transition: opacity 0.5s ease-in-out;
	}
	path.fade {
		opacity: 0.05;
	}
</style>
