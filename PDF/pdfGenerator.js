import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { fetchFont } from "./helpers/fetchFont";
import firstPage from "./generator/firstPage";
import secondPage from "./generator/secondPage";

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
	firstPage(
		pdfDoc,
		formData,
		selectedTests,
		referralTests,
		getDateOfBirthFromPesel,
		getCurrentDateTime,
		getCurrentDate,
		customFont
	);
	secondPage(pdfDoc, formData, selectedTests, getCurrentDate, customFont);
	const pdfBytes = await pdfDoc.save();
	return pdfBytes;
};

const downloadPDF = (pdfBytes) => {
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank");
};

export { generatePDF, downloadPDF };
