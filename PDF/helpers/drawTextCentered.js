import { rgb } from "pdf-lib";
export const drawTextCentered = (page, text, font, fontSize, y) => {
	const textWidth = font.widthOfTextAtSize(text, fontSize);
	const x = (page.getWidth() - textWidth) / 2;
	page.drawText(text, {
		x: x,
		y: y,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0),
	});
};
