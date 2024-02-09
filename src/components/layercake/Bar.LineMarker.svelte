<script>
	import { getContext } from "svelte";

	export let value;
	export let label;

	const { xScale, yScale } = getContext("LayerCake");

	const overhang = 10;

	$: x = $xScale(value);
</script>

<line x1={x} x2={x} y1={-overhang} y2={$yScale.range()[1] + overhang} />
<text {x} y={$yScale.range()[1] + overhang}>{label}</text>

<text x={$xScale.range()[0]} y={-40}>◀ Less Diva</text>
<text x={$xScale.range()[1]} y={-40}>More Diva ▶</text>

<style>
	line {
		stroke: var(--color-fg);
		stroke-width: 2px;
		stroke-dasharray: 6px;
	}
	text {
		font-family: var(--sans);
		font-size: 0.8rem;
		fill: var(--color-fg);
		alignment-baseline: before-edge;
		text-anchor: middle;
	}
</style>
