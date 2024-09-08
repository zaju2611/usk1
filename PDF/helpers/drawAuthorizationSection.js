import { rgb } from "pdf-lib";

import {
	drawHeader,
	drawPatientInfo,
	drawAuthorizedPersonInfo,
	drawFooter,
} from "./drawAuthorization";

export default function drawAuthorizationSection(
	page,
	formData,
	getCurrentDate
) {
	if (formData.authorization) {
		page.drawText("Upoważnienie do odbioru wyników badań.", {
			x: 300,
			y: 740,
			color: rgb(0, 0, 0),
		});
		drawHeader(page, 300, 810);
		drawPatientInfo(page, formData, 300, 720, "authorizing");
		drawAuthorizedPersonInfo(page, formData, 300, 675);
		drawFooter(page, 300, 615, getCurrentDate, "authorizing");
	}
}
