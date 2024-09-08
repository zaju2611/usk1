import { rgb } from "pdf-lib";
import drawTest from "./drawTest";
import {
	COLUMN_WIDTH,
	BOX_SIZE,
	MIN_Y,
	FONT_SIZE_SMALL,
	ROW_HEIGHT,
} from "../data/constants";

export default function drawTestCategory(
	page,
	category,
	tests,
	x,
	y,
	customFont,
	selectedTests
) {
	if (y - BOX_SIZE < MIN_Y) {
		x += COLUMN_WIDTH;
		y = 520;
	} else if (category !== "Badania hematologiczne") {
		y -= ROW_HEIGHT + 5;
	}

	page.drawText(category.toUpperCase(), {
		x: x,
		y: y - BOX_SIZE / 2 - 2,
		size: FONT_SIZE_SMALL,
		font: customFont,
		color: rgb(0, 0, 0),
	});

	y -= ROW_HEIGHT + 5;

	tests.forEach((test) => {
		({ x, y } = drawTest(page, test, x, y, customFont, selectedTests));
	});

	return { x, y };
}
