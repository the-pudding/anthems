<script>
	import Chart from "$components/Exploration.Chart.svelte";
	import Controls from "$components/Exploration.Controls.svelte";
	import Words from "$components/Exploration.Words.svelte";
	import _ from "lodash";
	import jazmine from "$data/pitch/jazmine.csv";
	import harry from "$data/pitch/harry.csv";
	import carriePitch from "$data/pitch/carrie.csv";
	import xtina from "$data/pitch/xtina.csv";
	import tpain from "$data/pitch/tpain.csv";
	import snl from "$data/pitch/snl.csv";
	import kelly from "$data/pitch/kelly.csv";
	import demi from "$data/pitch/demi.csv";
	import legend from "$data/pitch/legend.csv";
	import fergie from "$data/pitch/fergie.csv";
	import michellePitch from "$data/pitch/michelle.csv";
	import michelleNotes from "$data/words/michelle.csv";
	import carrieNotes from "$data/words/carrie.csv";
	import { setContext } from "svelte";
	import { writable } from "svelte/store";

	const seriesColors = [
		"#FF6B6B",
		"#4ECDC4",
		"#FFD166",
		"#A463F2",
		"#83E377",
		"#FF8C94",
		"#5DA0D1",
		"#FFAA5C",
		"#D3A4E6",
		"#6BEDB5",
		"#ffb3b3",
		"#ff2222",
		"#7ad9d2",
		"#31b0a7",
		"#fee6ad"
	];
	const singers = [
		{
			singer: "carrie",
			pitchData: carriePitch,
			noteData: carrieNotes,
			key: "F#"
		},
		// {
		// 	singer: "demi",
		// 	data: demi,
		// 	key: "G#"
		// },
		// {
		// 	singer: "fergie",
		// 	data: fergie,
		// 	key: "G"
		// },
		// {
		// 	singer: "harry",
		// 	data: harry,
		// 	key: "G#"
		// },
		// {
		// 	singer: "jazmine",
		// 	data: jazmine,
		// 	key: "F"
		// },
		// {
		// 	singer: "kelly",
		// 	data: kelly,
		// 	key: "G"
		// },
		// {
		// 	singer: "legend",
		// 	data: legend,
		// 	key: "A#"
		// },
		{
			singer: "michelle",
			pitchData: michellePitch,
			noteData: michelleNotes,
			key: "D"
		}
		// {
		// 	singer: "snl",
		// 	data: snl,
		// 	key: "E"
		// },
		// {
		// 	singer: "tpain",
		// 	data: tpain,
		// 	key: "D#"
		// },
		// {
		// 	singer: "xtina",
		// 	data: xtina,
		// 	key: "F"
		// }
	].map((d, i) => ({ ...d, i, color: seriesColors[i] }));
	const toggles = writable(singers.map((d) => "on"));
	const lineData = writable([]);
	const timeDomain = writable([0, 20]);
	const normalizeWords = writable(false);
	const normalizeKey = writable(true);
	const standardKey = "C";

	const updateWordOccurrence = (word, wordOccurrenceMap) => {
		if (!wordOccurrenceMap.has(word)) {
			wordOccurrenceMap.set(word, 0);
		} else {
			const lastBlockIndex = wordOccurrenceMap.get(word);
			wordOccurrenceMap.set(word, lastBlockIndex + 1);
		}
		return wordOccurrenceMap.get(word);
	};

	$: $lineData = singers
		.map((d) => ({
			...d,
			start: +d.pitchData[0].timestamp,
			end: +d.pitchData[d.pitchData.length - 1].timestamp
		}))
		.map((d) => {
			let wordOccurrenceMap = new Map();
			let prevWord = null;
			let currentBlockIndex = -1;

			return {
				...d,
				pitchData: d.pitchData.map((p) => ({
					...p,
					singer: d.singer,
					frequency: $normalizeKey
						? transpose(+p.frequency, d.key, standardKey, d.singer)
						: +p.frequency,
					timestamp: +p.timestamp
				})),
				noteData: d.noteData.map((n, i) => {
					if (n.word !== prevWord) {
						currentBlockIndex = updateWordOccurrence(n.word, wordOccurrenceMap);
						prevWord = n.word;
					}
					return {
						...n,
						timestamp: +n.timestamp,
						frequency: $normalizeKey
							? transpose(+n.frequency, d.key, standardKey, d.singer)
							: +n.frequency,
						duration: +n.duration,
						word: `${_.kebabCase(n.word)}${
							currentBlockIndex !== 0 ? `-${currentBlockIndex + 1}` : ""
						}`
					};
				})
			};
		})
		.filter((d, i) => $toggles[d.i] === "on");

	setContext("exploration", {
		singers,
		lineData,
		seriesColors,
		standardKey,
		normalizeKey,
		normalizeWords,
		toggles,
		timeDomain
	});

	const transpose = (originalHz, originalKey, transposeKey, singer) => {
		const stepsToTranspose = halfStepsBetween(originalKey, transposeKey);
		let newFrequency = originalHz * 2 ** (stepsToTranspose / 12);
		const octaveShift = singer === "harry" ? 1 : 0;
		newFrequency *= 2 ** octaveShift;
		return newFrequency;
	};
	const halfStepsBetween = (originalKey, transposeKey) => {
		const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"];
		const originalKeyIndex = keys.indexOf(originalKey);
		const transposeKeyIndex = keys.indexOf(transposeKey);
		return transposeKeyIndex - originalKeyIndex;
	};
</script>

<Controls />
<Chart />
<Words />
