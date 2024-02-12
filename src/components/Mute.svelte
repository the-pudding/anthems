<script>
	import Icon from "$components/helpers/Icon.svelte";
	import { soundOn, userMuted, inTitle } from "$stores/misc.js";

	const onMute = () => {
		$userMuted = !$userMuted;
		$soundOn = !$soundOn;
	};
</script>

<button
	class="mute"
	class:visible={!$inTitle}
	class:muted={!$soundOn}
	on:click={onMute}
	aria-label="mute"
>
	{#key $soundOn}
		<Icon name={`volume-${$soundOn ? "2" : "x"}`} size="2rem" fill="none" />
	{/key}
</button>

<style>
	button {
		color: var(--color-grey-blue);
		position: fixed;
		top: 2.25rem;
		right: 1.5rem;
		background: none;
		z-index: 10;
		opacity: 0;
		transition: all calc(var(--1s) * 0.25) ease-in-out;
	}
	button.visible {
		opacity: 1;
	}
	button:hover {
		transform: translateY(-2px);
	}
	:global(button.mute:hover span svg),
	:global(button.mute.muted span svg) {
		stroke: var(--color-red);
	}

	@media (max-width: 600px) {
		button {
			top: 0.35rem;
			right: 1rem;
		}
	}
</style>
