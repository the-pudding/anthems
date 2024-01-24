<script>
	export let topDivas;
	export let ourPicks;
</script>

<div class="wrapper">
	{#if topDivas}
		<h3>Top Divas</h3>
		{#each topDivas.split(",") as id}
			<img src={`assets/cutouts/${id.split("_")[0].trim()}.png`} />
		{/each}
	{/if}

	{#if ourPicks}
		<h3>Our Picks</h3>
		{#each ourPicks as { id, note }}
			<div class="pick">
				<img src={`assets/cutouts/${id.split("_")[0].trim()}.png`} />
				<!-- <div class="note">{note}</div> -->
			</div>
		{/each}
	{/if}
</div>

<style>
	.wrapper {
		margin-right: 1rem;
		max-width: 90px;
	}
	h3 {
		font-size: 1rem;
		font-family: var(--sans);
		color: #7ca4ae;
		font-weight: bold;
		text-transform: uppercase;
	}
	.pick {
		position: relative;
	}
	.note {
		position: absolute;
		font-family: var(--sans);
		top: 50%;
		left: 100%;
		transform: translate(0, -50%);
		width: 100%;
	}
</style>
