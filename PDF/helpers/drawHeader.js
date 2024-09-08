import { rgb } from "pdf-lib";

import {
	FONT_SIZE_MEDIUM,
	FONT_SIZE_LARGE,
	FONT_SIZE_SMALL,
} from "../data/constants";

import { drawTextCentered } from "./drawTextCentered";

export default function drawHeader(page, customFont) {
	page.setFontSize(FONT_SIZE_MEDIUM);
	drawTextCentered(
		page,
		"Skierowanie do Działu Diagnostyki Laboratoryjnej",
		customFont,
		FONT_SIZE_MEDIUM,
		810
	);

	page.setFontSize(FONT_SIZE_LARGE);
	drawTextCentered(
		page,
		"Uniwersytecki Szpital Kliniczny Nr 1 w Lublinie",
		customFont,
		FONT_SIZE_LARGE,
		790
	);

	page.setFontSize(FONT_SIZE_SMALL);
	page.drawText("20-081 Lublin, ul.Staszica 11", {
		x: 50,
		y: 770,
		color: rgb(0, 0, 0),
	});
	page.drawText("Tel. 81-53-23-816, fax.81 53-22-803", {
		x: 50,
		y: 760,
		color: rgb(0, 0, 0),
	});

	page.drawText("REGON: 431029234", { x: 420, y: 770, color: rgb(0, 0, 0) });
	page.drawText("I cz. Kodu resortowego: 000000018581", {
		x: 420,
		y: 760,
		color: rgb(0, 0, 0),
	});
	page.drawText("V cz. Kodu resortowego: 02", {
		x: 420,
		y: 750,
		color: rgb(0, 0, 0),
	});
	page.drawText("VII cz. Kodu resortowego: 500", {
		x: 420,
		y: 740,
		color: rgb(0, 0, 0),
	});
}
