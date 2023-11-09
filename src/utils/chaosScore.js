import { scaleLinear } from "d3-scale";

const chaosScore = (singerLine, standardLine) => {
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
