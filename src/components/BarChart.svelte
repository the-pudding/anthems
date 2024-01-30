<script>
	let divaVals = [];
	export let data;
	export let title;
	export let key;

	const values = data.map((d, i) => {
		let val = +d.avg_diva;
		divaVals.push(val);
	});
	const maxDiva = Math.max(...divaVals);
</script>

<div class="bar-chart-inline">
	<div class="title">Average Diva Score By {title}</div>
	<div class="chart-wrapper">
		<div class="baseline" style={`height: ${data.length * 4}rem`}></div>
		{#each data as row, i}
			<div class={`row row-${i}`}>
				<p class="category">{row[key] === "rnb" ? "R&B" : row[key]}</p>
				<div class="full-bar">
					<div
						class="bar"
						style={`width: calc(${(row.avg_diva / maxDiva) * 100}%)`}
					>
						<p class="score">{row.avg_diva}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.bar-chart-inline {
		width: 100%;
		height: 100%;
		padding: 3rem 1rem 5rem 1rem;
		display: flex;
		flex-direction: column;
	}
	.title {
		font-family: var(--sans);
		color: var(--color-grey-blue);
		font-weight: 700;
		text-transform: uppercase;
		margin: 0 auto 1rem auto;
		font-size: var(--14px);
		width: calc(100% - 2rem);
		max-width: 50rem;
		padding: 0 0 0 6.5rem;
	}
	.chart-wrapper {
		position: relative;
		width: calc(100% - 2rem);
		max-width: 50rem;
		margin: 0 auto;
	}
	.baseline {
		position: absolute;
		top: 0rem;
		left: 6.5rem;
		border-left: 2px dashed var(--color-fg);
		z-index: 999;
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
	.row {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.category {
		color: var(--color-fg);
		font-family: Newsagent;
		text-transform: capitalize;
		font-size: var(--28px);
		text-align: right;
		width: 6rem;
		margin: 0 0.5rem 0 0;
	}
	.full-bar {
		width: calc(100% - 10.5rem);
		display: flex;
		flex-direction: row;
	}
	.bar {
		background: var(--color-grey-blue);
		height: 1.5rem;
		margin: 1rem 0;
		position: relative;
	}
	.row-0 .bar {
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
