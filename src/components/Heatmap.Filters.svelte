<script>
	import Select from "$components/helpers/Select.svelte";
	import ids from "$data/ids.csv";
	import _ from "lodash";
	import getPerformerData from "$utils/getPerformerData.js";

	export let sortedFilteredIds;

	//const sortAndFilter = { sort, filter: { event, performer, genre } };
	let sort = "alpha";
	let event = "all";
	let performer = "all";
	let genre = "all";

	const sortOptions = [
		{ label: "Alphabetically", value: "alpha" },
		{ label: "Year", value: "year" },
		{ label: "Diva Score", value: "divaScore" },
		{ label: "Key", value: "key" }
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
	const performerOptions = _.uniqBy(
		ids
			.filter((d) => d.id !== "standard")
			.map((d) => ({
				label: getPerformerData(d.id).performer,
				value: _.kebabCase(getPerformerData(d.id).performer)
			})),
		(d) => d.value
	);
	const genreOptions = _.uniq(
		ids.filter((d) => d.id !== "standard").map((d) => d.artistGenre)
	).map((d) => ({
		label: d === "rnb" ? "R&B" : _.startCase(d),
		value: d
	}));

	const applyFilters = () => {
		sortedFilteredIds = ids
			.filter((d) => d.id !== "standard")
			.filter((d) => {
				const data = getPerformerData(d.id);
				console.log({ data });
				const eventMatch = event === "all" || data.event === event;
				const performerMatch =
					performer === "all" || data.performer === performer;
				const genreMatch = genre === "all" || data.genre === genre;
				return eventMatch && performerMatch && genreMatch;
			});
	};
	const clear = () => {
		sort = "alpha";
		event = "all";
		performer = "all";
		genre = "all";
	};
	$: sort, event, performer, genre, applyFilters();
	$: console.log({ sortedFilteredIds });
</script>

<div class="filters">
	<button on:click={clear}>Clear</button>
	<Select label={"Sort by"} options={sortOptions} bind:value={sort} />
	<Select label={"Filter by event"} options={eventOptions} bind:value={event} />
	<Select
		label={"Filter by performer"}
		options={performerOptions}
		bind:value={performer}
	/>
	<Select label={"Filter by genre"} options={genreOptions} bind:value={genre} />
</div>

<style>
	.filters {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		background: var(--color-bg);
	}
</style>
