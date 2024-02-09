<script>
	import { getContext } from "svelte";
	const { data, x, y, xGet, yGet, xScale, yScale } = getContext("LayerCake");

	export let fill = "#ccc";
	export let showNumber = false;
	export let highlight;

	$: max = $xScale.domain()[1];
</script>

<g>
	{#each $data as d, i}
		{@const rectX = $xScale.range()[0] < 0 ? 0 : $xScale.range()[0]}
		{@const rectY = $yGet(d) < 0 ? 0 : $yGet(d)}
		{@const width = $xGet(d) < 0 ? 0 : $xGet(d)}
		{@const height = $yScale.bandwidth()}
		{@const highlighted =
			(highlight && highlight.includes(+$y(d))) || $x(d) === max}
		<rect
			data-id={i}
			x={rectX}
			y={rectY}
			{width}
			{height}
			fill={highlighted ? "red" : fill}
		/>

		{#if showNumber}
			<text x={rectX + width + 5} y={rectY + height / 2} fill="var(--color-fg)">
				{$x(d).toFixed(0)}
			</text>
		{/if}
	{/each}
</g>

<style>
	text {
		font-family: var(--sans);
		font-weight: bold;
		font-size: 0.8rem;
		alignment-baseline: middle;
	}
</style>
