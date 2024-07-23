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
	page.drawText("podpis pacjenta", { x: 413, y: 685, color: rgb(0, 0, 0) });
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

	const secondPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
	secondPage.setFont(customFont);
	secondPage.setFontSize(FONT_SIZE_MEDIUM);

	secondPage.drawText("Dział Diagnostyki Laboratoryjnej USK Nr 1", {
		x: 30,
		y: 810,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText("20-841 Lublin ul. Al. Solidarności 8", {
		x: 30,
		y: 795,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText("(wejście od ul. Staszica 16)", {
		x: 30,
		y: 780,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText("tel. (81)-532-38-16", {
		x: 30,
		y: 765,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText("Upoważnienie do dobioru wyników badań.", {
		x: 30,
		y: 740,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText(`Pacjent: ${formData.firstName} ${formData.lastName}`, {
		x: 30,
		y: 720,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText(`PESEL: ${formData.pesel}`, {
		x: 30,
		y: 705,
		color: rgb(0, 0, 0),
	});

	const drawWrappedText = (
		page,
		text,
		x,
		y,
		maxWidth,
		font,
		size,
		lineHeight,
		color
	) => {
		const lines = wrapText(text, font, maxWidth, size);
		lines.forEach((line, index) => {
			page.drawText(line, {
				x: x,
				y: y - index * lineHeight,
				size: size,
				color: color,
			});
		});
		return y - lines.length * lineHeight;
	};

	let currentY = 690;

	const formatTestNames = (tests) => {
		return tests.map((test) => test.value).join(", ");
	};

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

	secondPage.drawText(`Data: `, {
		x: 30,
		y: currentY,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText(`Podpis os. pobierającej: `, {
		x: 160,
		y: currentY,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText(`${getCurrentDate()}`, {
		x: 30,
		y: currentY - 15,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText(`............................................`, {
		x: 160,
		y: currentY - 15,
		color: rgb(0, 0, 0),
	});
	currentY -= 45; // Space for the date and signature lines

	secondPage.drawText("Wyniki badań odbierane są w laboratorium po", {
		x: 30,
		y: currentY,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText("Okazaniu dowodu osobistego i dokumentu", {
		x: 30,
		y: currentY - 15,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText("zapłaty", {
		x: 30,
		y: currentY - 30,
		color: rgb(0, 0, 0),
	});

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

	secondPage.drawRectangle({
		x: 30,
		y: 360,
		width: PAGE_WIDTH - 60,
		height: 60,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	secondPage.drawText("Lp.", {
		x: 35,
		y: 345,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText("Imię i Nazwisko Pacjenta", {
		x: 75,
		y: 345,
		color: rgb(0, 0, 0),
	});
	secondPage.drawText("Kwota badania", {
		x: 470,
		y: 345,
		color: rgb(0, 0, 0),
	});
	secondPage.drawRectangle({
		x: 30,
		y: 335,
		width: 30,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	secondPage.drawRectangle({
		x: 60,
		y: 335,
		width: 400,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	secondPage.drawRectangle({
		x: 460,
		y: 335,
		width: PAGE_WIDTH - 490,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
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

	const hasSampleCollection = Object.values(formData.selectedTests).some(
		(test) => test.value === "Pobranie materiału"
	);

	// Determine the header text
	const headerText = hasSampleCollection ? "+ 6 zł pobranie" : "";

	// Draw the header text with the appropriate fee information
	secondPage.drawText(headerText, {
		x: 465,
		y: 320,
		color: rgb(0, 0, 0),
	});

	const categories = [
		{ name: "Badania hematologiczne", price: 0 },
		{ name: "Hemostaza (osocze cytrynianowe)", price: 0 },
		{ name: "Analityka ogólna", price: 0 },
		{ name: "Chemia kliniczna (surowica)", price: 0 },
		{ name: "Chemia kliniczna (mocz)", price: 0 },
		{ name: "Immunochemia (surowica)", price: 0 },
		{ name: "Markery chorób zakaźnych", price: 0 },
		{ name: "Immunochemia (osocze wersenianowe)", price: 0 },
		{ name: "Immunochemia (krew pełna wersenianowa)", price: 0 },
		{ name: "Białka specyficzne", price: 0 },
		{ name: "Narkotyki w moczu", price: 0 },
	];

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

	console.log(categoryTotals); // Output the updated totals
	const ROW_TABLE_WIDTH = 20;
	const INITIAL_Y = 325;
	let currentTableY = INITIAL_Y - ROW_TABLE_WIDTH - ROW_TABLE_WIDTH; // Adjust to start below the header

	Object.entries(categoryTotals).forEach(
		([categoryName, totalPrice], index) => {
			// Draw row content
			secondPage.drawText((index + 1).toString(), {
				x: 40,
				y: currentTableY + 10,
				color: rgb(0, 0, 0),
			});
			secondPage.drawText(categoryName, {
				x: 75,
				y: currentTableY + 10,
				color: rgb(0, 0, 0),
			});
			secondPage.drawText(totalPrice.toFixed(2), {
				x: 470,
				y: currentTableY + 10,
				color: rgb(0, 0, 0),
			});

			// Draw row borders
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

			// Move to the next row
			currentTableY -= ROW_TABLE_WIDTH;
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
	secondPage.drawText(`${totalAmount.toFixed(2)}`, {
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
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

export { generatePDF, downloadPDF };
