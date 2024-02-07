<script>
	import copy from "$data/copy.json";
	import Icon from "$components/helpers/Icon.svelte";
	import { soundOn, loaded, inIntro, inTitle, entered } from "$stores/misc.js";
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
	const enter = () => {
		$entered = true;
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
		font-family: var(--sans);
		background: var(--color-fg);
		color: var(--color-bg);
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
		.hed {
			font-size: 1rem;
		}
		:global(h1) {
			font-size: 6rem;
		}
	}
</style>
