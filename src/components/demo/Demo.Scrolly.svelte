<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	let value;
</script>

<section id="scrolly">
	<h2>Scrolly <span>{value}</span></h2>
	<div class="spacer" />
	<Scrolly bind:value>
		{#each [0, 1, 2, 3, 4] as text, i}
			{@const active = value === i}
			<div class="step" class:active>
				<p>{text}</p>
			</div>
		{/each}
	</Scrolly>
	<div class="spacer" />
</section>

<style>
	h2 {
		position: sticky;
		top: 4em;
	}

	.spacer {
		height: 75vh;
	}
</style>
