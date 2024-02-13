<script>
	import logo from "$svg/logo.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			>{@html logo}</a
		>
	</div>
</header>

<style>
	header {
		position: absolute;
		top: 2rem;
		right: 2rem;
		width: 3rem;
		z-index: 100;
	}
	.wordmark {
		max-width: 3rem;
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.wordmark a:hover {
		background-color: transparent;
	}

	:global(.wordmark svg path) {
		fill: var(--color-grey-blue);
	}
</style>
