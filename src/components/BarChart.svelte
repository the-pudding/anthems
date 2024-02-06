<script>
	import ids from "$data/ids.csv";
	import _ from "lodash";
	import { scaleLinear } from "d3-scale";
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";

	export let data;
	export let title;
	export let xKey = "avg_diva";
	export let yKey;
	export let yFormat = (d) => d;
	export let showAvg = true;
	export let active;
	export let animate;

	let displayData = data;
	let barEls = [];

	const avg = _.meanBy(
		ids.filter((d) => d.id !== "standard"),
		(d) => +d["overall_diva"]
	);
	const max = +_.maxBy(data, (d) => +d[xKey])[xKey];
	const labelWidth = "7.25rem";

	$: xScale = scaleLinear().domain([0, max]).range([0, maxBarEl?.clientWidth]);
	$: maxBarEl = barEls.find(
		(d) => d && Array.from(d.classList).includes("max")
	);
	$: if (animate && active)
		displayData = _.orderBy(data, (d) => +d[xKey], "desc");
	$: if (animate && !active) displayData = data;
</script>

<div class="bar-chart-inline">
	<div class="title">Average Diva Score By {title}</div>
	<div class="legend">
		<p>◀ Less Diva</p>
		<p>More Diva ▶</p>
	</div>
	<div class="chart-wrapper">
		<div class="baseline" style={`left: ${labelWidth}`}></div>
		{#if showAvg}
			<div
				class="avgline"
				style={`left: calc(${labelWidth} + ${xScale(avg)}px)`}
			></div>
		{/if}

		{#each displayData as row, i (row[yKey])}
			<div
				class="row"
				animate:flip={{
					delay: active ? 1000 + Math.random() * 750 : 0,
					duration: active ? 1000 : 0,
					easing: cubicOut
				}}
			>
				<p class="category" class:small={data.length > 5}>
					{yFormat(row[yKey])}
				</p>
				<div class="full-bar" class:max={i === 0} bind:this={barEls[i]}>
					<div class="bar" style={`width: ${xScale(row[xKey])}px`} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.bar-chart-inline {
		flex: 1;
		width: 100%;
		padding: 3rem 1rem 4rem 1rem;
		display: flex;
		flex-direction: column;
	}
	.title {
		font-family: var(--sans);
		color: var(--color-grey-blue);
		font-weight: 700;
		text-transform: uppercase;
		margin: 0 auto 2.5rem auto;
		font-size: var(--18px);
		width: calc(100% - 2rem);
		max-width: 50rem;
		padding: 0 0 0 6.5rem;
	}
	.legend {
		width: calc(100% - 2rem);
		max-width: 50rem;
		margin: 0 auto 1rem auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-family: var(--sans);
		font-size: var(--14px);
		color: var(--color-fg);
		padding: 0 0 0 4rem;
	}
	.legend p:first-of-type {
		margin: 0 0 0 2.5rem;
	}
	.legend p:last-of-type {
		margin: 0;
	}
	.chart-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		position: relative;
		width: calc(100% - 2rem);
		max-width: 50rem;
		margin: 0 auto;
		flex: 1;
	}
	.baseline {
		position: absolute;
		top: 0rem;
		border-left: 2px dashed var(--color-fg);
		z-index: 999;
		height: 100%;
	}
	.baseline::after {
		content: "Standard";
		color: var(--color-fg);
		position: absolute;
		bottom: -1.5rem;
		left: -1.85rem;
		font-family: var(--sans);
		font-size: var(--14px);
	}
	.avgline {
		position: absolute;
		top: 0rem;
		border-left: 2px dashed var(--color-fg);
		z-index: 999;
		height: 100%;
	}
	.avgline::after {
		content: "Average of all performances";
		width: 8rem;
		color: var(--color-fg);
		text-align: center;
		position: absolute;
		bottom: -2.5rem;
		left: -4.25rem;
		font-family: var(--sans);
		font-size: var(--14px);
	}
	.row {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 4px 0;
	}
	.category {
		color: var(--color-fg);
		font-family: Newsagent;
		text-transform: capitalize;
		font-size: var(--28px);
		text-align: right;
		width: 7rem;
		margin: 0 0.5rem 0 0;
		line-height: 1;
	}
	.category.small {
		font-size: var(--18px);
	}
	.full-bar {
		height: 100%;
		width: calc(100% - 6.5rem);
		display: flex;
		flex-direction: row;
	}
	.bar {
		background: var(--color-grey-blue);
		position: relative;
	}
	.max .bar {
		background: var(--color-red);
	}
	.score {
		font-family: var(--sans);
		margin: 0.75rem 0 0.75rem 0.35rem;
		padding: 0.25rem 0 0 0;
		font-weight: 700;
		position: absolute;
		top: -1rem;
		right: -3.75rem;
	}
</style>
