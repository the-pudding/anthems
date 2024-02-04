<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Lines from "$components/Lines.svelte";
	import { onMount } from "svelte";
	import viewport from "$stores/viewport.js";
	import ids from "$data/ids.csv";
	import copy from "$data/copy.json";
	import { ready } from "$stores/misc.js";
	import { fade } from "svelte/transition";
	import scrollY from "$stores/scrollY.js";

	let allPitch;
	let data;
	let step;
	let direction = "up";

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
		console.log("step change", step);
		if (step === undefined) {
			console.log($scrollY);
			if ($scrollY > 3000) direction = "down";
			else direction = "up";
		}
	};

	onMount(async () => {
		const isMobile = $viewport.width <= 600;
		const module = await import(
			`$data/pitch/${isMobile ? "mobile" : "desktop"}/full.csv`
		);
		allPitch = castFloat(module.default);
		data = prepareLineData();
		$ready = true;
	});

	$: isolate = step === undefined ? steps[0].isolate : steps[step].isolate;
	$: hideAll = step === 2;
	$: showStandard = step >= 4;
	$: imgSrc = imgVisible
		? `assets/three-color/${
				step === 1 ? "fergie" : "whitney-houston"
		  }_cutout.png`
		: "";
	$: imgAlt = step === 1 ? "Fergie" : "Whitney Houston";
	$: imgVisible =
		(step === undefined && direction === "up") || step === 0 || step === 1;
	$: step, stepChange();
</script>

<section id="intro" class:visible={$ready}>
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
		top: 4rem;
	}
	.step {
		background: var(--color-bg);
		margin: 75vh 0;
		max-width: 600px;
	}
	.step p {
		padding: 1rem;
		pointer-events: auto;
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
