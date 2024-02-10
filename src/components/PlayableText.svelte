<script>
	import { playing } from "$stores/misc.js";

	export let id;
	export let phraseI;
	export let text;

	$: playingMe = $playing && $playing.id === id;

	const onClick = () => {
		if (playingMe) {
			$playing = undefined;
		} else {
			$playing = { id, phraseI };
		}
	};
</script>

<button on:click={onClick}>
	{text}
	<div
		class="play-pause"
		style:background-image={`url(assets/${playingMe ? "pause" : "play"}.png)`}
	/>
</button>

<style>
	button {
		pointer-events: auto;
		display: inline-flex;
		align-items: center;
		font-family: var(--sans);
		background: var(--color-fg);
		color: var(--color-bg);
		text-transform: uppercase;
		font-weight: bold;
		margin: 0 0.4rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		white-space: nowrap;
	}
	button:hover {
		background: var(--color-gray-200);
	}
	div {
		display: inline-block;
		width: 1.5em;
		height: 1.5em;
		margin-left: 0.5rem;
		transform: translate(0, 1px);
		background-position: center;
		background-size: cover;
	}
</style>
