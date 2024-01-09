<script>
	import Line from "$components/SpotCheck/Line.svelte";
	import phrase1 from "$data/phrases/o-say-can-you-see.json";
	// import phrase2 from "$data/phrases/by-the-dawns-early-light.json";
	// import phrase3 from "$data/phrases/what-so-proudly-we-hailed.json";
	// import phrase4 from "$data/phrases/at-the-twilights-last-gleaming.json";
	// import phrase5 from "$data/phrases/whose-broad-stripes-and-bright-stars.json";
	// import phrase6 from "$data/phrases/through-the-perilous-fight.json";
	// import phrase7 from "$data/phrases/oer-the-ramparts-we-watched.json";
	// import phrase8 from "$data/phrases/were-so-gallantly-streaming.json";
	// import phrase9 from "$data/phrases/and-the-rockets-red-glare.json";
	// import phrase10 from "$data/phrases/the-bombs-bursting-in-air.json";
	// import phrase11 from "$data/phrases/gave-proof-through-the-night.json";
	// import phrase12 from "$data/phrases/that-our-flag-was-still-there.json";
	// import phrase13 from "$data/phrases/o-say-does-that-star-spangled.json";
	// import phrase14 from "$data/phrases/banner-yet-wave.json";
	// import phrase15 from "$data/phrases/oer-the-land-of-the-free.json";
	// import phrase16 from "$data/phrases/and-the-home-of-the-brave.json";

	const start = 0;
	const end = 30;
	const currentPhrase = phrase1.slice(start, end);
</script>

<div class="container">
	<h2>o say can you see</h2>
	<p>showing {start} to {end - 1}</p>
	<Line data={currentPhrase} />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
