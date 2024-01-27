<script>
	import Featured from "$components/Phrases.Featured.svelte";
	import Lines from "$components/Lines.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import { currentStepI, currentPhraseI } from "$stores/misc.js";
	import viewport from "$stores/viewport.js";
	import ids from "$data/ids.csv";

	export let phrase;
	export let highlight;
	export let playAudio;

	const preLoad = 2; // start loading data n phrases before

	let phrasePitch;
	let data;
	let loaded = false;

	const allIds = ids.map((d) => d.id);

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
		return allIds.map((id) => {
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

	const load = async () => {
		console.log(`loading data for phrase ${phrase.i}...`);
		const isMobile = $viewport.width <= 600;
		const module = await import(
			`$data/pitch/${isMobile ? "mobile" : "desktop"}/phrase${phrase.i}.csv`
		);
		loaded = true;
		console.log("done");
		phrasePitch = castFloat(module.default);
		data = prepareLineData();
	};

	$: if (!loaded && $currentPhraseI >= phrase.i - preLoad) load();
</script>

<Slide index={phrase.i}>
	<div class="slide" class:active={phrase.i === $currentPhraseI}>
		<Featured
			phraseI={phrase.i}
			featured={phrase.featured}
			bind:highlight
			{playAudio}
		/>
		<div class="main">
			<div class="text">
				{#each phrase.steps as { text }, i}
					<p class:visible={i === $currentStepI}>{@html text}</p>
				{/each}
			</div>

			<div class="line-wrapper">
				{#if data}
					<Lines
						phraseI={phrase.i}
						{data}
						{highlight}
						featuredIds={phrase.featured.map((d) => d.id)}
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
		background: #02273d;
		border: 3px solid #7ca4ae;
		height: 100%;
		padding: 1rem 2rem;
		display: flex;
		opacity: 0.5;
	}
	.slide.active {
		opacity: 1;
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
		font-size: 5rem;
		display: flex;
		justify-content: space-evenly;
		margin-bottom: 0;
	}
	.text {
		margin-bottom: 3rem;
		margin-left: 3rem;
		height: 120px;
		max-width: 600px;
		pointer-events: auto;
	}
	.text p {
		display: none;
		line-height: 1.75;
	}
	.text p.visible {
		display: block;
	}
	:global(span.playable) {
		background: var(--color-fg);
		color: #032e47;
		font-family: var(--sans);
		text-transform: uppercase;
		font-weight: bold;
		margin: 0 0.4rem;
		padding: 0.25rem 2rem 0.25rem 0.5rem;
		border-radius: 0.25rem;
		position: relative;
	}
	:global(span.playable):hover {
		cursor: pointer;
		background: var(--color-gray-100);
	}

	@media (max-width: 1200px) {
		h2 {
			font-size: 3.75rem;
		}
	}

	@media (max-width: 1000px) {
		.slide {
			flex-direction: column;
		}
		h2 {
			font-size: 2.5rem;
		}
	}

	@media (max-width: 600px) {
		.slide {
			padding: 0.5rem 1rem;
		}
		h2 {
			font-size: 1.75rem;
		}
		.text {
			font-size: 0.9rem;
			margin-left: 0;
			flex-basis: 80px;
		}
	}

	@media (max-width: 400px) {
		h2 {
			font-size: 1.25rem;
		}
	}
</style>
