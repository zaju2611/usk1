import { drawTextCentered } from "./drawTextCentered";

import { FONT_SIZE_MEDIUM } from "../data/constants";
import { drawTableHeaders } from "./drawTable";
import drawPaymentRows from "./drawPaymentRows";

export default function drawPaymentSection(
	page,
	formData,
	selectedTests,
	customFont,
	getCurrentDate
) {
	drawTextCentered(
		page,
		"Badania odpłatne wykonywane w",
		customFont,
		FONT_SIZE_MEDIUM,
		400
	);
	drawTextCentered(
		page,
		"Dziale Diagnostyki Laboratoryjnej USK 1 w Lublinie",
		customFont,
		FONT_SIZE_MEDIUM,
		380
	);

	drawTableHeaders(page);
	drawPaymentRows(page, formData, selectedTests, getCurrentDate);
}
