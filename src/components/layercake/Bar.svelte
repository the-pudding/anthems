<script>
	import { getContext } from "svelte";
	const { data, x, y, xGet, yGet, xScale, yScale } = getContext("LayerCake");

	export let fill = "#ccc";
	export let showNumber = false;
	export let highlight;
	export let animate = false;
	export let active;

	$: max = $xScale.domain()[1];
</script>

<g>
	{#each $data as d, i ($y(d))}
		{@const rectX = $xScale.range()[0] < 0 ? 0 : $xScale.range()[0]}
		{@const rectY = $yGet(d) < 0 ? 0 : $yGet(d)}
		{@const width = $xGet(d) < 0 ? 0 : $xGet(d)}
		{@const height = $yScale.bandwidth()}
		{@const highlighted =
			(highlight && highlight.includes(+$y(d))) || $x(d) === max}
		<rect
			class:animate={active && animate}
			data-id={$y(d)}
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
	rect {
		transition: none;
	}
	rect.animate {
		transition: y var(--1s) var(--1s);
	}
</style>
