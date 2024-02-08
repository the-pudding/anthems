<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
	import { getContext, onMount, tick } from "svelte";
	import { line, curveCardinal } from "d3-shape";
	import viewport from "$stores/viewport.js";
	import {
		currentPhraseI,
		currentStepI,
		playing,
		loaded
	} from "$stores/misc.js";

	const { data, xGet, yGet, xScale } = getContext("LayerCake");

	export let highlight;
	export let isolate;
	export let phraseI;
	export let featuredIds = [];
	export let intro;
	export let hideAll;

	let segmentLengths = featuredIds.reduce((obj, key) => {
		obj[key] = [];
		return obj;
	}, {});

	const generatePath = (values) => {
		const lineGenerator = line()
			.defined((d) => d.frequency > 0)
			.x((d) => $xGet(d))
			.y((d) => $yGet(d))
			.curve(curveCardinal);
		return lineGenerator(values);
	};
	const segments = (values, id) => {
		let segments = [];
		let currentSegment = [];
		values.forEach((d) => {
			if (d.frequency > 0) {
				currentSegment.push(d);
			} else if (currentSegment.length) {
				segments.push({ data: currentSegment });
				currentSegment = [];
			}
		});
		if (currentSegment.length) {
			segments.push({ data: currentSegment });
		}

		const whitneySegments = 4;

		segments = segments.map(({ data }, i) => {
			let duration;
			let delay;
			if (intro) {
				const startTs =
					+segments[segments.length - whitneySegments].data[0].timestamp;
				duration =
					i < segments.length - whitneySegments
						? 0
						: data[data.length - 1].timestamp - data[0].timestamp;
				delay =
					i < segments.length - whitneySegments
						? 0
						: data[0].timestamp - startTs;
			} else {
				duration = data[data.length - 1].timestamp - data[0].timestamp;
				delay = data[0].timestamp;
			}
			return {
				data,
				duration,
				delay
			};
		});
		return segments;
	};
	const calculateSegmentLengths = () => {
		featuredIds.forEach((id) => {
			const segments = Array.from(
				document.querySelectorAll(
					`#${id}_line_phrase${intro ? "_intro" : phraseI} .animated`
				)
			);
			const lengths = segments.map((el) => el.getTotalLength());
			segmentLengths[id] = lengths;
		});
	};

	$: if (!intro && $currentPhraseI === 0 && $currentStepI > 0)
		calculateSegmentLengths();
	$: if (intro && $loaded) calculateSegmentLengths();
	$: $viewport.width, $currentPhraseI, calculateSegmentLengths();
</script>

{#key $xScale.range()}
	<g class="line-group">
		{#each $data as group}
			{@const fade = highlight && group.id !== highlight}
			{@const highlighted = highlight && group.id === highlight}
			{@const isolated = intro && isolate && group.id === isolate}
			{@const hide = hideAll ? true : isolate && group.id !== isolate}
			<g id={`${group.id}_line_phrase${intro ? "_intro" : phraseI}`}>
				<path
					class:highlighted
					class:fade
					class:isolated
					class:hide
					d={generatePath(group.pitch)}
				/>

				{#if featuredIds.includes(group.id)}
					<g class="segments">
						{#each segments(group.pitch, group.id).slice(0, 5) as { data, duration, delay }, segmentI}
							{@const visible =
								highlighted ||
								(isolated && $playing && $playing.id === group.id)}
							<path
								class="animated"
								class:visible
								d={generatePath(data)}
								style:stroke-dasharray={`${
									segmentLengths[group.id][segmentI]
								}px`}
								style:stroke-dashoffset={visible
									? "0"
									: `${segmentLengths[group.id][segmentI]}px`}
								style={`--duration: ${duration}s; --delay: ${delay}s;`}
							/>
						{/each}
					</g>
				{/if}
			</g>
		{/each}
	</g>
{/key}

<style>
	path {
		fill: none;
		stroke: var(--color-fg);
		opacity: 0.05;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2px;
		transition: opacity 0.5s ease-in-out;
	}
	path.fade {
		opacity: 0.025;
	}
	path.hide {
		opacity: 0;
	}
	path.isolated {
		opacity: 1;
		stroke: var(--color-fg);
	}
	path.highlighted {
		opacity: 1;
	}
	path.animated {
		stroke: var(--color-red);
		stroke-width: 3px;
		opacity: 0;
		transition: stroke-dashoffset var(--duration) linear var(--delay);
	}
	path.animated.visible {
		opacity: 1;
	}
</style>
