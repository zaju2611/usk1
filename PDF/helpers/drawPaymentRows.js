import { rgb } from "pdf-lib";
import checkSampleCollection from "./checkSampleCollection";
import calculateCategoryTotals from "./calculateCategoryTotals";
import calculateTotalAmount from "./calculateTotalAmount";
import drawFinalPaymentRows from "./drawFinalPaymentRows";
import { drawTableRow } from "./drawTable";
import drawPatientTestRow from "./drawPatientTestRow";

import { INITIAL_Y, ROW_TABLE_WIDTH } from "../data/constants";

export default function drawPaymentRows(
	page,
	formData,
	selectedTests,
	getCurrentDate
) {
	const hasSampleCollection = checkSampleCollection(selectedTests);
	const headerText = hasSampleCollection ? "+ 7 zł pobranie" : "";
	page.drawText(headerText, { x: 465, y: 320, color: rgb(0, 0, 0) });

	const categoryTotals = calculateCategoryTotals(selectedTests);
	let currentTableY = INITIAL_Y - 2 * ROW_TABLE_WIDTH;

	drawPatientTestRow(page, formData, currentTableY + 25);

	Object.entries(categoryTotals).forEach(
		([categoryName, totalPrice], index) => {
			currentTableY = drawTableRow(
				page,
				{ categoryName, totalPrice },
				index,
				currentTableY
			);
		}
	);

	const totalAmount = calculateTotalAmount(categoryTotals, hasSampleCollection);
	page.drawText(`Data: ${getCurrentDate()}`, {
		x: 75,
		y: currentTableY + 10,
		color: rgb(0, 0, 0),
	});
	page.drawText(`Suma: ${totalAmount.toFixed(2)} zł`, {
		x: 470,
		y: currentTableY + 10,
		color: rgb(0, 0, 0),
	});

	drawFinalPaymentRows(page, currentTableY);
}
