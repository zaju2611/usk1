import { rgb } from "pdf-lib";

import {
	FONT_SIZE_TINY,
	FONT_SIZE_SMALL,
	FONT_SIZE_MEDIUM,
} from "../data/constants";

export default function drawFooter(
	page,
	formData,
	hasSampleCollection,
	getCurrentDateTime,
	getCurrentDate
) {
	page.setFontSize(FONT_SIZE_SMALL);
	page.drawText(
		"Wyrażam zgodę na pobranie krwi i przetwarzanie danych osobowych",
		{
			x: 290,
			y: 705,
			color: rgb(0, 0, 0),
		}
	);
	page.drawText("w USK1 w Lublinie", { x: 400, y: 695, color: rgb(0, 0, 0) });
	page.setFontSize(FONT_SIZE_TINY);
	page.drawText("podpis pacjenta", { x: 411, y: 685, color: rgb(0, 0, 0) });
	page.setFontSize(FONT_SIZE_SMALL);

	page.drawText("Oddział szpitalny/tel. do pacjenta/adres", {
		x: 30,
		y: 640,
		color: rgb(0, 0, 0),
	});
	page.drawText(
		".........................................................................................",
		{ x: 30, y: 625, color: rgb(0, 0, 0) }
	);

	const currentDateTime = getCurrentDateTime();
	page.drawText(`Data/godzina pobrania materiału: ${currentDateTime}`, {
		x: 30,
		y: 610,
		color: rgb(0, 0, 0),
	});
	page.drawText(
		"Podpis osoby pobierającej materiał: ................................................................",
		{ x: 30, y: 565, color: rgb(0, 0, 0) }
	);

	const currentDate = getCurrentDate();
	page.drawText(`Data wystawienia skierowania: ${currentDate}`, {
		x: 400,
		y: 565,
		color: rgb(0, 0, 0),
	});

	page.setFontSize(FONT_SIZE_MEDIUM);
	page.drawText("Ilość zleconych badań", {
		x: 450,
		y: 85,
		color: rgb(0, 0, 0),
	});
	page.setFontSize(16);

	page.drawText(
		hasSampleCollection
			? (formData.selectedTests.length - 1).toString()
			: formData.selectedTests.length.toString(),
		{ x: 500, y: 57, color: rgb(0, 0, 0) }
	);

	page.drawRectangle({
		x: 485,
		y: 50,
		width: 40,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
}
