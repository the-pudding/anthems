<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
	import { getContext, onMount, tick } from "svelte";
	import { line, curveCardinal } from "d3-shape";
	import { draw, fade } from "svelte/transition";
	import viewport from "$stores/viewport.js";

	const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");

	export let highlight;
	export let phraseI;
	export let featuredIds;

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
	const segments = (values) => {
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

		segments = segments.map(({ data }) => {
			const duration = data[data.length - 1].timestamp - data[0].timestamp;
			const delay = data[0].timestamp;
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
				document.querySelectorAll(`#${id}_line_phrase${phraseI} .animated`)
			);
			const lengths = segments.map((el) => el.getTotalLength());
			segmentLengths[id] = lengths;
		});
	};

	$: $viewport.width, calculateSegmentLengths();

	onMount(() => {
		calculateSegmentLengths();
	});
</script>

{#key $xScale.range()}
	<g class="line-group">
		{#each $data as group}
			{@const fade = highlight && group.id !== highlight}
			{@const highlighted = highlight && group.id === highlight}
			<g id={`${group.id}_line_phrase${phraseI}`}>
				<path class:fade d={generatePath(group.pitch)} />

				{#if featuredIds.includes(group.id)}
					<g class="segments">
						{#each segments(group.pitch) as { data, duration, delay }, segmentI}
							<path
								class="animated"
								class:visible={highlighted}
								d={generatePath(data)}
								style:stroke-dasharray={`${
									segmentLengths[group.id][segmentI]
								}px`}
								style:stroke-dashoffset={highlighted
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
		opacity: 0.1;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
		transition: opacity 0.5s ease-in-out;
	}
	path.fade {
		opacity: 0.025;
	}
	path.animated {
		stroke: red;
		stroke-width: 6px;
		opacity: 0;
		transition: stroke-dashoffset var(--duration) linear var(--delay);
	}
	path.animated.visible {
		opacity: 1;
	}
</style>
