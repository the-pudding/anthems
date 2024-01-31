<script>
	import anthonySvg from "$svg/silhouettes/anthony-hamilton.svg";
	import arethaSvg from "$svg/silhouettes/aretha-franklin.svg";
	import beyonceSvg from "$svg/silhouettes/beyonce.svg";
	import carrieSvg from "$svg/silhouettes/carrie-underwood.svg";
	import chakaSvg from "$svg/silhouettes/chaka-khan.svg";
	import xtinaSvg from "$svg/silhouettes/christina-agu.svg";
	import demiSvg from "$svg/silhouettes/demi-lovato.svg";
	import fergieSvg from "$svg/silhouettes/fergie.svg";
	import jazmineSvg from "$svg/silhouettes/jazmine-sullivan.svg";
	import jordinSvg from "$svg/silhouettes/jordin-sparks.svg";
	import kellySvg from "$svg/silhouettes/kelly-clarkson.svg";
	import gagaSvg from "$svg/silhouettes/lady-gaga.svg";
	import mariahSvg from "$svg/silhouettes/mariah-carey.svg";
	import marvinSvg from "$svg/silhouettes/marvin-gaye.svg";
	import scottySvg from "$svg/silhouettes/scotty-mccreery.svg";
	import stevenSvg from "$svg/silhouettes/steven-tyler.svg";
	import taylorSvg from "$svg/silhouettes/taylor-swift.svg";
	import tpainSvg from "$svg/silhouettes/tpain.svg";
	import whitneySvg from "$svg/silhouettes/whitney-houston.svg";
	import { onMount } from "svelte";
	import { playing } from "$stores/misc.js";
	import _ from "lodash";

	export let id;
	export let highlight;
	export let phraseI;

	let mounted = false;

	const faceSvgs = {
		"anthony-hamilton": anthonySvg,
		"aretha-franklin": arethaSvg,
		beyonce: beyonceSvg,
		"carrie-underwood": carrieSvg,
		"chaka-khan": chakaSvg,
		"christina-aguilera": xtinaSvg,
		"demi-lovato": demiSvg,
		fergie: fergieSvg,
		"jazmine-sullivan": jazmineSvg,
		"jordin-sparks": jordinSvg,
		"kelly-clarkson": kellySvg,
		"lady-gaga": gagaSvg,
		"mariah-carey": mariahSvg,
		"marvin-gaye": marvinSvg,
		"scotty-mccreery": scottySvg,
		"steven-tyler": stevenSvg,
		"taylor-swift": taylorSvg,
		tpain: tpainSvg,
		"whitney-houston": whitneySvg
	};

	const onClick = () => {
		if (highlight === id) {
			highlight = undefined;
			$playing = undefined;
		} else {
			highlight = id;
			$playing = { id, phraseI };
		}
	};
	const updateStroke = () => {
		if (!mounted) return;

		const svgs = Array.from(
			document.querySelectorAll(`.svg-wrapper.phrase${phraseI}`)
		);
		svgs.forEach((svg) => {
			const id = svg.id.replace("_face", "");
			const path = svg.querySelector("path");
			path.style.stroke =
				highlight === id ? "var(--color-red)" : "var(--color-fg)";
			path.style.strokeWidth = highlight === id ? "30px" : "15px";
		});
	};

	$: name = id.split("_")[0];
	$: highlight, updateStroke();

	onMount(() => {
		mounted = true;
		updateStroke();
	});
</script>

<!-- <button class="pic" on:click={onClick}>
	<div class={`svg-wrapper phrase${phraseI}`} id={`${id}_face`}>
		{@html faceSvgs[name]}
	</div>

	<img
		alt={`headshot of ${_.startCase(name)}`}
		class:highlight={id === highlight}
		src={`assets/cutouts/${name}.png`}
	/>
</button> -->
<button on:click={onClick} style="margin: .5rem 0; pointer-events: auto"
	>{name}</button
>

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
