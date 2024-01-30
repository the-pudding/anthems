<script>
	import copy from "$data/copy.json";
	import _ from "lodash";
	import ids from "$data/ids.csv";

	// TODO: restore

	// const allFeaturedIds = _.uniq(
	// 	_.flatten(
	// 		copy.slides
	// 			.filter((d) => d.featured)
	// 			.map((d) => d.featured.map((f) => f.id))
	// 	)
	// );

	const allIds = ids.map((d) => d.id);
</script>

{#each allIds as id}
	<audio src={`assets/vocals/${id}.mp3`} id={`${id}-audio`} />
{/each}
