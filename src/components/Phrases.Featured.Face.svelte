<script>
	import anthonySvg from "$svg/silhouettes/anthony-hamilton.svg";
	import tpainSvg from "$svg/silhouettes/tpain.svg";
	import fergieSvg from "$svg/silhouettes/fergie.svg";
	import jazmineSvg from "$svg/silhouettes/jazmine-sullivan.svg";
	import { onMount } from "svelte";
	import _ from "lodash";

	export let id;
	export let onClick;
	export let highlight;
	export let phraseI;

	let mounted = false;

	const faceSvgs = {
		"anthony-hamilton": anthonySvg,
		tpain: tpainSvg,
		fergie: fergieSvg,
		"jazmine-sullivan": jazmineSvg
	};

	const updateStroke = () => {
		if (!mounted) return;

		const svg = document.getElementById(`${name}_face_phrase${phraseI}`);
		if (!svg) return;

		const path = svg.querySelector("path");
		if (!path) return;

		path.style.stroke = highlight === id ? "red" : "white";
		path.style.strokeWidth = highlight === id ? "30px" : "15px";
	};

	$: name = id.split("_")[0];
	$: highlight, updateStroke();

	onMount(() => {
		mounted = true;
		updateStroke();
	});
</script>

<button class="pic" on:click={() => onClick(id)}>
	<div class="svg-wrapper" id={`${name}_face_phrase${phraseI}`}>
		{@html faceSvgs[name]}
	</div>

	<img
		alt={`headshot of ${_.startCase(name)}`}
		class:highlight={id === highlight}
		src={`assets/cutouts/${name}.png`}
	/>
	<!-- <span class="crown" class:visible={id === highlight}>👑</span> -->
</button>

<style>
	img {
		position: relative;
		z-index: 2;
	}
	img:not(.highlight):hover {
		opacity: 0.5;
		cursor: pointer;
	}
	.pic {
		position: relative;
		background: none;
		padding: 0;
		pointer-events: auto;
	}
	.crown {
		position: absolute;
		top: -8%;
		left: 15%;
		transform: rotate(-20deg);
		font-size: 2.5rem;
		visibility: hidden;
		z-index: 3;
	}
	.crown.visible {
		visibility: visible;
	}
	.svg-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	@media (max-width: 1000px) {
		img {
			height: 100%;
			width: auto;
		}
	}
</style>
