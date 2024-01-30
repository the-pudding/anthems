<script>
	import copy from "$data/copy.json";
</script>

<section id="title">
	<div>{copy.title.pre}</div>
	<h1>{copy.title.main}</h1>
	<div>{copy.title.post}</div>
</section>

<style>
	section {
		height: 100vh;
	}
	h1 {
		font-family: "Newsagent";
		font-size: 8rem;
	}
	div {
		max-width: 400px;
	}
</style>
