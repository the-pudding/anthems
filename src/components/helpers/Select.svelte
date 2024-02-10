<script>
	export let options = [];
	export let label = "";
	export let disabled = false;
	export let value = options.length ? options[0].value : "";
	export let ariaLabel = "";

	const id = `select-${Math.floor(Math.random() * 1000000)}`;
</script>

<div class="select">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	<select {id} bind:value {disabled} aria-label={ariaLabel}>
		{#each options as option}
			<option value={option.value}>{option.label || option.value}</option>
		{/each}
	</select>
</div>

<style>
	.select {
		position: relative;
	}

	label {
		display: inline-block;
		font-family: inherit;
		font-weight: inherit;
		font-size: 1em;
		margin-bottom: 0.25em;
	}

	select {
		width: 100%;
		height: 50px;
		font-family: inherit;
		font-size: 1em;
		cursor: pointer;
		background: var(--color-fg);
		color: var(--color-gray-900);
		border: 2px solid var(--color-gray-900);
		border-radius: 4px;
		padding: 0.5em;
		appearance: none;
		line-height: 1.4;
	}

	select::-ms-expand {
		display: none;
	}

	.select::after {
		display: block;
		content: "";
		position: absolute;
		bottom: 1.4em;
		right: 0.75em;
		width: 0.75em;
		height: 0.75em;
		z-index: 1;
		background: var(--color-extra-dark-blue);
		clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
		border-radius: 3px;
		transform-origin: center center;
		transform: rotate(-45deg);
		pointer-events: none;
	}

	select:hover {
		background: #fbf3df;
	}

	select:focus {
		box-shadow: 0 0 4px 0 var(--color-focus);
	}

	.select:disabled {
		cursor: not-allowed;
		background-color: var(--color-gray-300);
	}

	@media (max-width: 600px) {
		select {
			height: 2.75rem;
			font-size: var(--14px);
		}
		.select:after {
			width: 0.8em;
			height: 0.8em;
			bottom: 1.1em;
		}
	}
</style>
