<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Lines from "$components/Lines.svelte";
	import { onMount } from "svelte";
	import viewport from "$stores/viewport.js";
	import ids from "$data/ids.csv";
	import copy from "$data/copy.json";
	import { ready, playing, soundOn } from "$stores/misc.js";
	import { fade } from "svelte/transition";
	import scrollY from "$stores/scrollY.js";
	import play from "$svg/play.svg";

	let allPitch;
	let data;
	let step;
	let video;

	const steps = copy.intro;
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
			const pitch = allPitch.map((d) => ({
				timestamp: d.timestamp,
				frequency: d[id]
			}));
			return {
				id: id,
				pitch: pitch
			};
		});
	};
	const stepChange = () => {
		// if (step === undefined) {
		// 	if ($scrollY > 3000) direction = "down";
		// 	else direction = "up";
		// }
		if (step === 2) {
			setTimeout(() => {
				video = document.getElementById("maya-vid");
				video.play();
			}, 1500);
		}
	};
	const playableText = () => {
		const playableText = document.querySelectorAll(`#intro span.playable`);
		playableText.forEach((el) => {
			el.addEventListener("click", () => {
				const id = el.dataset.id;
				const phraseI = el.dataset.phrase;

				if ($playing && $playing.id === id && $playing.phraseI === phraseI) {
					$playing = undefined;
				} else {
					$playing = { id, phraseI };
				}
			});
			el.insertAdjacentHTML("beforeend", play);
		});
	};

	$: isolate = step === undefined ? steps[0].isolate : steps[step].isolate;
	$: hideAll = step === 2;
	$: showStandard = step >= 4;
	$: imgSrc = imgVisible
		? `assets/three-color/${
				step === 1 ? "fergie" : "whitney-houston"
		  }_cutout.png`
		: "";
	$: imgAlt = step === 1 ? "Fergie" : "Whitney Houston";
	$: imgVisible = step === undefined || step === 0 || step === 1;
	$: step, stepChange();

	onMount(async () => {
		playableText();
		const isMobile = $viewport.width <= 600;
		const module = await import(
			`$data/pitch/${isMobile ? "mobile" : "desktop"}/full.csv`
		);
		allPitch = castFloat(module.default);
		data = prepareLineData();
		$ready = true;
	});
</script>

<section id="intro" class:visible={$ready}>
	{#if step === 2 && step !== undefined}
		<div
			transition:fade={{ delay: 0, duration: 1000 }}
			class="maya-vid-wrapper"
		>
			<div class="vid-overlay"></div>
			<!-- <video id="maya-vid" muted={!$soundOn}>
				<source src="/assets/video/maya-brave.mp4" type="video/mp4" />
			</video> -->
		</div>
	{/if}
	<div class="spacer" />
	<div class="sticky">
		{#if data}
			<Lines {data} intro={true} {showStandard} {isolate} {hideAll} />
		{:else}
			<p>Loading...</p>
		{/if}
	</div>

	<Scrolly bind:value={step}>
		{#each steps as { text }, i}
			{@const active = step === i}
			<div class="step" class:active>
				<p>{@html text}</p>
			</div>
		{/each}
	</Scrolly>

	{#key imgSrc}
		<!-- <img src={imgSrc} class:visible={imgVisible} alt={imgAlt} transition:fade /> -->
	{/key}
</section>

<style>
	section {
		display: none;
	}
	section.visible {
		display: block;
	}
	.spacer {
		height: 50vh;
	}
	.sticky {
		position: sticky;
		z-index: 1;
		height: 500px;
		top: 0rem;
		padding: 0 2rem;
	}
	.maya-vid-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 1;
	}
	.vid-overlay {
		position: fixed;
		right: 0;
		bottom: 0;
		min-width: 100%;
		min-height: 100%;
		background: var(--color-dark-blue);
		z-index: 100;
		mix-blend-mode: multiply;
		opacity: 0.5;
	}
	#maya-vid {
		position: fixed;
		right: 0;
		bottom: 0;
		min-width: 100%;
		min-height: 100%;
		object-fit: cover;
		filter: saturate(0%);
		z-index: 1;
	}
	.step {
		margin: 75vh 0 75vh 3rem;
		max-width: 28rem;
	}
	.step p {
		padding: 1rem;
		pointer-events: auto;
		line-height: 1.65;
		text-shadow: 2px 2px 4px var(--color-black);
	}
	:global(.step p span) {
		text-shadow: none;
	}
	.step:first-child {
		margin-top: 0;
	}
	.step:last-child {
		margin-bottom: 50vh;
	}
	img {
		position: fixed;
		bottom: 0;
		right: 0;
		width: 65%;
		z-index: -1;
		visibility: hidden;
	}
	img.visible {
		visibility: visible;
	}
</style>
