<script>
	import copy from "$data/copy.json";
	import _ from "lodash";

	const featuredIds = _.uniq(
		_.flatten(
			copy.phrases.map((d) => {
				const top = d.topDivas
					? d.topDivas.split(",").map((id) => id.trim())
					: [];
				const picks = d.ourPicks ? d.ourPicks.map((id) => id.id) : [];
				return [...top, ...picks];
			})
		)
	);
</script>

{#each featuredIds as id}
	<audio src={`assets/vocals/${id}.mp3`} id={`${id}-audio`} />
{/each}
