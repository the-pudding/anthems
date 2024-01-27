<script>
	import copy from "$data/copy.json";
	import _ from "lodash";

	const allFeaturedIds = _.uniq(
		_.flatten(
			copy.phrases
				.filter((d) => d.featured)
				.map((d) => d.featured.map((f) => f.id))
		)
	);
</script>

{#each allFeaturedIds as id}
	<audio src={`assets/vocals/${id}.mp3`} id={`${id}-audio`} />
{/each}
