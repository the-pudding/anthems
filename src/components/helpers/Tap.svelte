<script>
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";
	import { currentPhraseI, currentSlideI, currentStepI, inIntro, locked } from "$stores/misc.js";
	import { fade, fly } from "svelte/transition";

	export let debug = false;
	export let enableKeyboard = false;
	export let full = false;
	export let showArrows = true; // boolean or array of directions
	export let disable = [];
	export let directions = ["left", "right"];
	export let size = "64px";
	export let arrowSize = "36px";
	export let arrowStroke = "#02273d";
	export let arrowStrokeWidth = "2";
	export let arrowPosition = "center"; // start, center, end

	const dispatch = createEventDispatcher();
	let tapperOverlayVisible = true;

	$: getW = (dir) =>
		["left", "right"].includes(dir) ? size : full ? "100%" : size;
	$: getH = (dir) =>
		["up", "down"].includes(dir) ? size : full ? "100%" : size;

	$: onKeyDown = (e) => {
		const dir = e.key.replace("Arrow", "").toLowerCase();
		const hasDir = directions.includes(dir);
		if (enableKeyboard && hasDir) {
			e.preventDefault();
			dispatch("tap", dir);
		}
	};

	function hideTapperOverlay() {
		haltTap = false;
		tapperOverlayVisible = false;
	}

	$: visibleArrows = directions.filter((d) =>
		typeof showArrows === "boolean" ? showArrows : showArrows.includes(d)
	);
	$: haltTap = $currentPhraseI == 0 && $currentStepI == 0 && tapperOverlayVisible;
</script>

<svelte:window on:keydown={onKeyDown} />

<section class:debug class="tapper">
	{#each directions as dir}
		<button
			on:click={dispatch("tap", dir)}
			class:haltTap={haltTap}
			style="width: {getW(dir)}; height: {getH(dir)};"
			aria-label={dir}
			class="{dir} {arrowPosition}"
			class:full
			disabled={disable.includes(dir)}
		>
		</button>
	{/each}
</section>
{#if $currentPhraseI == 0 && $currentStepI == 0 && tapperOverlayVisible}
	<section class="tapper-overlay" on:click={hideTapperOverlay} transition:fade={{duration: 500}}>
		<div class="left-overlay">
			<div>
				<ChevronLeft color={arrowStroke} strokeWidth={arrowStrokeWidth} />
				<p>Prev</p>
			</div>
		</div>
		<div class="right-overlay">
			<p class="directions">Click right to go forward and left to go back. You can also use the arrow keys on your keyboard.</p>
			<div>
				<ChevronRight color={arrowStroke} strokeWidth={arrowStrokeWidth} />
				<p>Next</p>
			</div>
		</div>
	</section>
{/if}

<style>
	.tapper, .tapper-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
	}
	.tapper-overlay {
		z-index: 999;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: calc(100svh - 1rem);
		width: calc(100% - 1rem);
		margin: 0.5rem 0 0 0.5rem;
		pointer-events: auto;
	}
	.left-overlay, .right-overlay {
		height: 100%;
		background: rgba(124, 164, 174, 0.65);
		outline: 2px solid var(--color-grey-blue);
		position: relative;
		font-family: var(--sans);
		font-weight: 700;
		color: var(--color-extra-dark-blue);
	}
	.left-overlay {
		width: 20%;
		margin-right: 1rem;
	}
	.right-overlay {
		width: 80%;
	}
	.directions {
		position: absolute;
		left: 0;
		top: 45%;
		transform: translate(0%, -50%);
		font-size: var(--24px);
		padding: 0 0 0 3rem;
		width: 50%;
	}
	.left-overlay div, .right-overlay div {
		position: absolute;
		top: 45%;
		padding: 0 0.5rem;
	}
	.left-overlay div {
		left: 0;
	}
	.right-overlay div {
		right: 0;
	}
	.left-overlay div p, .right-overlay div p {
		margin: 0;
		text-transform: uppercase;
		font-size: var(--12px);
	}
	button {
		position: absolute;
		cursor: pointer;
		background: none;
		border-radius: 0;
		outline: none;
		border: none;
		box-shadow: none;
		pointer-events: auto;
	}
	button.haltTap {
		pointer-events: none;
	}
	button:disabled {
		opacity: 0.2;
		cursor: not-allowed;
	}

	button:hover {
		/* background-color: rgba(255, 255, 255, 0.2); */
	}

	.left {
		left: 0;
		top: 0;
		/* text-align: left; */
	}

	.right {
		right: 0;
		top: 0;
		/* text-align: right; */
	}

	.left.start,
	.right.start {
		align-items: flex-start;
	}

	.left.center,
	.right.center {
		top: 50%;
		transform: translateY(-50%);
	}

	.left.end,
	.right.end {
		bottom: 0;
		top: auto;
	}

	.up {
		top: 0;
		left: 0;
		/* text-align: center; */
	}

	.down {
		bottom: 0;
		left: 0;
		/* text-align: center; */
	}

	.up.center,
	.down.center {
		left: 50%;
		transform: translateX(-50%);
	}

	.up.end,
	.down.end {
		right: 0;
		left: auto;
	}

	/* full positions */
	.full.left.start,
	.full.right.start {
		align-items: flex-start;
	}

	.full.left.center,
	.full.right.center {
		align-items: center;
	}

	.full.left.end,
	.full.right.end {
		align-items: flex-end;
	}

	.full.up.start,
	.full.down.start {
		justify-content: flex-start;
	}

	.full.up.center,
	.full.down.center {
		justify-content: center;
	}

	.full.up.end,
	.full.down-end {
		justify-content: flex-end;
	}

	span {
		display: inline-block;
		line-height: 1;
		opacity: 0.5;
	}

	.debug .left {
		background: red;
		opacity: 0.5;
	}

	.debug .right {
		background: red;
		opacity: 0.5;
	}

	.debug .up {
		background: orange;
		opacity: 0.5;
	}

	.debug .down {
		background: orange;
		opacity: 0.5;
	}

	@keyframes pulse-animation {
		0% {
			transform: translate(50%, -50%);
		}
		50% {
			transform: translate(40%, -50%);
		}
		100% {
			transform: translate(50%, -50%);
		}
	}
</style>
