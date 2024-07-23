import { wrapText } from "./wrapText";

export const drawWrappedText = (
	page,
	text,
	x,
	y,
	maxWidth,
	font,
	size,
	lineHeight,
	color
) => {
	const lines = wrapText(text, font, maxWidth, size);
	lines.forEach((line, index) => {
		page.drawText(line, {
			x: x,
			y: y - index * lineHeight,
			size: size,
			color: color,
		});
	});
	return y - lines.length * lineHeight;
};
