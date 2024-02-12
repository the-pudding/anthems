<script>
	import copy from "$data/copy.json";
	import Mute from "$components/Mute.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { loaded, inTitle, entered, soundOn } from "$stores/misc.js";
	import inView from "$actions/inView.js";
	import { tick } from "svelte";
	import { fade } from "svelte/transition";
	import Loading from "$components/Loading.svelte";
	import _ from "lodash";

	const sectionEnter = () => {
		if ($entered) {
			$inTitle = true;
		}
	};
	const sectionExit = () => {
		if ($entered) {
			$inTitle = false;
		}
	};
	const enter = async (withAudio) => {
		$soundOn = withAudio;
		$entered = true;

		await tick();
		const introEl = document.querySelector("#intro");
		introEl.scrollIntoView({ behavior: "smooth", block: "start" });
	};
</script>

<section id="title" use:inView on:enter={sectionEnter} on:exit={sectionExit}>
	{#if $inTitle}
		<div class="handwritting-wrapper" transition:fade={{ duration: 500 }}>
			{#each _.range(8) as stanza, i}
				<div class="stanza-image-wrap" style="animation-delay: {i}s">
					<img
						src="assets/lyrics/stanza{stanza}.png"
						alt="Francis Scott Key's handwritten lyrics to the Star Spangled Banner"
					/>
				</div>
			{/each}
		</div>
	{/if}

	<div class="prehed">{@html copy.prehed}</div>
	<h1>{@html copy.hed}</h1>
	<div class="byline">{@html copy.byline}</div>

	<div class="begin-wrapper">
		{#if $loaded}
			<button class="begin" class:visible={$loaded} on:click={() => enter(true)}
				>Begin with Audio
				<span><Icon name="volume-2" /></span>
			</button>
			<button
				class="begin no-audio"
				class:visible={$loaded}
				on:click={() => enter(false)}
				>Begin Muted
				<span><Icon name="volume-x" /></span>
			</button>
		{:else}
			<Loading />
		{/if}
	</div>

	<Mute />
</section>

<style>
	section {
		height: 100vh;
		position: relative;
		padding: 3rem 3rem 0 3rem;
		margin-bottom: 3rem;
		overflow: scroll;
	}
	h1 {
		font-family: "Newsagent";
		font-variant-alternates: swash(fancy);
		font-size: var(--160px);
		line-height: 0.8;
		padding: 1rem 0 4rem 0;
		max-width: 600px;
	}
	.prehed {
		font-family: var(--serif);
		font-size: 1.3rem;
		max-width: 500px;
		margin: 0;
		padding-right: 4rem;
	}
	:global(.enable-audio) {
		color: var(--color-grey-blue);
	}
	.byline {
		font-family: var(--sans);
	}
	.begin-wrapper {
		width: 100%;
		margin-top: 2rem;
		position: relative;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		align-items: start;
	}
	button.begin {
		visibility: hidden;
		display: flex;
		align-items: center;
		margin-top: 3rem;
		font-size: 1.2rem;
		font-weight: 700;
		padding: 1rem;
		border-radius: 4px;
		background: var(--color-fg);
		transition: all calc(var(--1s) * 0.25) ease-in-out;
	}
	button.begin:nth-of-type(2) {
		margin-top: 0.75rem;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		background: var(--color-gray-400);
	}
	button.begin span {
		margin-left: 0.5rem;
		transform: translate(0, 2px);
	}
	button.begin:hover {
		background: var(--color-red);
		transform: translateY(-2px);
		box-shadow: rgba(0, 0, 0, 0.25) 0 2px 8px;
	}
	button.begin.visible {
		visibility: visible;
	}
	.handwritting-wrapper {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		width: 100%;
		height: 100vh;
		max-width: 1000px;
		margin: 0 auto;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
		mix-blend-mode: overlay;
		opacity: 0.6;
		pointer-events: none;
	}
	.stanza-image-wrap {
		width: 100%;
		margin: -1rem 0;
	}
	.stanza-image-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 600px) {
		section {
			padding: 2rem 2rem 0 2rem;
		}
		.prehed {
			font-family: var(--serif);
			padding-right: 2rem;
			font-size: 1rem;
			max-width: 400px;
		}
		h1 {
			padding-right: 2rem;
			font-size: var(--96px);
			line-height: 0.9;
			margin-top: 1rem;
			max-width: 400px;
		}
		.stanza-image-wrap {
			margin: -0.5rem 0;
		}
		.begin-wrapper {
			margin-top: 1rem;
		}
	}
</style>
