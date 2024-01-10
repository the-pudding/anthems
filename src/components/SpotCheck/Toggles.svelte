<script>
	export let data;
	export let zScale;
	export let hide;
	export let flag;
	export let flagged;
	export let lyrics;

	let audioEls = [];
	let soloed;

	const solo = (e) => {
		const id = e.target.id.replace("-solo-btn", "");
		if (soloed === id) {
			soloed = undefined;
		} else {
			soloed = id;
		}
	};
	const play = (e) => {
		const id = e.target.id.replace("-play-btn", "");
		const relevantSlice = data.find((d) => d.id === id);

		if (!relevantSlice) return;

		const startTimestamp = +relevantSlice.pitch[0].timestamp;
		const endTimestamp =
			+relevantSlice.pitch[relevantSlice.pitch.length - 1].timestamp;

		const audioEl = audioEls.find((d) => d.id === `${id}-audio`);
		if (!audioEl) return;

		audioEl.currentTime = startTimestamp;
		audioEl.play();

		const handleTimeUpdate = () => {
			if (audioEl.currentTime >= endTimestamp) {
				audioEl.pause();
				audioEl.currentTime = startTimestamp;
				audioEl.removeEventListener("timeupdate", handleTimeUpdate);
			}
		};
		audioEl.addEventListener("timeupdate", handleTimeUpdate);
	};

	$: hide = soloed ? data.map((d) => d.id).filter((d) => d !== soloed) : [];
</script>

<div class="ids">
	{#each data as { id }, i}
		<div>
			<button
				id={`${id}-solo-btn`}
				class:soloed={soloed === id}
				on:click={solo}
			>
				s
			</button>
			<button id={`${id}-play-btn`} disabled={id !== soloed} on:click={play}>
				play
			</button>
			<button
				id={`${id}-flag`}
				disabled={flagged.find((d) => d.id === id) &&
					flagged.find((d) => d.id === id).phrase === lyrics}
				on:click={flag}>🚩</button
			>

			<span style:border-bottom={`5px solid ${zScale(id)}`}>{id}</span>

			<audio
				bind:this={audioEls[i]}
				id={`${id}-audio`}
				src={`assets/vocals/${id}.mp3`}
			/>
		</div>
	{/each}
</div>

<style>
	.ids {
		font-size: 0.8rem;
		margin-left: 1rem;
	}
	button {
		font-size: 0.8rem;
		background: none;
		border: 1px solid grey;
		padding: 4px;
	}
	button.soloed {
		background: gold;
	}
	button:hover {
		background: lightgrey;
	}
</style>
