import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { wrapText } from "./helpers/wrapText";
import { drawWrappedText } from "./helpers/drawWrappedText";
import { drawSquare } from "./helpers/drawSquare";
import { drawTextCentered } from "./helpers/drawTextCentered";
import { fetchFont } from "./helpers/fetchFont";
import {
	drawHeader,
	drawPatientInfo,
	drawAuthorizedPersonInfo,
	drawFooter,
	formatTestNames,
} from "../PDF/helpers/drawAuthorization";
import {
	PAGE_WIDTH,
	PAGE_HEIGHT,
	FONT_SIZE_SMALL,
	FONT_SIZE_MEDIUM,
	FONT_SIZE_LARGE,
	FONT_SIZE_TINY,
	BOX_SIZE,
	ROW_HEIGHT,
	MIN_Y,
	COLUMN_WIDTH,
	ROW_TABLE_WIDTH,
	INITIAL_Y,
} from "./data/constants.js";
import { categories } from "./data/categories.js";
import { drawTableHeaders, drawTableRow } from "./helpers/drawTable";

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

	const hasSampleCollection = Object.values(formData.selectedTests).some(
		(test) => test.value === "Pobranie materiału"
	);

	// Collecting tests that are not in referralTests
	const otherTests = allTests.filter(
		(test) =>
			!referralTests.some((refTest) => refTest.value === test.value) &&
			(!hasSampleCollection || test.value !== "Pobranie materiału")
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
		{
			x: 500,
			y: 57,
			color: rgb(0, 0, 0),
		}
	);

	page.drawRectangle({
		x: 485,
		y: 50,
		width: 40,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});

	const secondPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
	secondPage.setFont(customFont);
	secondPage.setFontSize(FONT_SIZE_MEDIUM);

	secondPage.drawText("Upoważnienie do odbioru wyników badań.", {
		x: 30,
		y: 740,
		color: rgb(0, 0, 0),
	});

	drawHeader(secondPage, 30, 810);
	drawPatientInfo(secondPage, formData, 30, 720);

	let currentY = 690;
	const formattedTestNames = formatTestNames(formData.selectedTests);

	currentY = drawWrappedText(
		secondPage,
		`Badania: ${formattedTestNames}`,
		30,
		currentY,
		250,
		customFont,
		FONT_SIZE_MEDIUM,
		15,
		rgb(0, 0, 0)
	);

	currentY -= 30; // Add some space after the wrapped text

	drawFooter(secondPage, 30, currentY, getCurrentDate);

	if (formData.authorization) {
		secondPage.drawText("Upoważnienie do odbioru wyników badań.", {
			x: 300,
			y: 740,
			color: rgb(0, 0, 0),
		});
		drawHeader(secondPage, 300, 810);
		drawPatientInfo(secondPage, formData, 300, 720);

		drawAuthorizedPersonInfo(secondPage, formData, 300, 690);

		let currentYAuthorized = 645;
		const formattedTestNamesAuthorized = formatTestNames(
			formData.selectedTests
		);

		currentYAuthorized = drawWrappedText(
			secondPage,
			`Badania: ${formattedTestNamesAuthorized}`,
			300,
			currentYAuthorized,
			250,
			customFont,
			FONT_SIZE_MEDIUM,
			15,
			rgb(0, 0, 0)
		);

		currentYAuthorized -= 30; // Add some space after the wrapped text

		drawFooter(secondPage, 300, currentYAuthorized, getCurrentDate);
	}

	// Rysowanie nagłówków tabeli
	drawTextCentered(
		secondPage,
		"Badania odpłatne wykonywane w",
		customFont,
		FONT_SIZE_MEDIUM,
		400
	);
	drawTextCentered(
		secondPage,
		"Dziale Diagnostyki Laboratoryjnej SPSK 1 w Lublinie",
		customFont,
		FONT_SIZE_MEDIUM,
		380
	);
	drawTableHeaders(secondPage);
	secondPage.drawRectangle({
		x: 30,
		y: 310,
		width: 30,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	secondPage.drawRectangle({
		x: 60,
		y: 310,
		width: 400,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	secondPage.drawRectangle({
		x: 460,
		y: 310,
		width: PAGE_WIDTH - 490,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});

	secondPage.drawText(`${formData.firstName} ${formData.lastName}`, {
		x: 75,
		y: 318,
		color: rgb(0, 0, 0),
	});

	// Determine the header text
	const headerText = hasSampleCollection ? "+ 6 zł pobranie" : "";

	// Draw the header text with the appropriate fee information
	secondPage.drawText(headerText, {
		x: 465,
		y: 320,
		color: rgb(0, 0, 0),
	});

	// Create a map from categories
	const categoryPriceMap = categories.reduce((map, category) => {
		map[category.name] = category.price;
		return map;
	}, {});

	// Initialize categoryTotals with all categories, setting their prices to 0
	const categoryTotals = categories.reduce((totals, category) => {
		totals[category.name] = 0;
		return totals;
	}, {});

	// Update categoryTotals based on selectedTests
	formData.selectedTests.forEach((test) => {
		const categoryName = test.type;
		const price = test.price;

		if (categoryPriceMap.hasOwnProperty(categoryName)) {
			categoryTotals[categoryName] += price;
		}
	});
	let currentTableY = INITIAL_Y - ROW_TABLE_WIDTH - ROW_TABLE_WIDTH; // Adjust to start below the header

	Object.entries(categoryTotals).forEach(
		([categoryName, totalPrice], index) => {
			currentTableY = drawTableRow(
				secondPage,
				{ categoryName, totalPrice },
				index,
				currentTableY
			);
		}
	);

	const totalCategoryTotals = Object.values(categoryTotals).reduce(
		(total, amount) => total + amount,
		0
	);

	const totalAmount = hasSampleCollection
		? totalCategoryTotals + 6.0
		: totalCategoryTotals;

	secondPage.drawText(`Data: ${getCurrentDate()}`, {
		x: 75,
		y: currentTableY + 10,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText(`Suma: ${totalAmount.toFixed(2)} zł`, {
		x: 470,
		y: currentTableY + 10,
		color: rgb(0, 0, 0),
	});
	secondPage.drawRectangle({
		x: 30,
		y: currentTableY + 5,
		width: 30,
		height: ROW_TABLE_WIDTH,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	secondPage.drawRectangle({
		x: 60,
		y: currentTableY + 5,
		width: 400,
		height: ROW_TABLE_WIDTH,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	secondPage.drawRectangle({
		x: 460,
		y: currentTableY + 5,
		width: PAGE_WIDTH - 490,
		height: ROW_TABLE_WIDTH,
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
	window.open(url, "_blank");
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

export { generatePDF, downloadPDF };
