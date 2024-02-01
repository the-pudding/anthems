<script>
	import Select from "$components/helpers/Select.svelte";
	import ids from "$data/ids.csv";
	import _ from "lodash";
	import getPerformerData from "$utils/getPerformerData.js";

	export let sortedFilteredIds;

	let sort = "alpha";
	let event = "all";
	let performer = "all";
	let genre = "all";

	const sortOptions = [
		{ label: "Alphabetically", value: "alpha" },
		{ label: "Diva Score", value: "divaScore" }
	];
	const eventOptions = _.uniqBy(
		ids
			.filter((d) => d.id !== "standard")
			.map((d) => ({
				label: getPerformerData(d.id).event,
				value: _.kebabCase(getPerformerData(d.id).event)
			})),
		(d) => d.value
	);
</script>

<div class="filters">
	<Select label={"Sort by"} options={sortOptions} bind:value={sort} />
	<Select label={"Filter by event"} options={eventOptions} bind:value={event} />
	<!--<Select label={"Filter by performer"} {options} bind:value />
	<Select label={"Filter by genre"} {options} bind:value /> -->
</div>

<style>
	.filters {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		background: var(--color-bg);
	}
</style>
