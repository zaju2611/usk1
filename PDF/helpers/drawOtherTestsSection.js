import { rgb } from "pdf-lib";

import {
	BOX_SIZE,
	MIN_Y,
	COLUMN_WIDTH,
	ROW_HEIGHT,
	FONT_SIZE_SMALL,
} from "../data/constants";

import drawTest from "./drawTest";

export default function drawOtherTestsSection(
	page,
	otherTests,
	x,
	y,
	customFont,
	selectedTests
) {
	if (y - BOX_SIZE < MIN_Y) {
		x += COLUMN_WIDTH;
		y = 520;
	} else {
		y -= ROW_HEIGHT + 5;
	}

	page.drawText("INNE", {
		x: x,
		y: y - BOX_SIZE / 2 - 2,
		size: FONT_SIZE_SMALL,
		font: customFont,
		color: rgb(0, 0, 0),
	});

	y -= ROW_HEIGHT + 5;

	otherTests.forEach((test) => {
		({ x, y } = drawTest(page, test, x, y, customFont, selectedTests));
	});

	return { x, y };
}
