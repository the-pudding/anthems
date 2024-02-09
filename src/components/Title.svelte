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

	const stanzas = [0, 1, 2, 3, 4, 5, 6, 7];

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
			{#each stanzas as stanza, i}
				<div class="stanza-image-wrap" style="animation-delay: {i}s">
					<img
						src="assets/stanza{stanza}.png"
						alt="Francis Scott Key's handwritten lyrics to the Star Spangeled Banner"
					/>
				</div>
			{/each}
		</div>
	{/if}

	<div class="hed">{@html copy.hed}</div>
	<div class="byline">{@html copy.byline}</div>

	<button class="begin" class:visible={$loaded} on:click={enter}>Begin</button>

	<button class="icon mute" on:click={onMute}>
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
	:global(h1) {
		font-family: "Newsagent";
		font-variant-alternates: swash(fancy);
		font-size: 12rem;
		line-height: 0.75;
		padding: 1rem 0 4rem 0;
	}
	.hed {
		font-size: 1.3rem;
		max-width: 500px;
	}
	:global(.enable-audio) {
		color: var(--color-grey-blue);
	}
	.byline {
		font-family: var(--sans);
	}
	button.begin {
		visibility: hidden;
		margin-top: 3rem;
		font-size: 1.5rem;
		font-weight: 700;
		font-size: var(--16px);
		padding: 1rem;
		background: var(--color-fg);
	}
	button.begin:hover {
		background: var(--color-red);
		transform: translateY(-2px);
		transition: all 250ms;
		box-shadow: rgba(2, 39, 61, 1) 0 4px 12px;
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
		top: 2rem;
		right: 2rem;
		background: none;
		z-index: 10;
		transition: all 250ms;
	}
	.mute:hover {
		transform: translateY(-2px);
	}
	:global(.mute:hover span svg) {
		stroke: var(--color-red);
	}
	@media (max-width: 600px) {
		section {
			padding: 2rem 2rem 0 2rem;
		}
		.hed {
			padding-right: 2rem;
			font-size: 1rem;
			margin-top: 3rem;
		}
		:global(h1) {
			font-size: 6rem;
		}
		.mute {
			top: 1.5rem;
			right: 1.5rem;
		}
	}
</style>
