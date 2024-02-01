<script>
	import { onMount } from "svelte";
	import copy from "$data/copy.json";
	import Icon from "$components/helpers/Icon.svelte";
	import play from "$svg/play.svg";

	onMount(() => {
		const enableAudio = document.getElementById("enable-audio");
	});
</script>

<section id="title">
	<div class="hed">{@html copy.hed}</div>
	<div class="byline">{@html copy.byline}</div>
	<div class="scroll">
		<div>Scroll</div>
		<span class="icon">
			<Icon name="chevron-down" size="4rem" fill="none" />
		</span>
	</div>
</section>

<style>
	section {
		height: calc(100vh - 6rem);
		position: relative;
	}
	:global(h1) {
		font-family: "Newsagent";
		font-size: 12rem;
		line-height: 1;
	}
	.hed {
		font-size: 1.3rem;
		max-width: 500px;
	}
	:global(span#enable-audio) {
		background: var(--color-red);
		color: var(--color-dark-blue);
		padding: 0.25rem;
		margin: 0 0.25rem;
		border-radius: 0.25rem;
		font-family: var(--sans);
		font-weight: bold;
	}
	.byline {
		font-family: var(--sans);
	}
	:global(.byline a) {
		font-weight: bold;
		border-bottom: 2px solid var(--color-red);
	}
	.scroll {
		position: absolute;
		bottom: 3rem;
		text-transform: uppercase;
		font-family: var(--sans);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.icon {
		color: var(--color-grey-blue);
	}
</style>
