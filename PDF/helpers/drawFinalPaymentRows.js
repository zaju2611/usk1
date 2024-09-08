import { rgb } from "pdf-lib";
import { ROW_TABLE_WIDTH, PAGE_WIDTH } from "../data/constants";

export default function drawFinalPaymentRows(page, currentTableY) {
	page.drawRectangle({
		x: 30,
		y: currentTableY + 5,
		width: 30,
		height: ROW_TABLE_WIDTH,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawRectangle({
		x: 60,
		y: currentTableY + 5,
		width: 400,
		height: ROW_TABLE_WIDTH,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawRectangle({
		x: 460,
		y: currentTableY + 5,
		width: PAGE_WIDTH - 490,
		height: ROW_TABLE_WIDTH,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
}
