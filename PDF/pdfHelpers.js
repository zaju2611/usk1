import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const FONT_SIZE_SMALL = 8;
const FONT_SIZE_MEDIUM = 11;
const FONT_SIZE_LARGE = 13;
const FONT_SIZE_TINY = 7;
const BOX_SIZE = 5;
const PADDING = 135;
const ROW_HEIGHT = 10;
const MIN_Y = 60;
const COLUMN_WIDTH = PADDING + BOX_SIZE;

const fetchFont = async () => {
	const response = await fetch("/Lora.ttf");
	return await response.arrayBuffer();
};

const drawTextCentered = (page, text, font, size, y) => {
	const textWidth = font.widthOfTextAtSize(text, size);
	page.drawText(text, {
		x: (PAGE_WIDTH - textWidth) / 2,
		y: y,
		size: size,
		font: font,
		color: rgb(0, 0, 0),
	});
};

const drawSquare = (page, x, y, filled) => {
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

const wrapText = (text, font, maxWidth, size) => {
	const lines = [];
	let currentLine = "";

	text.split(" ").forEach((word) => {
		const testLine = currentLine + (currentLine ? " " : "") + word;
		const testLineWidth = font.widthOfTextAtSize(testLine, size);

		if (testLineWidth > maxWidth) {
			lines.push(currentLine);
			currentLine = word;
		} else {
			currentLine = testLine;
		}
	});

	if (currentLine) lines.push(currentLine);
	return lines;
};

const generatePDF = async (
	formData,
	selectedTests,
	referralTests,
	getDateOfBirthFromPesel,
	getCurrentDateTime,
	getCurrentDate
) => {
	const pdfDoc = await PDFDocument.create();
	pdfDoc.registerFontkit(fontkit);
	const fontBytes = await fetchFont();
	const customFont = await pdfDoc.embedFont(fontBytes);

	const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
	page.setFont(customFont);
	page.setFontSize(FONT_SIZE_SMALL);

	let x = 30;
	let y = 520;

	const groupedTests = referralTests.reduce((groups, test) => {
		if (!groups[test.category]) groups[test.category] = [];
		groups[test.category].push(test);
		return groups;
	}, {});

	const allTests = selectedTests.map((test) => ({
		label: test.label,
		value: test.value,
	}));

	// Collecting tests that are not in referralTests
	const otherTests = allTests.filter(
		(test) => !referralTests.some((refTest) => refTest.value === test.value)
	);

	Object.keys(groupedTests).forEach((category) => {
		if (y - BOX_SIZE < MIN_Y) {
			x += COLUMN_WIDTH;
			y = 520;
		} else {
			if (category !== "Badania hematologiczne") {
				y -= ROW_HEIGHT + 5;
			}
		}

		page.drawText(category.toUpperCase(), {
			x: x,
			y: y - BOX_SIZE / 2 - 2,
			size: FONT_SIZE_SMALL,
			font: customFont,
			color: rgb(0, 0, 0),
		});

		y -= ROW_HEIGHT + 5;

		groupedTests[category].forEach((test) => {
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

				page.drawRectangle({
					x: x,
					y: y - BOX_SIZE,
					width: BOX_SIZE,
					height: BOX_SIZE,
					borderColor: rgb(0, 0, 0),
					borderWidth: 1,
					color: selectedTests.some((t) => t.value === test.value)
						? rgb(0, 0, 0)
						: rgb(1, 1, 1),
				});

				page.drawText(line, {
					x: x + BOX_SIZE + 5,
					y: y - BOX_SIZE / 2 - 2 - lineIndex * 7,
					color: rgb(0, 0, 0),
				});

				if (lineIndex === textLines.length - 1) {
					y -= ROW_HEIGHT * (textLines.length || 1) + 1;
				}
			});

			if (y < MIN_Y) {
				x += COLUMN_WIDTH;
				y = 520;
			}
		});
	});
	if (otherTests.length > 0) {
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

				page.drawRectangle({
					x: x,
					y: y - BOX_SIZE,
					width: BOX_SIZE,
					height: BOX_SIZE,
					borderColor: rgb(0, 0, 0),
					borderWidth: 1,
					color: selectedTests.some((t) => t.value === test.value)
						? rgb(0, 0, 0)
						: rgb(1, 1, 1),
				});

				page.drawText(line, {
					x: x + BOX_SIZE + 5,
					y: y - BOX_SIZE / 2 - 2 - lineIndex * 7,
					color: rgb(0, 0, 0),
				});

				if (lineIndex === textLines.length - 1) {
					y -= ROW_HEIGHT * (textLines.length || 1) + 1;
				}
			});

			if (y < MIN_Y) {
				x += COLUMN_WIDTH;
				y = 520;
			}
		});
	}

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
		"Samodzielny Publiczny Szpital Kliniczny Nr 1 w Lublinie",
		customFont,
		FONT_SIZE_LARGE,
		780
	);

	page.setFontSize(FONT_SIZE_SMALL);
	page.drawText("20-081 Lublin, ul.Staszica 11", {
		x: 50,
		y: 760,
		color: rgb(0, 0, 0),
	});
	page.drawText("Tel. 81-53-23-816, fax.81 53-22-803", {
		x: 50,
		y: 750,
		color: rgb(0, 0, 0),
	});

	page.drawText("REGON: 431029234", { x: 420, y: 760, color: rgb(0, 0, 0) });
	page.drawText("I cz. Kodu resortowego: 000000018581", {
		x: 420,
		y: 750,
		color: rgb(0, 0, 0),
	});
	page.drawText("V cz. Kodu resortowego: 02", {
		x: 420,
		y: 740,
		color: rgb(0, 0, 0),
	});
	page.drawText("VII cz. Kodu resortowego: 500", {
		x: 420,
		y: 730,
		color: rgb(0, 0, 0),
	});

	page.setFontSize(FONT_SIZE_SMALL);
	page.drawText(`Nazwisko: ${formData.lastName}`, {
		x: 30,
		y: 720,
		color: rgb(0, 0, 0),
	});
	page.drawText(`Imię: ${formData.firstName}`, {
		x: 30,
		y: 705,
		color: rgb(0, 0, 0),
	});
	page.drawText(`Nr tel: ${formData.phoneNumber}`, {
		x: 30,
		y: 690,
		color: rgb(0, 0, 0),
	});
	page.drawText(`PESEL: ${formData.pesel}`, {
		x: 30,
		y: 675,
		color: rgb(0, 0, 0),
	});

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

	if (isEven) {
		page.drawText("X", { x: 72, y: 656, color: rgb(0, 0, 0) });
	} else {
		page.drawText("X", { x: 102, y: 656, color: rgb(0, 0, 0) });
	}

	page.drawText(
		"Wyrażam zgodę na pobranie krwi i przetwarzanie danych osobowych",
		{ x: 290, y: 705, color: rgb(0, 0, 0) }
	);
	page.drawText("w SPSK1 w Lublinie", { x: 400, y: 695, color: rgb(0, 0, 0) });
	page.setFontSize(FONT_SIZE_TINY);
	page.drawText("podpis pacjenta", { x: 416, y: 685, color: rgb(0, 0, 0) });
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
	page.drawText(`${formData.selectedTests.length}`, {
		x: 500,
		y: 57,
		color: rgb(0, 0, 0),
	});

	page.drawRectangle({
		x: 485,
		y: 50,
		width: 40,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});

	const pdfBytes = await pdfDoc.save();
	return pdfBytes;
};

const downloadPDF = (pdfBytes, fileName) => {
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

export { generatePDF, downloadPDF };
