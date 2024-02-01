<script>
	import { onMount } from "svelte";
	import copy from "$data/copy.json";
	import Icon from "$components/helpers/Icon.svelte";
	import play from "$svg/play.svg";
	import { soundOn, ready } from "$stores/misc.js";

	onMount(() => {
		const enableAudio = document.getElementById("enable-audio");
	});

	// TODO: add page leaving logic with soundOn
	const onMute = () => {
		$soundOn = !$soundOn;
	};
</script>

<section id="title">
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
		height: calc(100vh - 6rem);
		position: relative;
	}
	:global(h1) {
		font-family: "Newsagent";
		font-size: 12rem;
		line-height: 1;
	}
	.hed {
		font-size: 1.3rem;
		max-width: 500px;
	}
	:global(span#enable-audio) {
		background: var(--color-red);
		color: var(--color-dark-blue);
		padding: 0.25rem;
		margin: 0 0.25rem;
		border-radius: 0.25rem;
		font-family: var(--sans);
		font-weight: bold;
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
</style>
