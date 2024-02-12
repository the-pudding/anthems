<script>
	import _ from "lodash";
	import ids from "$data/ids.csv";
	import { base } from "$app/paths";
	import { currentTime, soundOn } from "$stores/misc.js";
	import { onMount, tick } from "svelte";
	import loadAudio from "$utils/loadAudio.js";

	export let id;
	export let phraseI;

	let audioEl;
	let f;
	let loaded = false;
	let paused;

	const play = () => {
		if (!audioEl || !id) return;
		console.log("play");

		cancelAnimationFrame(f);

		const start = +ids.find((d) => d.id === id)[`phrase${phraseI || 0}_start`];
		const end =
			phraseI !== undefined
				? +ids.find((d) => d.id === id)[`phrase${phraseI}_end`]
				: +ids.find((d) => d.id === id)[`phrase15_end`];

		audioEl.currentTime = start;
		audioEl.play();

		const checkTime = () => {
			$currentTime = audioEl.currentTime;
			if ($currentTime >= end) {
				console.log("this pause");
				audioEl.pause();
				audioEl.currentTime = start;
				cancelAnimationFrame(f);
			} else {
				f = requestAnimationFrame(checkTime);
			}
		};

		f = requestAnimationFrame(checkTime);
	};
	const pause = () => {
		if (!audioEl || paused) return;
		console.log("pause");
		audioEl.pause();
		cancelAnimationFrame(f);
	};

	const updateSource = () => {
		loaded = false;
		const src = `${base}/assets/vocals/${id}.mp3`;
		audioEl.src = src;
		audioEl.load();
	};
	const onVisibilityChange = () => {
		const hidden = document.hidden;
		if (hidden && paused === false) pause();
		else if (!hidden) play();
	};
	const setupEvents = () => {
		audioEl.addEventListener("canplay", () => {
			if (!loaded) {
				loaded = true;
				play();
			}
		});
		document.addEventListener("visibilitychange", onVisibilityChange);
	};

	$: if (id) updateSource(phraseI);
	$: if (!id) pause();

	onMount(async () => {
		await tick();
		setupEvents();
		await loadAudio(`assets/vocals/whitney-houston_super-bowl_1991.mp3`);
		await loadAudio(`assets/vocals/fergie_nba-allstar-game_2018.mp3`);
	});
</script>

<audio bind:this={audioEl} bind:paused muted={!$soundOn} />
