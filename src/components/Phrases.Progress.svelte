<script>
	import { currentPhraseI } from "$stores/misc.js";
	import _ from "lodash";

	export let lyrics;
</script>

<div class="progress">
	{#each _.range(16) as phrase}
		{@const active = phrase === $currentPhraseI}
		<div class="circle" class:active>
			{active ? lyrics : ""}
		</div>
	{/each}
</div>

<style>
	.progress {
		height: 6rem;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.circle {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: #7ca4ae;
		margin: 0.75rem;
	}
	.active {
		width: auto;
		height: 2rem;
		border-radius: 1rem;
		padding: 4px 8px;
		background: var(--color-fg);
		font-size: 14px;
		font-family: var(--sans);
		color: #032e47;
		white-space: nowrap;
		width: 5rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
