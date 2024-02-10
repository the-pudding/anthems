<script>
	import ErrorFinder from "$components/ErrorFinder.svelte";
	import Featured from "$components/Phrases.Featured.svelte";
	import Lines from "$components/Lines.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import { currentStepI, currentPhraseI, playing } from "$stores/misc.js";
	import ids from "$data/ids.csv";
	import play from "$svg/play.svg";
	import { onMount } from "svelte";

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
	const playableText = () => {
		// const playableText = document.querySelectorAll(
		// 	`#slide-${slideI} span.playable`
		// );
		// playableText.forEach((el) => {
		// 	el.addEventListener("click", () => {
		// 		const id = el.dataset.id;
		// 		if (highlight === id) {
		// 			highlight = undefined;
		// 			$playing = undefined;
		// 		} else {
		// 			if (id !== "standard") highlight = id;
		// 			$playing = { id, phraseI };
		// 		}
		// 	});
		// 	el.insertAdjacentHTML("beforeend", play);
		// });
	};

	$: if (!loaded && $currentPhraseI >= phraseI - preLoad) load();
	$: if ($currentPhraseI === phraseI) onNewStep($currentStepI);
	$: phraseI = phrase.phraseI;

	onMount(() => {
		playableText();
	});
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
		display: flex;
		position: relative;
	}
	:global(.tap-directions) {
		font-family: var(--sans);
		color: var(--color-red);
		padding-right: 2.75rem;
		font-weight: 700;
		background-image: url(assets/keyboard.png);
		background-size: 2.25rem;
		background-repeat: no-repeat;
		background-position: top right;
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
		padding: 1.5rem 1.5rem 3rem 1.5rem;
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
		margin-left: 2rem;
		max-width: 700px;
		pointer-events: auto;
	}
	.text p {
		display: none;
		line-height: 2;
	}
	.text p.visible {
		display: block;
	}
	:global(span.playable) {
		background: var(--color-fg);
		color: var(--color-bg);
		font-family: var(--sans);
		text-transform: uppercase;
		font-weight: bold;
		margin: 0 0.4rem;
		padding: 0.25rem 2rem 0.25rem 0.5rem;
		border-radius: 2px;
		position: relative;
		white-space: nowrap;
	}
	:global(span.playable):hover {
		cursor: pointer;
		background: var(--color-gray-100);
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
		main {
			padding: 1.5rem 1.5rem 3rem 3rem;
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
