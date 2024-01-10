<script>
	import Chart from "$components/SpotCheck/Chart.svelte";
	// import phrase0 from "$data/phrases/o-say-can-you-see.json";
	// import phrase1 from "$data/phrases/by-the-dawns-early-light.json";
	// import phrase2 from "$data/phrases/what-so-proudly-we-hailed.json";
	// import phrase3 from "$data/phrases/at-the-twilights-last-gleaming.json";
	// import phrase4 from "$data/phrases/whose-broad-stripes-and-bright-stars.json";
	// import phrase5 from "$data/phrases/through-the-perilous-fight.json";
	// import phrase6 from "$data/phrases/oer-the-ramparts-we-watched.json";
	// import phrase7 from "$data/phrases/were-so-gallantly-streaming.json";
	// import phrase8 from "$data/phrases/and-the-rockets-red-glare.json";
	// import phrase9 from "$data/phrases/the-bombs-bursting-in-air.json";
	// import phrase10 from "$data/phrases/gave-proof-through-the-night.json";
	// import phrase11 from "$data/phrases/that-our-flag-was-still-there.json";
	// import phrase12 from "$data/phrases/o-say-does-that-star-spangled.json";
	import phrase13 from "$data/phrases/banner-yet-wave.json";
	// import phrase14 from "$data/phrases/oer-the-land-of-the-free.json";
	// import phrase15 from "$data/phrases/and-the-home-of-the-brave.json";
	import alreadyFlagged from "$data/flagged.json";

	// *** update these to change the phrase
	const phrase = phrase13;
	const phraseI = 13;
	// ***

	const phrases = [
		"o-say-can-you-see",
		"by-the-dawns-early-light",
		"what-so-proudly-we-hailed",
		"at-the-twilights-last-gleaming",
		"whose-broad-stripes-and-bright-stars",
		"through-the-perilous-fight",
		"oer-the-ramparts-we-watched",
		"were-so-gallantly-streaming",
		"and-the-rockets-red-glare",
		"the-bombs-bursting-in-air",
		"gave-proof-through-the-night",
		"that-our-flag-was-still-there",
		"o-say-does-that-star-spangled",
		"banner-yet-wave",
		"oer-the-land-of-the-free",
		"and-the-home-of-the-brave"
	];
	const lyrics = phrases[phraseI];

	let flagged = alreadyFlagged;
	let page = 0;
	let perPage = 30;
	let totalPages = Math.ceil(phrase.length / perPage);
	let start = 0;
	let end = perPage;
	let reason = "";
	let showReason = false;
	let flaggedId;

	$: slice = phrase.slice(start, end);

	const next = () => {
		if (start + perPage >= phrase.length) return;
		start += perPage;
		end = Math.min(start + perPage, phrase.length);
		page += 1;
	};
	const prev = () => {
		if (start - perPage < 0) return;
		start -= perPage;
		end = Math.min(start + perPage, phrase.length);
		page -= 1;
	};
	const flag = (e) => {
		showReason = true;
		flaggedId = e.target.id.replace("-flag", "");
	};
	const onSubmit = (e) => {
		if (e.key !== "Enter") return;
		flagged = [...flagged, { id: flaggedId, phrase: lyrics, reason }];
		showReason = false;
		reason = "";
		flaggedId = undefined;
	};
	$: console.log({ flagged });
</script>

<div class="container">
	<div>phrase {phraseI + 1} / 16</div>
	<h2>{lyrics}</h2>

	<div class="page">
		<button on:click={prev}>prev</button>
		<div>page {page + 1} / {totalPages}</div>
		<button on:click={next}>next</button>
	</div>

	<div class="flag-reason" class:visible={showReason}>
		flagging {flaggedId}. reason?
		<input bind:value={reason} on:keydown={onSubmit} />
	</div>

	<Chart data={slice} {flag} {flagged} {lyrics} />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.page {
		display: flex;
		align-items: center;
	}
	button {
		margin: 0 10px;
		background: none;
		border: 1px solid darkgrey;
	}
	button:hover {
		background: lightgrey;
	}
	.flag-reason {
		font-size: 0.8rem;
		visibility: hidden;
		margin-bottom: 2rem;
	}
	.visible {
		visibility: visible;
	}
</style>
