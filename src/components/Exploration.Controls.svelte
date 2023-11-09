<script>
	import { getContext } from "svelte";
	import Toggle from "$components/helpers/Toggle.svelte";

	const { singers, toggles, timeDomain, normalizeKey, normalizeWords } =
		getContext("exploration");

	const solo = (singer) => {
		const alreadySoloed =
			$toggles.filter((d) => d === "on").length === 1 &&
			$toggles[singers.findIndex((d) => d.singer === singer)] === "on";
		if (alreadySoloed) {
			$toggles = $toggles.map((d) => "on");
		} else {
			$toggles = $toggles.map((d) => "off");
			$toggles[singers.findIndex((d) => d.singer === singer)] = "on";
		}
	};

	let keyToggle = $normalizeKey ? "on" : "off";
	let wordToggle = $normalizeWords ? "on" : "off";
	$: $normalizeKey = keyToggle === "on";
	$: $normalizeWords = wordToggle === "on";
</script>

<div class="controls">
	<div class="names">
		<h3>singers</h3>
		{#each singers as { singer, i, color }}
			{@const faded = $toggles[i] !== "on"}
			{@const soloed =
				$toggles.filter((d) => d === "on").length === 1 && $toggles[i] === "on"}
			<div style="display: flex; align-items: center">
				<div class="name" style={`--color: ${color}`} class:faded>
					{singer}
				</div>
				<Toggle label="" style="inner" bind:value={$toggles[i]} />
				<button on:click={() => solo(singer)}
					>{soloed ? "unsolo" : "solo"}</button
				>

				{#if singer !== "michelle"}<audio
						src={`assets/sound/${singer}.mp3`}
						controls={true}
						class:faded
						style="margin-left: 1rem"
					/>{/if}
			</div>
		{/each}
	</div>

	<div class="time">
		<h3>timespan</h3>
		<input
			placeholder="start"
			on:input={(e) => ($timeDomain[0] = Number(e.target.value))}
		/>
		<input
			placeholder="end"
			on:input={(e) => ($timeDomain[1] = Number(e.target.value))}
		/>
	</div>

	<div class="normalization">
		<h3>normalization</h3>
		<Toggle label="same key" style="inner" bind:value={keyToggle} />
		<Toggle label="align words" style="inner" bind:value={wordToggle} />
	</div>
</div>

<style>
	.name {
		width: fit-content;
		margin: 1rem;
		border-bottom: 6px solid var(--color);
	}
	.faded {
		opacity: 0.2;
	}
	.controls {
		display: flex;
		align-items: start;
		justify-content: space-evenly;
		margin: 2rem;
	}
</style>
