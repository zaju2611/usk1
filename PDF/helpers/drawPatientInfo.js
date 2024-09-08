import { rgb } from "pdf-lib";

import { FONT_SIZE_MEDIUM, FONT_SIZE_SMALL } from "../data/constants";

import { drawSquare } from "./drawSquare";

export default function drawPatientInfo(
	page,
	formData,
	getDateOfBirthFromPesel
) {
	page.setFontSize(FONT_SIZE_MEDIUM);
	page.drawText(`Nazwisko: ${formData.lastName}`, {
		x: 30,
		y: 731,
		color: rgb(0, 0, 0),
	});
	page.drawText(`Imię: ${formData.firstName}`, {
		x: 30,
		y: 715,
		color: rgb(0, 0, 0),
	});
	page.drawText(`Nr tel: ${formData.phoneNumber}`, {
		x: 30,
		y: 698,
		color: rgb(0, 0, 0),
	});
	page.drawText(`PESEL: ${formData.pesel}`, {
		x: 30,
		y: 681,
		color: rgb(0, 0, 0),
	});

	page.setFontSize(FONT_SIZE_SMALL);
	const dateOfBirth = getDateOfBirthFromPesel(formData.pesel);
	page.drawText(`Data urodzenia: ${dateOfBirth}`, {
		x: 160,
		y: 660,
		color: rgb(0, 0, 0),
	});

	const isEven = parseInt(formData.pesel.slice(-2, -1), 10) % 2 === 0;
	page.drawText("Płeć:", { x: 30, y: 660, color: rgb(0, 0, 0) });
	drawSquare(page, 70, 655, isEven);
	page.drawText("K", { x: 82, y: 660, color: rgb(0, 0, 0) });
	drawSquare(page, 100, 655, !isEven);
	page.drawText("M", { x: 112, y: 660, color: rgb(0, 0, 0) });

	const genderMarker = isEven ? { x: 72 } : { x: 102 };
	page.drawText("X", { ...genderMarker, y: 656, color: rgb(0, 0, 0) });
}
