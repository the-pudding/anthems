import { scaleLinear } from "d3-scale";
import DynamicTimeWarping from "dynamic-time-warping";

// DTW
const chaosScore = (singerLine, standardLine) => {
	const series1 = singerLine.map((d) => d.frequency);
	const series2 = standardLine.map((d) => d.frequency);
	const distFunction = (a, b) => Math.abs(a - b);
	const dtw = new DynamicTimeWarping(series1, series2, distFunction);
	return dtw.getDistance() / 100;
};

// Simple
const chaosScoreSimple = (singerLine, standardLine) => {
	const interpolateFrequencies = (lineData) => {
		const scale = scaleLinear()
			.domain(lineData.map((d) => d.timestamp))
			.range(lineData.map((d) => d.frequency))
			.clamp(true);

		return (timestamp) => scale(timestamp);
	};

	const singerInterpolate = interpolateFrequencies(singerLine);
	const standardInterpolate = interpolateFrequencies(standardLine);

	const allTimestamps = Array.from(
		new Set(singerLine.concat(standardLine).map((d) => d.timestamp))
	).sort((a, b) => a - b);

	let totalDeviation = 0;
	allTimestamps.forEach((timestamp) => {
		const singerFreq = singerInterpolate(timestamp);
		const standardFreq = standardInterpolate(timestamp);
		totalDeviation += Math.abs(singerFreq - standardFreq);
	});

	const chaosScore = totalDeviation / allTimestamps.length;
	return chaosScore;
};

export default chaosScore;
