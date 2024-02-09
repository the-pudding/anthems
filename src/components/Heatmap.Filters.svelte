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
	const eventOptions = [
		..._.uniqBy(
			ids
				.filter((d) => d.id !== "standard")
				.map((d) => ({
					label: getPerformerData(d.id).event,
					value: _.kebabCase(getPerformerData(d.id).event)
				})),
			(d) => d.value
		),
		{ label: "All events", value: "all" }
	];
	const performerOptions = [
		..._.uniqBy(
			ids
				.filter((d) => d.id !== "standard")
				.map((d) => ({
					label: getPerformerData(d.id).performer,
					value: _.kebabCase(getPerformerData(d.id).performer)
				})),
			(d) => d.value
		),
		{ label: "All artists", value: "all" }
	];
	const genreOptions = [
		..._.uniqBy(
			ids
				.filter((d) => d.id !== "standard")
				.map((d) => ({
					label: getPerformerData(d.id).genre,
					value: _.kebabCase(getPerformerData(d.id).genre)
				})),
			(d) => d.value
		),
		{ label: "All genres", value: "all" }
	];

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
	<div class="sort-by">
		<h3>Sort by</h3>
		<div class="dropdowns">
			<span>
				<Select options={sortOptions} bind:value={sort} />
				<button class="order" on:click={order}>
					{#key sortDir}
						<Icon
							name={`arrow-${sortDir === "asc" ? "up" : "down"}`}
							size="1.5rem"
							stroke="white"
						/>
					{/key}
				</button>
			</span>
			<button class="clear" on:click={clear}>Clear<Icon
				name={"x"}
				size="1.5rem"
				stroke="white"
			/></button>
		</div>
	</div>

	<div class="filter-by">
		<h3>Filter by</h3>
		<div class="dropdowns">
			<span>
				<Select options={eventOptions} bind:value={event} />
			</span>

			<span>
				<Select options={performerOptions} bind:value={performer} />
			</span>

			<span>
				<Select options={genreOptions} bind:value={genre} />
			</span>
		</div>
	</div>
</div>

<style>
	.filters {
		display: flex;
		justify-content: space-between;
		align-items: start;
		padding: 1rem 6rem 0.5rem 1rem;
		background: var(--color-extra-dark-blue);
	}
	button {
		background: none;
		color: var(--color-fg);
	}
	button.order {
		width: 3rem;
		padding: 0;
	}
	button.clear {
		padding: 0.5rem;
		border: 1px solid var(--color-fg);
		display: flex;
		align-items: center;
		transition: all 250ms;
		margin: 0 0 0 0.5rem;
	}
	:global(button.clear span) {
		margin: 0 0 0 0.25rem;
		padding: 0;
	}
	button.clear:hover {
		color: var(--color-bg);
		border: 1px solid var(--color-red);
		background: var(--color-red);
		transform: translateY(-2px);
	}
	span {
		display: flex;
		align-items: center;
		font-family: var(--sans);
	}
	h3 {
		text-transform: uppercase;
		font-size: 1rem;
		font-family: var(--sans);
		color: var(--color-grey-blue);
		font-weight: bold;
		margin: 0;
	}
	.sort-by,
	.filter-by {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 1rem;
	}
	.sort-by {
		width: 70%;
	}
	.sort-by .dropdowns {
		justify-content: start;
	}
	.dropdowns {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.filter-by span {
		display: inline-block;
		flex: 1;
	}

	@media (max-width: 800px) {
		.filters {
			flex-direction: column;
			padding: 0.5rem;
			border-bottom: 1px solid var(--color-fg);
		}
		.sort-by .dropdowns {
			justify-content: space-between;
		}
		span {
			align-items: end;
		}
	}
</style>
