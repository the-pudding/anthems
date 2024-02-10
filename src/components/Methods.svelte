<script>
	import copy from "$data/copy.json";
</script>

<section id="methods">
	<h2>Methods</h2>
	{#each copy.methods as { value }}
		<p>{@html value}</p>
	{/each}
</section>

<style>
	section {
		max-width: 700px;
		margin: auto;
		margin-top: 8rem;
		padding: 0 1rem;
	}
	h2 {
		font-family: Newsagent;
		font-size: 4rem;
	}
	p {
		font-family: var(--sans);
	}

	@media (max-width: 600px) {
		h2 {
			font-size: 2.5rem;
		}
		section {
			padding: 0 1rem;
		}
		p {
			font-size: var(--14px);
		}
	}
</style>
