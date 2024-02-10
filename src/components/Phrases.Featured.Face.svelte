<script>
	import getPerformerData from "$utils/getPerformerData.js";
	import aliciaSvg from "$svg/silhouettes/silhouettes_alicia-keys.svg";
	import anthonySvg from "$svg/silhouettes/silhouettes_anthony-hamilton.svg";
	import arethaSvg from "$svg/silhouettes/silhouettes_aretha-franklin.svg";
	import beyonceSvg from "$svg/silhouettes/silhouettes_beyonce.svg";
	import billySvg from "$svg/silhouettes/silhouettes_billy-joel.svg";
	import carrieSvg from "$svg/silhouettes/silhouettes_carrie-underwood.svg";
	import chakaSvg from "$svg/silhouettes/silhouettes_chaka-khan.svg";
	import cherSvg from "$svg/silhouettes/silhouettes_cher.svg";
	import chrisSvg from "$svg/silhouettes/silhouettes_chris-stapleton.svg";
	import xtinaSvg from "$svg/silhouettes/silhouettes_christina-agu.svg";
	import demiSvg from "$svg/silhouettes/silhouettes_demi-lovato.svg";
	import ericSvg from "$svg/silhouettes/silhouettes_eric-burton.svg";
	import fantasiaSvg from "$svg/silhouettes/silhouettes_fantasia.svg";
	import fergieSvg from "$svg/silhouettes/silhouettes_fergie.svg";
	import gladysSvg from "$svg/silhouettes/silhouettes_gladys-knight.svg";
	import herSvg from "$svg/silhouettes/silhouettes_her.svg";
	import hunterSvg from "$svg/silhouettes/silhouettes_hunter-hayes.svg";
	import jazmineSvg from "$svg/silhouettes/silhouettes_jazmine-sullivan.svg";
	import jHudSvg from "$svg/silhouettes/silhouettes_jennifer-hudson.svg";
	import jewelSvg from "$svg/silhouettes/silhouettes_jewel.svg";
	import johnLegendSvg from "$svg/silhouettes/silhouettes_john-legend.svg";
	import johnOatesSvg from "$svg/silhouettes/silhouettes_john-oates.svg";
	import jordinSvg from "$svg/silhouettes/silhouettes_jordin-sparks.svg";
	import juanitaSvg from "$svg/silhouettes/silhouettes_juanita-booker.svg";
	import kellySvg from "$svg/silhouettes/silhouettes_kelly-clarkson.svg";
	import kelseySvg from "$svg/silhouettes/silhouettes_kelsey-grammer.svg";
	import kristenSvg from "$svg/silhouettes/silhouettes_kristen-chenoweth.svg";
	import gagaSvg from "$svg/silhouettes/silhouettes_lady-gaga.svg";
	import laurenSvg from "$svg/silhouettes/silhouettes_lauren-alaina.svg";
	import lukeSvg from "$svg/silhouettes/silhouettes_luke-bryan.svg";
	import mariahSvg from "$svg/silhouettes/silhouettes_mariah-carey.svg";
	import marvinSvg from "$svg/silhouettes/silhouettes_marvin-gaye.svg";
	import maryJSvg from "$svg/silhouettes/silhouettes_mary-j-blige.svg";
	import nicoleSvg from "$svg/silhouettes/silhouettes_nicole-scherzinger.svg";
	import pattiSvg from "$svg/silhouettes/silhouettes_patti-labelle.svg";
	import peaboSvg from "$svg/silhouettes/silhouettes_peabo-bryson.svg";
	import reneeSvg from "$svg/silhouettes/silhouettes_renee-fleming.svg";
	import scottySvg from "$svg/silhouettes/silhouettes_scotty-mccreery.svg";
	import stevenSvg from "$svg/silhouettes/silhouettes_steven-tyler.svg";
	import taylorSvg from "$svg/silhouettes/silhouettes_taylor-swift.svg";
	import tpainSvg from "$svg/silhouettes/silhouettes_t-pain.svg";
	import traceSvg from "$svg/silhouettes/silhouettes_trace-adkins.svg";
	import usherSvg from "$svg/silhouettes/silhouettes_usher.svg";
	import whitneySvg from "$svg/silhouettes/silhouettes_whitney-houston.svg";
	import { onMount } from "svelte";
	import { playing } from "$stores/misc.js";
	import _ from "lodash";

	export let id;
	export let highlight;
	export let phraseI;
	export let clickable = true;

	let mounted = false;
	const { performer } = getPerformerData(id);

	const faceSvgs = {
		"alicia-keys": aliciaSvg,
		"anthony-hamilton": anthonySvg,
		"aretha-franklin": arethaSvg,
		beyonce: beyonceSvg,
		"billy-joel": billySvg,
		"carrie-underwood": carrieSvg,
		"chaka-khan": chakaSvg,
		cher: cherSvg,
		"chris-stapleton": chrisSvg,
		"christina-aguilera": xtinaSvg,
		"demi-lovato": demiSvg,
		"eric-burton": ericSvg,
		"gladys-knight": gladysSvg,
		her: herSvg,
		fantasia: fantasiaSvg,
		fergie: fergieSvg,
		"hunter-hayes": hunterSvg,
		"jazmine-sullivan": jazmineSvg,
		"jennifer-hudson": jHudSvg,
		jewel: jewelSvg,
		"john-legend": johnLegendSvg,
		"john-oates": johnOatesSvg,
		"jordin-sparks": jordinSvg,
		"juanita-booker": juanitaSvg,
		"kelly-clarkson": kellySvg,
		"kelsey-grammer": kelseySvg,
		"kristen-chenoweth": kristenSvg,
		"lady-gaga": gagaSvg,
		"lauren-alaina": laurenSvg,
		"luke-bryan": lukeSvg,
		"mariah-carey": mariahSvg,
		"marvin-gaye": marvinSvg,
		"mary-j-blige": maryJSvg,
		"nicole-scherzinger": nicoleSvg,
		"patti-labelle": pattiSvg,
		"peabo-bryson": peaboSvg,
		"renee-fleming": reneeSvg,
		"scotty-mccreery": scottySvg,
		"steven-tyler": stevenSvg,
		"taylor-swift": taylorSvg,
		tpain: tpainSvg,
		"trace-adkins": traceSvg,
		usher: usherSvg,
		"whitney-houston": whitneySvg
	};
	const extraMarginsList = [
		"Anthony Hamilton",
		"Hunter Hayes",
		"Fantasia",
		"Luke Bryan",
		"John Legend",
		"Scotty Mccreery",
		"Aretha Franklin",
		"Usher",
		"Marvin Gaye",
		"John Oates",
		"Christina Aguilera",
		"Kelsey Grammer",
		"Trace Adkins",
		"Taylor Swift",
		"Demi Lovato",
		"Carrie Underwood",
		"Peabo Bryson",
		"Lady Gaga",
		"Mary J. Blige",
		"Billy Joel"
	];
	const longHair = ["kelly-clarkson", "carrie-underwood", "jordin-sparks"];

	const onClick = () => {
		if (!clickable) return;
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

	function setMargins(performer) {
		let bottomMargin = extraMarginsList.includes(performer) ? -0.75 : 0;
		return bottomMargin;
	}

	onMount(() => {
		mounted = true;
		updateStroke();
	});
</script>

<button
	class="pic"
	class:long-hair={longHair.some((d) => id.startsWith(d))}
	on:click={onClick}
>
	<div class="pic-wrapper" style="margin-bottom:{setMargins(performer)}rem">
		<div class={`svg-wrapper phrase${phraseI}`} id={`${id}_face`}>
			{@html faceSvgs[name]}
		</div>

		<img
			alt={`headshot of ${_.startCase(name)}`}
			class:highlight={id === highlight}
			class:clickable
			src={`assets/cutouts/${name}.png`}
		/>
	</div>
	<p class:hide={!clickable} class:highlight={id === highlight}>{performer}</p>
</button>

<style>
	img {
		position: relative;
		z-index: 2;
		width: 100%;
	}
	img.clickable:not(.highlight):hover {
		opacity: 0.5;
		cursor: pointer;
	}
	img:not(.clickable):hover {
		cursor: default;
	}
	.pic {
		/* width: 7rem; */
		position: relative;
		background: none;
		padding: 0;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		direction: ltr;
	}
	.pic.long-hair {
		margin-top: 1rem;
	}
	.pic:hover p {
		visibility: visible;
		font-weight: 700;
	}
	.pic-wrapper {
		width: 80%;
		/* width: 6rem; */
		position: relative;
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
	:global(.svg-wrapper svg) {
		width: 100%;
		height: 100%;
	}
	p {
		color: var(--color-grey-blue);
		font-size: var(--14px);
		margin: 0 0.5rem 1rem 0.5rem;
	}
	p.highlight {
		color: var(--color-red);
		font-weight: 700;
	}
	p.hide {
		visibility: hidden;
	}

	@media (max-width: 1000px) {
		img {
			height: 100%;
			width: auto;
		}
		.pic-wrapper {
			width: 70%;
		}
		.pic p {
			max-width: 90px;
		}
	}
</style>
