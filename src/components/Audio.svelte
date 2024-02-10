<script>
	import copy from "$data/copy.json";
	import _ from "lodash";
	import ids from "$data/ids.csv";
	import { playing, currentTime, soundOn } from "$stores/misc.js";
	import { onMount } from "svelte";

	let mounted = false;
	let f;

	const allFeaturedIds = _.uniq(
		_.flatten(
			copy.slides
				.filter((d) => d.featured)
				.map((d) => d.featured.map((f) => f.id))
		)
	);
	const remainingIds = ids
		.map((d) => d.id)
		.filter((d) => !allFeaturedIds.includes(d));

	$: if ($playing) playAudio($playing);
	$: if ($playing === undefined) pauseAudio();

	const playAudio = ({ id, phraseI }) => {
		if (!mounted || !id) return;

		pauseAudio();

		const audioEl = document.getElementById(`${id}-audio`);
		const start = +ids.find((d) => d.id === id)[`phrase${phraseI || 0}_start`];
		const end =
			phraseI !== undefined
				? +ids.find((d) => d.id === id)[`phrase${phraseI}_end`]
				: audioEl.duration;

		audioEl.currentTime = start;
		audioEl.play();

		const checkTime = () => {
			$currentTime = audioEl.currentTime;
			if ($currentTime >= end) {
				// $playing = undefined;
				audioEl.pause();
				audioEl.currentTime = start;
				cancelAnimationFrame(f);
			} else {
				f = requestAnimationFrame(checkTime);
			}
		};

		f = requestAnimationFrame(checkTime);
	};
	const pauseAudio = () => {
		if (!mounted) return;

		const allAudioEls = document.querySelectorAll("audio");
		const playing = Array.from(allAudioEls).filter((d) => !d.paused);

		if (playing.length) {
			cancelAnimationFrame(f);
			playing.forEach((el) => {
				el.pause();
			});
		}
	};

	onMount(() => {
		mounted = true;
	});
</script>

{#each allFeaturedIds as id}
	<audio src={`assets/vocals/${id}.mp3`} id={`${id}-audio`} muted={!$soundOn} />
{/each}
{#each remainingIds as id}
	<audio src={`assets/vocals/${id}.mp3`} id={`${id}-audio`} muted={!$soundOn} />
{/each}
