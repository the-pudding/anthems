<script>
	import Icon from "$components/helpers/Icon.svelte";
	import Select from "$components/helpers/Select.svelte";
	import ids from "$data/ids.csv";
	import _ from "lodash";
	import getPerformerData from "$utils/getPerformerData.js";

	export let sortedFilteredIds;

	let sort = "alpha";
	let sortDir = "asc";
	let event = "all";
	let performer = "all";
	let genre = "all";

	const sortOptions = [
		{ label: "Name", value: "alpha", fn: (d) => d.id, dir: "asc" },
		{
			label: "Year",
			value: "year",
			fn: (d) => getPerformerData(d.id).year,
			dir: "asc"
		},
		{
			label: "Diva Score",
			value: "divaScore",
			fn: (d) => getPerformerData(d.id).divaScore,
			dir: "desc"
		},
		{
			label: "Key",
			value: "key",
			fn: (d) => getPerformerData(d.id).stepsFromC,
			dir: "desc"
		}
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
	const genreOptions = _.uniqBy(
		ids
			.filter((d) => d.id !== "standard")
			.map((d) => ({
				label: getPerformerData(d.id).genre,
				value: _.kebabCase(getPerformerData(d.id).genre)
			})),
		(d) => d.value
	);

	const applyFilters = () => {
		sortedFilteredIds = ids
			.filter((d) => d.id !== "standard")
			.filter((d) => {
				const data = getPerformerData(d.id);
				const eventMatch = event === "all" || _.kebabCase(data.event) === event;
				const performerMatch =
					performer === "all" || _.kebabCase(data.performer) === performer;
				const genreMatch = genre === "all" || _.kebabCase(data.genre) === genre;
				return eventMatch && performerMatch && genreMatch;
			});
		sortedFilteredIds = _.orderBy(
			sortedFilteredIds,
			sortOptions.find((d) => d.value === sort).fn,
			sortDir
		);
	};
	const setDefaultDir = () => {
		const dir = sortOptions.find((d) => d.value === sort).dir;
		if (sortDir !== dir) sortDir = dir;
	};

	const clear = () => {
		sort = "alpha";
		event = "all";
		performer = "all";
		genre = "all";
	};
	const order = () => {
		if (sortDir === "asc") sortDir = "desc";
		else sortDir = "asc";
	};

	$: sort, sortDir, event, performer, genre, applyFilters();
	$: sort, setDefaultDir();
</script>

<div class="filters">
	<button on:click={clear}>Clear</button>

	<span>
		<button class="order" on:click={order}>
			{#key sortDir}
				<Icon
					name={`arrow-${sortDir === "asc" ? "up" : "down"}`}
					size="1.5rem"
					stroke="white"
				/>
			{/key}
		</button>
		<Select label={"Sort by"} options={sortOptions} bind:value={sort} />
	</span>

	<span>
		<Select
			label={"Filter by event"}
			options={eventOptions}
			bind:value={event}
		/>
	</span>

	<span>
		<Select
			label={"Filter by performer"}
			options={performerOptions}
			bind:value={performer}
		/>
	</span>

	<span>
		<Select
			label={"Filter by genre"}
			options={genreOptions}
			bind:value={genre}
		/>
	</span>
</div>

<style>
	.filters {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		background: var(--color-bg);
	}
	button {
		background: none;
		color: var(--color-fg);
	}
	button.order {
		width: 3rem;
	}
	span {
		display: flex;
		align-items: end;
		margin: 0 1rem;
		font-family: var(--sans);
	}
</style>
