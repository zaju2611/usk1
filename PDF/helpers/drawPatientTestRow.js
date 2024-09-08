import { rgb } from "pdf-lib";
import { PAGE_WIDTH } from "../data/constants";
export default function drawPatientTestRow(page, formData, yPosition) {
	page.drawRectangle({
		x: 30,
		y: yPosition,
		width: 30,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawRectangle({
		x: 60,
		y: yPosition,
		width: 400,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});
	page.drawRectangle({
		x: 460,
		y: yPosition,
		width: PAGE_WIDTH - 490,
		height: 25,
		borderColor: rgb(0, 0, 0),
		borderWidth: 1,
	});

	page.drawText(`${formData.firstName} ${formData.lastName}`, {
		x: 75,
		y: yPosition + 8,
		color: rgb(0, 0, 0),
	});
}
