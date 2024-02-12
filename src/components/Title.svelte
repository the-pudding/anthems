<script>
	import copy from "$data/copy.json";
	import Icon from "$components/helpers/Icon.svelte";
	import {
		soundOn,
		userMuted,
		loaded,
		inTitle,
		entered
	} from "$stores/misc.js";
	import inView from "$actions/inView.js";
	import { tick } from "svelte";
	import { fade } from "svelte/transition";
	import Loading from "$components/Loading.svelte";
	import _ from "lodash";

	const onMute = () => {
		$userMuted = !$userMuted;
		$soundOn = !$soundOn;
	};
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
	const enter = async () => {
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
						alt="Francis Scott Key's handwritten lyrics to the Star Spangeled Banner"
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
			<button class="begin" class:visible={$loaded} on:click={enter}>Begin</button>
		{:else} 
			<Loading />
		{/if}
	</div>

	<button class="icon mute" on:click={onMute} aria-label="mute">
		{#key $soundOn}
			<Icon name={`volume-${$soundOn ? "2" : "x"}`} size="2rem" fill="none" />
		{/key}
	</button>
</section>

<style>
	section {
		height: 100vh;
		position: relative;
		padding: 3rem 3rem 0 3rem;
		margin-bottom: 3rem;
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
	}
	button.begin {
		visibility: hidden;
		margin-top: 3rem;
		font-size: 1.5rem;
		font-weight: 700;
		font-size: var(--16px);
		padding: 1rem;
		border-radius: 4px;
		background: var(--color-fg);
		transition: all calc(var(--1s) * 0.25) ease-in-out;
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
	.icon {
		color: var(--color-grey-blue);
	}
	.mute {
		position: fixed;
		top: 2.25rem;
		right: 1.5rem;
		background: none;
		z-index: 10;
		transition: all calc(var(--1s) * 0.25) ease-in-out;
	}
	.mute:hover {
		transform: translateY(-2px);
	}
	:global(.mute:hover span svg),
	:global(.mute.muted span svg) {
		stroke: var(--color-red);
	}
	@media (max-width: 600px) {
		section {
			padding: 2rem 2rem 0 2rem;
		}
		.prehed {
			font-family: var(--serif);
			padding-right: 2rem;
			font-size: 1rem;
			max-width:400px;
		}
		h1 {
			padding-right: 2rem;
			font-size: var(--96px);
			line-height: 0.9;
			margin-top: 1rem;
			max-width:400px;
		}
		.stanza-image-wrap {
			margin: -0.5rem 0;
		}
		.mute {
			top: 0.35rem;
			right: 1rem;
		}
	}
</style>
