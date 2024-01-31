<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Lines from "$components/Lines.svelte";
	import { onMount } from "svelte";
	import viewport from "$stores/viewport.js";
	import ids from "$data/ids.csv";

	let allPitch;
	let data;
	let step;

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
	});
</script>

<section id="intro">
	<div class="sticky">
		{#if data}
			<Lines {data} showStandard={true} full={true} />
		{:else}
			<p>Loading...</p>
		{/if}
	</div>

	<Scrolly bind:value={step}>
		{#each [0, 1, 2] as text, i}
			{@const active = step === i}
			<div class="step" class:active>
				<p>Tk this will be some text.</p>
			</div>
		{/each}
	</Scrolly>
</section>

<style>
	.sticky {
		height: 500px;
		position: sticky;
		top: 50%;
		transform: translate(0, -50%);
		z-index: 1;
	}
	.step {
		background: var(--color-dark-blue);
		border: 3px solid var(--color-grey-blue);
		margin: 75vh 0;
		text-align: center;
	}
	.step p {
		padding: 1rem;
		pointer-events: auto;
	}
	.step:last-child {
		margin-bottom: 25vh;
	}
</style>
