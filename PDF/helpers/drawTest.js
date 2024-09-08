import { rgb } from "pdf-lib";
import {
	COLUMN_WIDTH,
	BOX_SIZE,
	FONT_SIZE_SMALL,
	MIN_Y,
	ROW_HEIGHT,
} from "../data/constants";

import { wrapText } from "./wrapText";
import drawTestBox from "./drawTestBox";

export default function drawTest(page, test, x, y, customFont, selectedTests) {
	const textLines = wrapText(
		test.label,
		customFont,
		COLUMN_WIDTH - BOX_SIZE - 10,
		FONT_SIZE_SMALL
	);
	textLines.forEach((line, lineIndex) => {
		if (y - BOX_SIZE < MIN_Y) {
			x += COLUMN_WIDTH;
			y = 520;
		}

		drawTestBox(
			page,
			x,
			y,
			selectedTests.some((t) => t.value === test.value)
		);
		page.drawText(line, {
			x: x + BOX_SIZE + 5,
			y: y - BOX_SIZE / 2 - 2 - lineIndex * 7,
			color: rgb(0, 0, 0),
		});

		if (lineIndex === textLines.length - 1) {
			y -= ROW_HEIGHT * (textLines.length || 1) + 1;
		}
	});

	return { x, y };
}
