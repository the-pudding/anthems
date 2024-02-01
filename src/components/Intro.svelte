<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Lines from "$components/Lines.svelte";
	import { onMount } from "svelte";
	import viewport from "$stores/viewport.js";
	import ids from "$data/ids.csv";
	import copy from "$data/copy.json";
	import { ready } from "$stores/misc.js";

	let allPitch;
	let data;
	let step;

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
</style>
