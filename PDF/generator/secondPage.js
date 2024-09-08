import { drawPatientInfo } from "../helpers/drawAuthorization";
import {
	PAGE_WIDTH,
	PAGE_HEIGHT,
	FONT_SIZE_MEDIUM,
} from "../data/constants.js";

import createPage from "../helpers/createPage";
import drawSecondPageHeader from "../helpers/drawSecondPageHeader";

import drawTestsSection from "../helpers/drawTestsSection";
import drawAuthorizationSection from "../helpers/drawAuthorizationSection";
import drawPaymentSection from "../helpers/drawPaymentSection";

export default function secondPage(
	pdfDoc,
	formData,
	selectedTests,
	getCurrentDate,
	customFont
) {
	const secondPage = createPage(
		pdfDoc,
		customFont,
		PAGE_WIDTH,
		PAGE_HEIGHT,
		FONT_SIZE_MEDIUM
	);

	drawSecondPageHeader(secondPage);
	drawPatientInfo(secondPage, formData, 30, 720);
	drawTestsSection(secondPage, formData, customFont, getCurrentDate);
	drawAuthorizationSection(secondPage, formData, getCurrentDate);
	drawPaymentSection(
		secondPage,
		formData,
		selectedTests,
		customFont,
		getCurrentDate
	);

	return secondPage;
}
