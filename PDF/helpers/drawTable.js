import { PAGE_WIDTH, ROW_TABLE_WIDTH } from "../data/constants";
import { rgb } from "pdf-lib";

const drawTableHeaders = (page) => {
	page.drawRectangle({
		x: 30,
		y: 360,
		width: PAGE_WIDTH - 60,
		height: 60,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawText("Lp.", {
		x: 35,
		y: 345,
		color: rgb(0, 0, 0),
	});
	page.drawText("Imię i Nazwisko Pacjenta", {
		x: 75,
		y: 345,
		color: rgb(0, 0, 0),
	});
	page.drawText("Kwota badania", {
		x: 470,
		y: 345,
		color: rgb(0, 0, 0),
	});
	page.drawRectangle({
		x: 30,
		y: 335,
		width: 30,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawRectangle({
		x: 60,
		y: 335,
		width: 400,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawRectangle({
		x: 460,
		y: 335,
		width: PAGE_WIDTH - 490,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
};

const drawTableRow = (page, rowData, index, currentY) => {
	page.drawText((index + 1).toString(), {
		x: 40,
		y: currentY + 10,
		color: rgb(0, 0, 0),
	});
	page.drawText(rowData.categoryName, {
		x: 75,
		y: currentY + 10,
		color: rgb(0, 0, 0),
	});
	page.drawText(rowData.totalPrice.toFixed(2), {
		x: 470,
		y: currentY + 10,
		color: rgb(0, 0, 0),
	});
	page.drawRectangle({
		x: 30,
		y: currentY + 5,
		width: 30,
		height: ROW_TABLE_WIDTH,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawRectangle({
		x: 60,
		y: currentY + 5,
		width: 400,
		height: ROW_TABLE_WIDTH,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawRectangle({
		x: 460,
		y: currentY + 5,
		width: PAGE_WIDTH - 490,
		height: ROW_TABLE_WIDTH,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	return currentY - ROW_TABLE_WIDTH;
};

export { drawTableHeaders, drawTableRow };
