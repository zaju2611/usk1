import { PAGE_WIDTH, PAGE_HEIGHT, FONT_SIZE_SMALL } from "../data/constants";

import createPage from "../helpers/createPage";
import groupTestsByCategory from "../helpers/groupTestsByCategory";
import getAllTests from "../helpers/getAllTests";
import checkSampleCollection from "../helpers/checkSampleCollection";
import drawTestCategory from "../helpers/drawTestCategory";
import getOtherTests from "../helpers/getOtherTests";
import drawOtherTestsSection from "../helpers/drawOtherTestsSection";
import drawHeader from "../helpers/drawHeader";
import drawPatientInfo from "../helpers/drawPatientInfo";
import drawFooter from "../helpers/drawFooter";

export default function firstPage(
	pdfDoc,
	formData,
	selectedTests,
	referralTests,
	getDateOfBirthFromPesel,
	getCurrentDateTime,
	getCurrentDate,
	customFont
) {
	const page = createPage(
		pdfDoc,
		customFont,
		PAGE_WIDTH,
		PAGE_HEIGHT,
		FONT_SIZE_SMALL
	);

	let x = 30;
	let y = 520;

	const groupedTests = groupTestsByCategory(referralTests);
	const allTests = getAllTests(selectedTests);
	const hasSampleCollection = checkSampleCollection(selectedTests);

	Object.keys(groupedTests).forEach((category) => {
		({ x, y } = drawTestCategory(
			page,
			category,
			groupedTests[category],
			x,
			y,
			customFont,
			selectedTests
		));
	});

	const otherTests = getOtherTests(
		allTests,
		referralTests,
		hasSampleCollection
	);
	if (otherTests.length > 0) {
		({ x, y } = drawOtherTestsSection(
			page,
			otherTests,
			x,
			y,
			customFont,
			selectedTests
		));
	}

	drawHeader(page, customFont);
	drawPatientInfo(page, formData, getDateOfBirthFromPesel);
	drawFooter(
		page,
		formData,
		hasSampleCollection,
		getCurrentDateTime,
		getCurrentDate
	);

	return page;
}
