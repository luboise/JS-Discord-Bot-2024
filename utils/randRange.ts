function randRange(left: number, right: number) {
	const randomDuration = Math.random() * (right - left);
	return Math.floor(left + randomDuration);
}

export default randRange;
