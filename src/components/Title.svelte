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
		border-bottom: 3px solid var(--color-grey-blue);
	}
	.byline {
		font-family: var(--sans);
	}
	button.begin {
		visibility: hidden;
		margin-top: 3rem;
		font-size: 1.5rem;
	}
	button.begin:hover {
		background: var(--color-grey-blue);
	}
	button.begin.visible {
		visibility: visible;
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
