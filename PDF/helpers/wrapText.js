export const wrapText = (text, font, maxWidth, fontSize) => {
	const words = text.split(" ");
	const lines = [];
	let currentLine = words[0];

	for (let i = 1; i < words.length; i++) {
		const word = words[i];
		const width = font.widthOfTextAtSize(currentLine + " " + word, fontSize);
		if (width < maxWidth) {
			currentLine += " " + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
};
