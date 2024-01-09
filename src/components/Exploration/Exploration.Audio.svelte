<script>
	import { onMount } from "svelte";

	export let start;
	export let end;
	export let singer;

	let audioEl;
	let playing = false;
	let currentTime;
	let af;

	const play = () => {
		if (playing) return;

		audioEl.currentTime = start;
		audioEl.play();
		playing = true;
		track();
	};
	const track = () => {
		if (!audioEl) return;

		if (audioEl.currentTime >= end) {
			audioEl.pause();
			playing = false;
			cancelAnimationFrame(af);
		} else {
			currentTime = audioEl.currentTime;
			af = requestAnimationFrame(track);
		}
	};

	onMount(() => {
		audioEl.currentTime = start;
		track();
	});
</script>

<audio bind:this={audioEl} src={`assets/sound/${singer}.mp3`} />
<button on:click={play}>play</button>
