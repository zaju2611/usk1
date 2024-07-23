import { BOX_SIZE } from "../data/constants";
import { rgb } from "pdf-lib";
export const drawSquare = (page, x, y, filled) => {
	page.drawRectangle({
		x: x,
		y: y,
		width: 9,
		height: 9,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
		color: filled ? rgb(0, 0, 0) : rgb(1, 1, 1),
	});
};
