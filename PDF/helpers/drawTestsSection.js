import { rgb } from "pdf-lib";
import { FONT_SIZE_MEDIUM } from "../data/constants";
import { drawFooter, formatTestNames } from "../helpers/drawAuthorization";
import { drawWrappedText } from "./drawWrappedText";
export default function drawTestsSection(
	page,
	formData,
	customFont,
	getCurrentDate
) {
	const formattedTestNames = formatTestNames(formData.selectedTests);
	let currentY = 690;
	currentY = drawWrappedText(
		page,
		`Badania: ${formattedTestNames}`,
		30,
		currentY,
		250,
		customFont,
		FONT_SIZE_MEDIUM,
		15,
		rgb(0, 0, 0)
	);
	currentY -= 30;
	drawFooter(page, 30, currentY, getCurrentDate);
}
