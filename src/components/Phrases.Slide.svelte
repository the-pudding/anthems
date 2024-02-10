<script>
	import Featured from "$components/Phrases.Featured.svelte";
	import Lines from "$components/Lines.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import { currentStepI, currentPhraseI } from "$stores/misc.js";
	import ids from "$data/ids.csv";

	export let phrase;
	export let slideI;

	let loaded = false;
	let phrasePitch;
	let data;
	let highlight;

	const allIds = ids.map((d) => d.id);
	const preLoad = 2; // start loading data n phrases before

	const castFloat = (arr) => {
		return arr.map((obj) =>
			Object.fromEntries(
				Object.entries(obj).map(([key, value]) => [
					key,
					value === "" ? 0 : parseFloat(value)
				])
			)
		);
	};
	const prepareLineData = () => {
		return allIds
			.filter((d) => d !== "standard")
			.map((id) => {
				const pitch = phrasePitch.map((d) => ({
					timestamp: d.timestamp,
					frequency: d[id]
				}));
				return {
					id: id,
					pitch: pitch
				};
			});
	};
	const onNewStep = () => {
		highlight = undefined;
	};
	const load = async () => {
		const module = await import(`$data/pitch/desktop/phrase${phraseI}.csv`);
		loaded = true;
		phrasePitch = castFloat(module.default);
		data = prepareLineData();
	};

	$: if (!loaded && $currentPhraseI >= phraseI - preLoad) load();
	$: if ($currentPhraseI === phraseI) onNewStep($currentStepI);
	$: phraseI = phrase.phraseI;
</script>

<Slide index={slideI}>
	<div class="slide">
		<Featured {phraseI} featured={phrase.featured} bind:highlight />
		<div class="main">
			<div class="text">
				{#each phrase.steps as { text }, i}
					<p class:visible={i === $currentStepI}>{@html text}</p>
				{/each}
			</div>

			<div class="line-wrapper">
				{#if data}
					<Lines
						{phraseI}
						{data}
						{highlight}
						featuredIds={phrase.featured.map((d) => d.id)}
						showStandard={phraseI !== 0 || $currentStepI >= 1}
					/>
				{:else}
					<p>loading...</p>
				{/if}
			</div>
			<h2>
				{#each phrase.lyrics.split(" ") as word}
					<span>{word}</span>
				{/each}
			</h2>
		</div>
	</div>
</Slide>

<style>
	.slide {
		background: var(--color-extra-dark-blue);
		border: 3px solid var(--color-grey-blue);
		height: 100%;
		padding: 1rem 2rem;
		display: flex;
		position: relative;
	}
	.line-wrapper {
		display: flex;
		flex: 1;
		height: 100%;
	}
	.main {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
	h2 {
		font-family: Newsagent;
		font-size: 4rem;
		display: flex;
		justify-content: space-evenly;
		margin-bottom: 0;
	}
	.text {
		margin-bottom: 3rem;
		margin-left: 3rem;
		max-width: 600px;
		pointer-events: auto;
	}
	.text p {
		display: none;
		line-height: 2;
	}
	.text p.visible {
		display: block;
	}

	@media (max-width: 1200px) {
		h2 {
			font-size: 2.75rem;
		}
	}

	@media (max-width: 1000px) {
		.slide {
			flex-direction: column;
		}
		h2 {
			font-size: 2.25rem;
		}
	}

	@media (max-width: 800px) {
		h2 {
			font-size: 2rem;
		}
	}

	@media (max-width: 600px) {
		.slide {
			padding: 0.5rem 1rem;
		}
		h2 {
			font-size: 1.75rem;
			margin: 0;
		}
		.text {
			font-size: var(--14px);
			margin-left: 0;
			margin-bottom: 0;
		}
		.text p {
			line-height: 1.7;
		}
	}

	@media (max-width: 400px) {
		h2 {
			font-size: 1.6rem;
		}
	}
</style>
