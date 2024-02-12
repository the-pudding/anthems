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
	import inView from "$actions/inView.js";
	import { base } from "$app/paths";

	let allPitch;
	let data;
	let step;
	let videoEl;
	let sectionEl;

	const steps = copy.intro;
	const allIds = ids.map((d) => d.id);
	const featuredIds = [
		"whitney-houston_super-bowl_1991",
		"fergie_nba-allstar-game_2018"
	];

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
		// setTimeout(() => {
		videoEl.currentTime = 0;
		videoEl.play();
		// }, 500);
	};
	const pauseVideo = () => {
		if (!videoEl) return;
		videoEl.pause();
	};
	const sectionEnter = () => {
		if ($entered) {
			$inIntro = true;
		}
	};
	const sectionExit = () => {
		if ($entered) {
			$inIntro = false;
		}
	};
	const onNewStep = () => {
		$playing = undefined;
	};

	$: step, onNewStep();
	$: mobile = $viewport.width < 600;
	$: videoVisible = $inIntro && !$inTitle && step === 2;
	$: if (videoVisible) playVideo();
	$: if (!videoVisible || !$inIntro) pauseVideo();
	$: isolate =
		step === undefined
			? steps[0].isolate
			: step >= steps.length
			? undefined
			: steps[step].isolate;
	$: imgSrc = imgVisible
		? `assets/three-color/${
				step === 1 ? "fergie" : "whitney-houston"
		  }_cutout.png`
		: "";
	$: imgAlt = step === 1 ? "Fergie" : "Whitney Houston";
	$: imgVisible =
		$inTitle || ($inIntro && (step === undefined || step === 0 || step === 1));

	onMount(async () => {
		// Load line data
		const isMobile = $viewport.width <= 600;
		const module = await import(
			`$data/pitch/${isMobile ? "mobile" : "desktop"}/full.csv`
		);
		allPitch = castFloat(module.default);
		data = prepareLineData();

		// Load Maya video
		if (!mobile) {
			const src = `${base}/assets/video/maya-brave.mp4`;
			const request = new XMLHttpRequest();
			request.open("GET", src, true);
			request.responseType = "blob";
			request.onload = function () {
				if (this.status === 200) {
					console.log("successful load video");
					const videoBlob = this.response;
					const videoUrl = URL.createObjectURL(videoBlob);
					if (videoEl) {
						videoEl.src = videoUrl;
						$loaded = true;
					}
				}
			};
			request.send();
		} else {
			$loaded = true;
		}
	});
</script>

<section
	id="intro"
	bind:this={sectionEl}
	use:inView={{ top: 250 }}
	on:enter={sectionEnter}
	on:exit={sectionExit}
>
	<div class="maya-vid-wrapper" class:visible={videoVisible}>
		<div class="vid-overlay"></div>

		{#if !mobile}
			<video
				playsinline
				bind:this={videoEl}
				id="maya-vid"
				muted={!$soundOn}
				poster="/assets/video/maya-poster.jpg"
			>
			</video>
		{/if}
		{#if !$loaded || mobile}
			<img
				id="maya-img"
				src="/assets/video/maya-poster.jpg"
				alt="maya rudoply singing the national anthem on snl"
			/>
		{/if}
	</div>

	<div class="spacer" />
	<div class="sticky">
		{#if data}
			<Lines
				{data}
				intro={true}
				{isolate}
				{featuredIds}
				{videoVisible}
				hideAll={videoVisible || $inTitle}
			/>
		{:else}
			<!-- <p>Loading...</p> -->
		{/if}
	</div>

	<Scrolly bind:value={step}>
		{#each steps as { text }, i}
			{@const active = step === i}
			<div class="step" class:active>
				<p>{@html text}</p>
			</div>
		{/each}
		<div class="step" style:height={"300px"}></div>
	</Scrolly>

	{#key imgSrc}
		<img src={imgSrc} class:visible={imgVisible} alt={imgAlt} transition:fade />
	{/key}
</section>

<style>
	.spacer {
		height: 5vh;
	}
	.sticky {
		position: sticky;
		z-index: 1;
		height: 500px;
		top: 25%;
		transform: translate(0, -25%);
		padding: 0 2rem;
		pointer-events: none;
	}
	.maya-vid-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 1;
		visibility: hidden;
		opacity: 0;
		transition: opacity var(--1s);
	}
	.maya-vid-wrapper.visible {
		visibility: visible;
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
	#maya-img {
		position: fixed;
		right: 0;
		bottom: 0;
		min-width: 100%;
		min-height: 100%;
		object-fit: cover;
		filter: saturate(0%);
		z-index: 1;
		visibility: visible;
	}
	#maya-vid {
		position: fixed;
		right: 0;
		bottom: 0;
		min-width: 100%;
		min-height: 100%;
		object-fit: cover;
		filter: saturate(0%);
		z-index: 2;
	}
	.step {
		margin: 75vh 0 75vh 5rem;
		max-width: 28rem;
	}
	.step p {
		padding: 1rem;
		pointer-events: auto;
		line-height: 1.8;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}
	:global(.step p span) {
		text-shadow: none;
	}
	.step:first-child {
		margin-top: 0;
	}
	.step:last-child {
		margin-bottom: 0;
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

	@media (max-width: 600px) {
		img {
			width: 100%;
		}
		.sticky {
			height: 250px;
			transform: translate(0, -50%);
		}
		.step {
			margin-left: 0;
		}
		.step p {
			font-size: var(--14px);
			background: rgb(2 39 61 / 95%);
			margin: 0 1rem;
			box-shadow: rgba(0, 0, 0, 0.25) 0 2px 8px;
		}
	}
</style>
