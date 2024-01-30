function stretch(data, endTs) {
	if (data.length === 0) return [];

	// Calculate the original end time of the last note
	const originalEndTs =
		data[data.length - 1].timestamp + data[data.length - 1].duration;

	// Calculate the stretch factor
	const stretchFactor = endTs / originalEndTs;

	// Stretch each note in the array
	return data.map((note) => ({
		timestamp: note.timestamp * stretchFactor,
		frequency: note.frequency,
		duration: note.duration * stretchFactor
	}));
}

export default stretch;
