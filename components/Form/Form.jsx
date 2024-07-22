import { useState } from "react";
import Select from "react-select";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import classes from "./Form.module.css";

const customStyles = {
	control: (provided) => ({
		...provided,
		width: 300,
	}),
	menuList: (provided) => ({
		...provided,
		maxHeight: 150,
	}),
};

// Funkcja do konwersji numeru PESEL na datę urodzenia
const getDateOfBirthFromPesel = (pesel) => {
	const year = parseInt(pesel.slice(0, 2), 10);
	let month = parseInt(pesel.slice(2, 4), 10);
	const day = parseInt(pesel.slice(4, 6), 10);

	let fullYear = year + 1900; // Domyślnie zakładamy lata 1900-1999

	if (month > 20) {
		fullYear += 100; // Lata 2000-2099
		month -= 20;
	} else if (month > 0) {
		// Lata 1900-1999
	} else {
		// Zła data
		return "Niepoprawny PESEL";
	}

	return `${day.toString().padStart(2, "0")}.${month
		.toString()
		.padStart(2, "0")}.${fullYear}`;
};

const reffelsTests = [
	{
		label: "Morfologia z analizatora",
		value: "Morfologia krwi + rozmaz z analizatora",
		category: "Badania hematologiczne",
	},
	{
		label: "Morfologia z rozmazem manualnym",
		value: "Morfologia krwi + rozmaz z analizatora + rozmaz manualny",
		category: "Badania hematologiczne",
	},
	{
		label: "Morfologia z retikulocytami",
		value: "Morfologia krwi + rozmaz z analizatora + retikulocyty",
		category: "Badania hematologiczne",
	},
	{
		label: "Morfologia z rozmazem manualnym i z retikulocytami",
		value: "Morfologia krwi z rozmazem manualnym i retikulocytami",
		category: "Badania hematologiczne",
	},
	{
		label: "Morfologia z rozmazem manualnym w kierunku malarii",
		value: "Morfologia krwi + rozmaz w kierunku malarii",
		category: "Badania hematologiczne",
	},
	{
		label: "Płytki krwi pobrane na cytrynian",
		value: "Płytki krwi pobrane na cytrynian",
		category: "Badania hematologiczne",
	},
	{
		label: "OB",
		value: "Odczyn opadania krwinek (OB)",
		category: "Badania hematologiczne",
	},
	{
		label: "Czas protrombinowy (INR)",
		value: "Czas protrombinowy (PT)",
		category: "Hemostaza",
	},
	{
		label: "Czas kaolinowo-kefalinowy",
		value: "Czas kaoliniowo-kefalinowy (APTT)",
		category: "Hemostaza",
	},
	{
		label: "Fibrynogen",
		value: "Fibrynogen",
		category: "Hemostaza",
	},
	{
		label: "D-Dimery (DD2)",
		value: "D-Dimery",
		category: "Hemostaza",
	},
	{
		label: "Glukoza",
		value: "Glukoza",
		category: "Badania biochemiczne",
	},
	{
		label: "Białko całkowite",
		value: "Białko całkowite",
		category: "Badania biochemiczne",
	},
	{
		label: "Albumina",
		value: "Albumina",
		category: "Badania biochemiczne",
	},
	{
		label: "Bilirubina całkowita",
		value: "Bilirubina całkowita",
		category: "Badania biochemiczne",
	},
	{
		label: "Bilirubina bezp.",
		value: "Bilirubina bezpośrednia",
		category: "Badania biochemiczne",
	},
	{
		label: "ALT",
		value: "Aminotransferaza alaninowa (ALT)",
		category: "Badania biochemiczne",
	},
	{
		label: "AST",
		value: "Aminotransferaza asparaginianowa (AST)",
		category: "Badania biochemiczne",
	},
	{
		label: "Fosfataza zasadowa",
		value: "Fosfataza alkaiczna (ALP)",
		category: "Badania biochemiczne",
	},
	{
		label: "Fosfataza kwaśna",
		value: "Fosfataza kwaśna (ACP)",
		category: "Badania biochemiczne",
	},
	{
		label: "GGTP",
		value: "Gamma-glutamylotransferaza (GGT)",
		category: "Badania biochemiczne",
	},
	{
		label: "LDH",
		value: "Dehydrogenaza mleczanowa (LDH)",
		category: "Badania biochemiczne",
	},
	{
		label: "Amylaza",
		value: "Amylaza",
		category: "Badania biochemiczne",
	},
	{
		label: "Lipaza",
		value: "Lipaza",
		category: "Badania biochemiczne",
	},
	{
		label: "CK",
		value: "Kinaza kreatynowa (CK)",
		category: "Badania biochemiczne",
	},
	{
		label: "CK-MB",
		value: "Kinaza kreatynowa - izoenzym MB (CK-MB)",
		category: "Badania biochemiczne",
	},
	{
		label: "Mocznik",
		value: "Mocznik",
		category: "Badania biochemiczne",
	},
	{
		label: "Kreatynina",
		value: "Kreatynina",
		category: "Badania biochemiczne",
	},
	{
		label: "Kwas moczowy",
		value: "Kwas moczowy",
		category: "Badania biochemiczne",
	},
	{
		label: "Sód",
		value: "Sód",
		category: "Badania biochemiczne",
	},
	{
		label: "Potas",
		value: "Potas",
		category: "Badania biochemiczne",
	},
	{
		label: "Chlorki",
		value: "Chlorki",
		category: "Badania biochemiczne",
	},
	{
		label: "Wapń",
		value: "Wapń",
		category: "Badania biochemiczne",
	},
	{
		label: "Fosfor",
		value: "Fosforany nieorganiczne",
		category: "Badania biochemiczne",
	},
	{
		label: "Magnez",
		value: "Magnez całkowity",
		category: "Badania biochemiczne",
	},
	{
		label: "Lit",
		value: "Lit",
		category: "Badania biochemiczne",
	},
	{
		label: "Cholesterol całkowity",
		value: "Cholesterol całkowity",
		category: "Badania biochemiczne",
	},
	{
		label: "Cholesterol-HDL",
		value: "Cholesterol HDL",
		category: "Badania biochemiczne",
	},
	{
		label: "nie-HDL-C",
		value: "Cholesterol LDL",
		category: "Badania biochemiczne",
	},
	{
		label: "Triglicerydy",
		value: "Triglicerydy",
		category: "Badania biochemiczne",
	},
	{
		label: "Lipidogram",
		value: "Lipidogram",
		category: "Badania biochemiczne",
	},
	{
		label: "CRP",
		value: "CRP",
		category: "Badania biochemiczne",
	},
	{
		label: "Krzywa cukrowa 75g",
		value: "Test tolerancji glukozy (75g) (doustny test obciążenia glukozą)",
		category: "Badania biochemiczne",
	},
	{
		label: "Krzywa żelazowa",
		value: "Krzywa żelazowa 4 punktowa",
		category: "Badania biochemiczne",
	},
	{
		label: "Hemoglobina glikowana",
		value: "Hemoglobina glikowana (HbA1c)",
		category: "Badania biochemiczne",
	},
	{
		label: "Beta2 mikroglobulina",
		value: "Beta2 mikroglobulina",
		category: "Badania biochemiczne",
	},
	{
		label: "Haptoglobina",
		value: "Haptoglobina",
		category: "Badania biochemiczne",
	},
	{
		label: "Ferrytyna",
		value: "Ferrytyna",
		category: "Badania biochemiczne",
	},
	{
		label: "Transferyna",
		value: "Transferyna",
		category: "Badania biochemiczne",
	},
	{
		label: "Składowa dopełniacza C3",
		value: "Składnik dopełniacza C3",
		category: "Badania biochemiczne",
	},
	{
		label: "Składowa dopełniacza C4",
		value: "Składnik dopełniacza C4",
		category: "Badania biochemiczne",
	},
	{
		label: "Żelazo",
		value: "Żelazo",
		category: "Badania biochemiczne",
	},
	{
		label: "TSH",
		value: "Tyreotropina (TSH)",
		category: "Badania immunochemiczne",
	},
	{
		label: "FT3",
		value: "Trijodotyronina wolna (FT3)",
		category: "Badania immunochemiczne",
	},
	{
		label: "FT4",
		value: "Tyroksyna wolna (FT4)",
		category: "Badania immunochemiczne",
	},
	{
		label: "Anty-TPO",
		value: "P/ciała p/peroksydazie tarczycowej",
		category: "Badania immunochemiczne",
	},
	{
		label: "Anty-TG",
		value: "P/ciała p/tyreoglobulinie",
		category: "Badania immunochemiczne",
	},
	{
		label: "Prolaktyna(PRL)",
		value: "Prolaktyna",
		category: "Badania immunochemiczne",
	},
	{
		label: "FSH",
		value: "Hormon folikulotropowy (FSH)",
		category: "Badania immunochemiczne",
	},
	{
		label: "LH",
		value: "Hormon luteinizujący (LH)",
		category: "Badania immunochemiczne",
	},
	{
		label: "Estradiol",
		value: "Estradiol",
		category: "Badania immunochemiczne",
	},
	{
		label: "Progesteron",
		value: "Progesteron",
		category: "Badania immunochemiczne",
	},
	{
		label: "Testosteron",
		value: "Testosteron",
		category: "Badania immunochemiczne",
	},
	{
		label: "HCG",
		value: "HCG+podjednostka Beta",
		category: "Badania immunochemiczne",
	},
	{
		label: "CA 72-4",
		value: "Ca 72-4",
		category: "Badania immunochemiczne",
	},
	{
		label: "AMH",
		value: "AMH(hormon anty-mullerwoski)",
		category: "Badania immunochemiczne",
	},
	{
		label: "DHEA SO4",
		value: "DHEA SO4",
		category: "Badania immunochemiczne",
	},
	{
		label: "Kortyzol",
		value: "Kortyzol",
		category: "Badania immunochemiczne",
	},
	{
		label: "Parathormon",
		value: "Parathormon (PTH)",
		category: "Badania immunochemiczne",
	},
	{
		label: "PSA",
		value: "PSA całkowity",
		category: "Badania immunochemiczne",
	},
	{
		label: "CA 125",
		value: "CA 125 (jajniki)",
		category: "Badania immunochemiczne",
	},
	{
		label: "CA 19-9",
		value: "CA 19-9",
		category: "Badania immunochemiczne",
	},
	{
		label: "CA 15-3",
		value: "Ca 15-3",
		category: "Badania immunochemiczne",
	},
	{
		label: "CEA",
		value: "CEA",
		category: "Badania immunochemiczne",
	},
	{
		label: "AFP",
		value: "Alfa-fetoproteina (AFP)",
		category: "Badania immunochemiczne",
	},
	{
		label: "Prokalcytonina",
		value: "Prokalcytonina",
		category: "Badania immunochemiczne",
	},
	{
		label: "Anty-CCP",
		value: "P/ciała p/cyklicznemu cytrulinowemu peptydowi (anty_CCP)",
		category: "Badania immunochemiczne",
	},
	{
		label: "Czynnik reumatoidalny",
		value: "Czynnik reumatoidalny",
		category: "Badania immunochemiczne",
	},
	{
		label: "Ig E",
		value: "IgE całkowite",
		category: "Badania immunochemiczne",
	},
	{
		label: "Troponina T",
		value: "hs-Troponina T",
		category: "Badania immunochemiczne",
	},
	{
		label: "NT-pro BNP",
		value: "NT-proBNP",
		category: "Badania immunochemiczne",
	},
	{
		label: "Kwas walproinowy",
		value: "Kwas walproinowy",
		category: "Badania immunochemiczne",
	},
	{
		label: "Karbamazepina",
		value: "Karbamazepina",
		category: "Badania immunochemiczne",
	},
	{
		label: "Kwas foliowy",
		value: "Kwas foliowy",
		category: "Badania immunochemiczne",
	},
	{
		label: "Witamina B12",
		value: "Witamina B12",
		category: "Badania immunochemiczne",
	},
	{
		label: "Witamina D3",
		value: "Witamina D3 (25OH)",
		category: "Badania immunochemiczne",
	},
	{
		label: "ACTH",
		value: "ACTH",
		category: "Badania immunochemiczne",
	},
	{
		label: "Homocysteina",
		value: "Homocysteina",
		category: "Badania immunochemiczne",
	},
	{
		label: "HIV DUO",
		value: "HIV antygen/przeciwciała",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "HBs Ag",
		value: "Antygen HBs",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Anty-HBc Total",
		value: "P/ciała p/HBc Total",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Anty-HBc Total",
		value: "P/ciała p/HBc Total",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Anty-HBc IgM",
		value: "P/ciała p/HBc IgM",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "HBe Ag",
		value: "Antygen HBe",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Anty-HBe",
		value: "P/ciała p/HBe",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Anty-HCV",
		value: "P/ciała p/HCV",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Cytomegalia Ig M",
		value: "P/ciała p/CMV IgM",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Cytomegalia Ig G",
		value: "P/ciała p/CMV IgG",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Różyczka Ig M",
		value: "P/ciała p/wirusowi różyczki IgM",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Różyczka Ig G",
		value: "P/ciała p/wirusowi różyczki IgG",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Toxoplazmoza Ig M",
		value: "P/ciała p/Toxoplasma gondii IgM",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Toxoplazmoza Ig G",
		value: "P/ciała p/Toxoplasma gondii IgG",
		category: "Markery chorób zakaźnych",
	},
	{
		label: "Wolne lekkie łańcuchyu Kappa",
		value: "Wolne lekkie łańcuchy Kappa",
		category: "Białka specyficzne",
	},
	{
		label: "Wolne lekkie łańcuchyu Lambda",
		value: "Wolne lekkie łańcuchy Lambda",
		category: "Białka specyficzne",
	},
	{
		label: "Elektroforeza białek",
		value: "Elektroforeza",
		category: "Białka specyficzne",
	},
	{
		label: "Immunofiksacja",
		value: "Immunofiksacja",
		category: "Białka specyficzne",
	},
	{
		label: "Elektroforeza z immunofiksacją",
		value: "Elektroforeza z immunofiksacją",
		category: "Białka specyficzne",
	},
	{
		label: "Uzupełniająca immunofiksacja",
		value: "Uzupełniająca immunofiksacja",
		category: "Białka specyficzne",
	},
	{
		label: "Ig A",
		value: "IgA",
		category: "Białka specyficzne",
	},
	{
		label: "Ig M",
		value: "IgM",
		category: "Białka specyficzne",
	},
	{
		label: "Ig G",
		value: "IgG",
		category: "Białka specyficzne",
	},
	{
		label: "Komórki LE",
		value: "Komórki LE",
		category: "Białka specyficzne",
	},
	{
		label: "Krioglobuliny (skrining+elektroforeza)",
		value: "Krioglobuliny",
		category: "Białka specyficzne",
	},
	{
		label: "Analiza ogólna moczu",
		value: "Analiza ogólna moczu",
		category: "Analityka ogólna",
	},
	{
		label: "Glukoza i ciała ketonowe w moczu",
		value: "Glukoza i ciała ketonowe w moczu",
		category: "Analityka ogólna",
	},
	{
		label: "Badanie gazometryczne krwi",
		value: "Równowaga kwasowo-zasadowa (gazometria)",
		category: "Analityka ogólna",
	},
	{
		label: "Krew utajona w kale",
		value: "Krew utajonia w kale",
		category: "Analityka ogólna",
	},
	{
		label: "Panel narkotyków w moczu",
		value: "Panelowy test na narkotyki w moczu (10 narkotyków)",
		category: "Analityka ogólna",
	},
	{
		label: "Sód - mocz",
		value: "Sód DZM",
		category: "Badania biochemiczne",
	},
	{
		label: "Potas - mocz",
		value: "Potas DZM",
		category: "Badania biochemiczne",
	},
	{
		label: "Mocznik - mocz",
		value: "Mocznik DZM",
		category: "Badania biochemiczne",
	},
	{
		label: "Kreatynina - mocz",
		value: "Kreatynina DZM",
		category: "Badania biochemiczne",
	},
];

const getCurrentDateTime = () => {
	const now = new Date();
	const day = now.getDate().toString().padStart(2, "0");
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	const year = now.getFullYear();
	const hours = now.getHours().toString().padStart(2, "0");
	const minutes = now.getMinutes().toString().padStart(2, "0");

	return `${day}.${month}.${year} ${hours}.${minutes}`;
};

const getCurrentDate = () => {
	const now = new Date();
	const day = now.getDate().toString().padStart(2, "0");
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	const year = now.getFullYear();

	return `${day}.${month}.${year}`;
};

const Form = ({ formData, handleChange, handleTestChange, availableTests }) => {
	const [selectedTests, setSelectedTests] = useState([]);

	const handleTestChangeInternal = (selectedOptions) => {
		setSelectedTests(selectedOptions);
		handleTestChange(selectedOptions);
	};

	const fetchFont = async () => {
		const response = await fetch("/Lora.ttf");
		const fontBytes = await response.arrayBuffer();
		return fontBytes;
	};

	const generatePDF = async () => {
		const pdfDoc = await PDFDocument.create();
		pdfDoc.registerFontkit(fontkit);

		const fontBytes = await fetchFont();
		const customFont = await pdfDoc.embedFont(fontBytes);

		const page = pdfDoc.addPage([595.28, 841.89]);
		page.setFont(customFont);

		page.setFontSize(7);

		const startX = 30; // Początkowa pozycja X
		const startY = 520; // Początkowa pozycja Y
		const boxSize = 5; // Rozmiar kwadracika
		const padding = 135; // Odstęp między kolumnami
		const rowHeight = 10; // Wysokość wiersza
		const columnWidth = padding + boxSize; // Szerokość kolumny (szersza, aby uwzględnić tekst)
		const minY = 50; // Minimalna wartość Y dla przejścia do nowej kolumny

		let x = startX;
		let y = startY;

		const wrapText = (text, maxWidth) => {
			let lines = [];
			let currentLine = "";

			text.split(" ").forEach((word) => {
				const testLine = currentLine + (currentLine ? " " : "") + word;
				const testLineWidth = customFont.widthOfTextAtSize(testLine, 7);

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

		reffelsTests.forEach((test, index) => {
			const textLines = wrapText(test.label, columnWidth - boxSize - 10);

			textLines.forEach((line, lineIndex) => {
				// Sprawdź, czy tekst zmieści się w aktualnej kolumnie
				if (y - boxSize < minY) {
					// Przejdź do nowej kolumny
					x += columnWidth;
					y = startY;
				}

				// Rysuj kwadracik
				page.drawRectangle({
					x: x,
					y: y - boxSize,
					width: boxSize,
					height: boxSize,
					borderColor: rgb(0, 0, 0),
					borderWidth: 1,
					color: selectedTests.some((t) => t.value === test.value)
						? rgb(0, 0, 0)
						: rgb(1, 1, 1),
				});

				// Rysuj tekst w odpowiedniej linii
				page.drawText(line, {
					x: x + boxSize + 5,
					y: y - boxSize / 2 - 2 - lineIndex * 7, // Dostosuj wysokość linii, jeśli jest zbyt duża
					color: rgb(0, 0, 0),
				});

				// Zaktualizuj pozycję `y` tylko po narysowaniu wszystkich linii tekstu dla danego testu
				if (lineIndex === textLines.length - 1) {
					y -= rowHeight * (textLines.length || 1);
				}
			});

			// Jeśli potrzebujesz przejść do nowej kolumny
			if (y < minY) {
				x += columnWidth;
				y = startY;
			}
		});

		page.setFontSize(11);
		const title = "Skierowanie do Działu Diagnostyki Laboratoryjnej";
		const titleWidth = customFont.widthOfTextAtSize(title, 11);
		page.drawText(title, {
			x: (595.28 - titleWidth) / 2,
			y: 810,
			color: rgb(0, 0, 0),
		});

		page.setFontSize(13);
		const subtitle = "Samodzielny Publiczny Szpital Kliniczny Nr 1 w Lublinie";
		const subtitleWidth = customFont.widthOfTextAtSize(subtitle, 13);
		page.drawText(subtitle, {
			x: (595.28 - subtitleWidth) / 2,
			y: 780,
			color: rgb(0, 0, 0),
		});

		page.setFontSize(8);
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

		page.drawText("REGON: 431029234", {
			x: 420,
			y: 760,
			color: rgb(0, 0, 0),
		});
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

		page.setFontSize(9);

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

		// Data urodzenia
		const dateOfBirth = getDateOfBirthFromPesel(formData.pesel);
		page.drawText(`Data urodzenia: ${dateOfBirth}`, {
			x: 160,
			y: 660,
			color: rgb(0, 0, 0),
		});

		// Płeć
		const isEven = parseInt(formData.pesel.slice(-2, -1), 10) % 2 === 0;
		page.drawText("Płeć:", {
			x: 30,
			y: 660,
			color: rgb(0, 0, 0),
		});

		page.drawRectangle({
			x: 70,
			y: 655,
			width: 9,
			height: 9,
			borderColor: rgb(0, 0, 0),
			borderWidth: 1,
		});
		page.drawText("K", {
			x: 82,
			y: 660,
			color: rgb(0, 0, 0),
		});

		page.drawRectangle({
			x: 100,
			y: 655,
			width: 9,
			height: 9,
			borderColor: rgb(0, 0, 0),
			borderWidth: 1,
		});
		page.drawText("M", {
			x: 112,
			y: 660,
			color: rgb(0, 0, 0),
		});

		if (isEven) {
			page.drawText("X", {
				x: 72,
				y: 656,
				color: rgb(0, 0, 0),
			});
		} else {
			page.drawText("X", {
				x: 102,
				y: 656,
				color: rgb(0, 0, 0),
			});
		}

		page.drawText(
			"Wyrażam zgodę na pobranie krwi i przetwarzanie danych osobowych",
			{
				x: 290,
				y: 705,
				color: rgb(0, 0, 0),
			}
		);
		page.drawText("w SPSK1 w Lublinie", {
			x: 400,
			y: 695,
			color: rgb(0, 0, 0),
		});
		page.setFontSize(7);
		page.drawText("podpis pacjenta", {
			x: 416,
			y: 685,
			color: rgb(0, 0, 0),
		});
		page.setFontSize(9);
		page.drawText("Oddział szpitalny/tel. do pacjenta/adres", {
			x: 30,
			y: 640,
			color: rgb(0, 0, 0),
		});
		page.drawText(
			".........................................................................................",
			{
				x: 30,
				y: 625,
				color: rgb(0, 0, 0),
			}
		);
		const currentDateTime = getCurrentDateTime();
		page.drawText(`Data/godzina pobrania materiału: ${currentDateTime}`, {
			x: 30,
			y: 610,
			color: rgb(0, 0, 0),
		});
		page.drawText(
			"Podpis osoby pobierającej materiał: ................................................................",
			{
				x: 30,
				y: 585,
				color: rgb(0, 0, 0),
			}
		);
		const currentDate = getCurrentDate();
		page.drawText(`Data wystawienia skierowania: ${currentDate}`, {
			x: 400,
			y: 585,
			color: rgb(0, 0, 0),
		});
		// page.drawText("Wybrane badania:", {
		// 	x: 30,
		// 	y: 620,
		// 	color: rgb(0, 0, 0),
		// });

		// selectedTests.forEach((test, index) => {
		// 	page.drawText(`- ${test.label}`, {
		// 		x: 70,
		// 		y: 600 - index * 20,
		// 		color: rgb(0, 0, 0),
		// 	});
		// });

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "form.pdf";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const handleSubmitInternal = (event) => {
		event.preventDefault();
		generatePDF();
	};

	return (
		<form onSubmit={handleSubmitInternal} className={classes.form}>
			<div className={classes.formGroup}>
				<label htmlFor="firstName">Imię</label>
				<input
					type="text"
					id="firstName"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					required
				/>
			</div>
			<div className={classes.formGroup}>
				<label htmlFor="lastName">Nazwisko</label>
				<input
					type="text"
					id="lastName"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					required
				/>
			</div>
			<div className={classes.formGroup}>
				<label htmlFor="pesel">Pesel</label>
				<input
					type="text"
					id="pesel"
					name="pesel"
					value={formData.pesel}
					onChange={handleChange}
					required
				/>
			</div>
			<div className={classes.formGroup}>
				<label htmlFor="phoneNumber">Numer telefonu</label>
				<input
					type="text"
					id="phoneNumber"
					name="phoneNumber"
					value={formData.phoneNumber}
					onChange={handleChange}
					required
				/>
			</div>
			<div className={classes.formGroup}>
				<label htmlFor="tests">Wybierz badania</label>
				<Select
					id="tests"
					name="tests"
					options={availableTests}
					isMulti
					onChange={handleTestChangeInternal}
					placeholder="Wybierz badanie"
					styles={customStyles}
				/>
			</div>
			<div className={classes.buttonContainer}>
				<button type="submit" className={classes.submitButton}>
					Generuj
				</button>
			</div>
		</form>
	);
};

export default Form;
