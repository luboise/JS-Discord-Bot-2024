function randRange(left: number, right: number) {
    const randomDuration = Math.random() * (right - left);
    return Math.floor(right + randomDuration);
}

export default randRange;
