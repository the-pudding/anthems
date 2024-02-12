<script>
	import Featured from "$components/Phrases.Featured.svelte";
	import Lines from "$components/Lines.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import {
		entered,
		currentStepI,
		currentPhraseI,
		playing
	} from "$stores/misc.js";
	import ids from "$data/ids.csv";
	import Loading from "$components/Loading.svelte";
	import loadAudio from "$utils/loadAudio.js";

	export let phrase;
	export let slideI;
	export let active;

	let loaded = false;
	let phrasePitch;
	let data;

	$: highlight = active ? $playing?.id : undefined;

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
	const load = async () => {
		// load data for lines
		const module = await import(`$data/pitch/desktop/phrase${phraseI}.csv`);
		loaded = true;
		phrasePitch = castFloat(module.default);
		data = prepareLineData();

		// load audio
		const promises = phrase.featured.map((d) =>
			loadAudio(`assets/vocals/${d.id}.mp3`)
		);
		Promise.all(promises)
			.then(() => {
				loaded = true;
			})
			.catch((error) => {
				console.error("error loading audio");
			});
	};

	$: if ($entered && !loaded && $currentPhraseI >= phraseI - preLoad) load();
	$: phraseI = phrase.phraseI;
	$: displayDots = data ? "none" : "flex";
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
				{:else if !loaded}
					<Loading pos={true} display={displayDots} />
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
		border: 2px solid var(--color-grey-blue);
		height: 100%;
		display: flex;
		position: relative;
		padding: 1rem 1rem 0 1rem;
		box-shadow: rgba(0, 0, 0, 0.25) 0 2px 8px;
		overflow: scroll;
	}
	:global(.tap-directions) {
		font-family: var(--sans);
		color: var(--color-fg);
		padding: 0.25rem 3.5rem 0.25rem 0.5rem;
		font-weight: 700;
		background-image: url("/assets/keyboard.png");
		background-size: 2.25rem;
		background-repeat: no-repeat;
		background-position: center right 0.75rem;
		display: inline-block;
		border: 1px solid var(--color-red);
		border-radius: 4px;
	}
	:global(.data-directions) {
		font-family: var(--sans);
		color: var(--color-fg);
		padding: 0.25rem 2.75rem 0.25rem 0.5rem;
		font-weight: 700;
		background-image: url("/assets/down-chevron.png");
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: center right 0.75rem;
		display: inline-block;
		border: 1px solid var(--color-red);
		border-radius: 4px;
	}
	.line-wrapper {
		display: flex;
		flex: 1;
		/* min-height: 200px; */
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
		font-size: 3.75rem;
		display: flex;
		justify-content: space-evenly;
		margin-bottom: 0;
	}
	.text {
		margin-left: 2rem;
		max-width: 700px;
		height: 10rem;
		overflow-y: hidden;
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
		.text {
			height: 15rem;
		}
	}

	@media (max-width: 1000px) {
		.slide {
			flex-direction: column;
		}
		h2 {
			font-size: 2.75rem;
		}
		main {
			padding: 1.5rem 1.5rem 3rem 3rem;
		}
		.text {
			margin-left: 0rem;
		}
	}

	@media (max-width: 800px) {
		h2 {
			font-size: 2rem;
		}
	}

	@media (max-width: 600px) {
		.main {
			padding: 0rem 1rem 2rem 1rem;
		}
		.slide {
			padding: 0.5rem 1rem;
			overflow: visible;
		}
		h2 {
			font-size: 1.75rem;
			margin: 0;
		}
		.text {
			font-size: var(--14px);
			margin: 0;
		}
		.text p {
			line-height: 2;
		}
	}

	@media (max-width: 400px) {
		h2 {
			font-size: 1.6rem;
		}
		.slide {
			padding: 0.75rem 0.75rem 0 0.75rem;
		}
		.text {
			height: 18rem;
		}
	}
</style>
