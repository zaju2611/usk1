import { rgb } from "pdf-lib";
import { BOX_SIZE } from "../data/constants";

export default function drawTestBox(page, x, y, isSelected) {
	page.drawRectangle({
		x: x,
		y: y - BOX_SIZE,
		width: BOX_SIZE,
		height: BOX_SIZE,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
		color: isSelected ? rgb(0, 0, 0) : rgb(1, 1, 1),
	});
}
