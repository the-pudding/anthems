<script>
	import { onMount } from "svelte";
	import { scaleLinear } from "d3-scale";
	import { saveAs } from "file-saver";
	import ids from "$data/ids.csv";
	import phraseApproximations from "$data/phrase_approximations.json";

	let i = 0;
	let audioEl;
	let duration;
	let svgWidth;
	let padding = 50;
	let svgHeight = 200;
	let colorIndex = 0;
	let currentTime;
	let selectedPhrase;
	let currentPhrases = [];
	let allPhrasesFixed = phraseApproximations;

	const colors = [
		"#e6194B",
		"#3cb44b",
		"#ffe119",
		"#4363d8",
		"#f58231",
		"#9A6324",
		"#aaffc3",
		"#911eb4",
		"#46f0f0",
		"#f032e6",
		"#bcf60c",
		"#fabebe",
		"#008080",
		"#e6beff",
		"#808000",
		"#800000"
	];
	const getColor = () => {
		const color = colors[colorIndex % colors.length];
		colorIndex++;
		return color;
	};
	const advanceId = (amount) => {
		i += amount;
		selectedPhrase = undefined;
	};
	const onClick = (e) => {
		if (selectedPhrase === +e.target.id.replace("phrase-", "")) {
			selectedPhrase = undefined;
		} else {
			selectedPhrase = +e.target.id.replace("phrase-", "");
			currentTime = currentPhrases[selectedPhrase].start;

			audioEl.play();

			const endWithPhrase = () => {
				if (audioEl.currentTime >= currentPhrases[selectedPhrase].end) {
					audioEl.pause();
					audioEl.removeEventListener("timeupdate", endWithPhrase);
				}
			};
			audioEl.addEventListener("timeupdate", endWithPhrase);
		}
	};
	const adjust = (amount, type) => {
		const newPhrases = currentPhrases;
		newPhrases[selectedPhrase][type] += amount;

		allPhrasesFixed = [
			...allPhrasesFixed.filter((d) => d.id !== currentId),
			{ id: currentId, phrases: newPhrases }
		];
	};
	const output = () => {
		const output = JSON.stringify(currentPhrases, null, 2);
		const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
		saveAs(blob, `${currentId}_fixed_phrases.json`);
	};

	$: xScale =
		audioEl && duration && svgWidth
			? scaleLinear([0, duration], [0, svgWidth])
			: null;
	$: currentId = ids[i].id;
	$: currentPhrases = allPhrasesFixed.find((d) => d.id === currentId).phrases;

	onMount(() => {
		svgWidth = window.innerWidth - padding;
		window.addEventListener("resize", () => {
			svgWidth = window.innerWidth - padding;
		});
	});
</script>

<div class="container">
	<div class="ids">
		<button disabled={i === 0} on:click={() => advanceId(-1)}>prev</button>
		<h3>{currentId}</h3>
		<button disabled={i === ids.length - 1} on:click={() => advanceId(1)}
			>next</button
		>
	</div>
	<div>{i + 1} / {ids.length}</div>

	<audio
		bind:this={audioEl}
		bind:currentTime
		bind:duration
		src={`assets/vocals/${currentId}.mp3`}
		controls={true}
	/>
	<p>{currentTime || 0}s</p>

	<div class="buttons" class:visible={selectedPhrase !== undefined}>
		<button on:click={() => adjust(-0.1, "start")}>-</button>
		<span>start</span>
		<button on:click={() => adjust(0.1, "start")}>+</button>
		<button on:click={() => adjust(-0.1, "end")}>-</button>
		<span>end</span>
		<button on:click={() => adjust(0.1, "end")}>+</button>
	</div>

	{#if xScale}
		<svg width={svgWidth} height={svgHeight}>
			<line
				x1="0"
				y1={svgHeight / 2}
				x2={svgWidth}
				y2={svgHeight / 2}
				stroke="black"
			/>

			{#each currentPhrases as phrase, i}
				{@const rectHeight = 20}
				<rect
					id={`phrase-${i}`}
					class:selected={selectedPhrase === i}
					class:faded={selectedPhrase !== undefined && selectedPhrase !== i}
					x={xScale(phrase.start)}
					y={svgHeight / 2 - rectHeight / 2}
					width={xScale(phrase.end) - xScale(phrase.start)}
					height={rectHeight}
					fill={getColor()}
					on:click={onClick}
				/>
			{/each}

			<line
				x1={xScale(currentTime || 0)}
				x2={xScale(currentTime || 0)}
				y1={svgHeight}
				y2={0}
				stroke="black"
				stroke-width={2}
			/>
		</svg>
	{/if}

	<button style:margin-top={"2rem"} on:click={output}
		>download new phrasings for {currentId}</button
	>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	svg {
		background: var(--color-gray-50);
	}
	rect:hover {
		cursor: pointer;
	}
	rect.selected {
		opacity: 1;
	}
	rect.faded {
		opacity: 0.2;
	}
	.buttons {
		visibility: hidden;
	}
	.buttons.visible {
		visibility: visible;
	}
	.ids {
		display: flex;
		align-items: center;
	}
	button {
		margin: 0 8px;
	}
</style>
