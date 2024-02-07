<script>
	import { onMount } from "svelte";
	import copy from "$data/copy.json";
	import Icon from "$components/helpers/Icon.svelte";
	import { soundOn, ready, inIntro, inTitle } from "$stores/misc.js";
	import inView from "$actions/inView.js";

	const onMute = () => {
		$soundOn = !$soundOn;
	};
	const sectionEnter = () => {
		$inIntro = false;
		$inTitle = true;
	};
	const sectionExit = () => {
		$inTitle = false;
	};
</script>

<section id="title" use:inView on:enter={sectionEnter} on:exit={sectionExit}>
	<div class="hed">{@html copy.hed}</div>
	<div class="byline">{@html copy.byline}</div>
	<div class="scroll" class:visible={$ready}>
		<div>Scroll</div>
		<span class="icon">
			<Icon name="chevron-down" size="4rem" fill="none" />
		</span>
	</div>

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
		border-bottom: 3px solid var(--color-grey-blue);
	}
	.byline {
		font-family: var(--sans);
	}
	.scroll {
		position: absolute;
		bottom: 3rem;
		text-transform: uppercase;
		font-family: var(--sans);
		display: flex;
		flex-direction: column;
		align-items: center;
		visibility: hidden;
	}
	.scroll.visible {
		visibility: visible;
		animation: bounce var(--1s) infinite;
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
	}

	@keyframes bounce {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-0.5rem);
		}
		100% {
			transform: translateY(0);
		}
	}

	@media (max-width: 600px) {
		.hed {
			font-size: 1rem;
		}
		:global(h1) {
			font-size: 6rem;
		}
	}
</style>
