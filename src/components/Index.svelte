<script>
	import { csv } from "d3-fetch";
	import Lines from "$components/Lines.svelte";
	import { onMount } from "svelte";
	import ids from "$data/ids.csv";

	let data = [];
	$: displayData = data;

	const loadPitch = async (id) => {
		try {
			const pitch = await csv(`./src/data/pitch-transposed/${id}_pitch.csv`);
			return {
				id,
				pitch: pitch.map((d) => ({
					timestamp: +d.timestamp,
					frequency: +d.frequency
				}))
			};
		} catch (error) {
			console.error(`error loading ${id}: ${error}`);
			return null;
		}
	};

	$: console.log(displayData);

	onMount(async () => {
		// for (const performance of ids) {
		// 	data[performance.id] = await loadPitch(performance.id);
		// }
		const promises = ids.map((performance) => loadPitch(performance.id));
		const results = await Promise.all(promises);
		console.log({ results });
		results.forEach((result) => {
			if (result) data = [...data, result];
		});
	});
</script>

{#if displayData.length}
	<Lines data={displayData} />
{/if}
