<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Lines from "$components/Lines.svelte";
	import { onMount } from "svelte";
	import viewport from "$stores/viewport.js";
	import ids from "$data/ids.csv";
	import copy from "$data/copy.json";
	import {
		entered,
		loaded,
		playing,
		soundOn,
		inIntro,
		inTitle
	} from "$stores/misc.js";
	import { fade } from "svelte/transition";
	import play from "$svg/play.svg";
	import inView from "$actions/inView.js";

	let allPitch;
	let data;
	let step;
	let videoEl;

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
	const playVideo = () => {
		if (!videoEl) return;
		setTimeout(() => {
			videoEl.currentTime = 0;
			videoEl.play();
		}, 500);
	};
	const pauseVideo = () => {
		if (!videoEl) return;
		videoEl.pause();
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
	const sectionEnter = () => {
		$inIntro = true;
	};

	$: videoVisible = $inIntro && step === 2;
	$: if (videoVisible) playVideo();
	$: if (!videoVisible) pauseVideo();
	$: isolate = step === undefined ? steps[0].isolate : steps[step].isolate;
	$: showStandard = step >= 4;
	$: imgSrc = imgVisible
		? `assets/three-color/${
				step === 1 ? "fergie" : "whitney-houston"
		  }_cutout.png`
		: "";
	$: imgAlt = step === 1 ? "Fergie" : "Whitney Houston";
	$: imgVisible =
		($inIntro || $inTitle) && (step === undefined || step === 0 || step === 1);

	onMount(async () => {
		playableText();

		// Load line data
		const isMobile = $viewport.width <= 600;
		const module = await import(
			`$data/pitch/${isMobile ? "mobile" : "desktop"}/full.csv`
		);
		allPitch = castFloat(module.default);
		data = prepareLineData();

		// Load Maya video
		const src = "/assets/video/maya-brave.mp4";
		const request = new XMLHttpRequest();
		request.open("GET", src, true);
		request.responseType = "blob";
		request.onload = function () {
			if (this.status === 200) {
				const videoBlob = this.response;
				const videoUrl = URL.createObjectURL(videoBlob);
				if (videoEl) videoEl.src = videoUrl;
				$loaded = true;
			}
		};
		request.send();
	});
</script>

<section id="intro" use:inView on:enter={sectionEnter}>
	<!-- <div class="maya-vid-wrapper" class:visible={videoVisible}>
		<div class="vid-overlay"></div>
		<video bind:this={videoEl} id="maya-vid" muted={!$soundOn}> </video>
	</div> -->

	<div class="spacer" />
	<div class="sticky">
		{#if data}
			<Lines
				{data}
				intro={true}
				{showStandard}
				{isolate}
				hideAll={videoVisible}
			/>
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
		<img src={imgSrc} class:visible={imgVisible} alt={imgAlt} transition:fade />
	{/key}
</section>

<style>
	/* section {
		display: none;
	} */
	/* section.visible {
		display: block;
	} */
	.spacer {
		height: 5vh;
	}
	.sticky {
		position: sticky;
		z-index: 1;
		height: 500px;
		top: 10vh;
		padding: 0 2rem;
	}
	.maya-vid-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 1;
		opacity: 0;
		transition: opacity var(--1s);
	}
	.maya-vid-wrapper.visible {
		opacity: 1;
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
