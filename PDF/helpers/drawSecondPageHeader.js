import { rgb } from "pdf-lib";
import { drawHeader } from "./drawAuthorization";

export default function drawSecondPageHeader(page) {
	page.drawText("Upoważnienie do odbioru wyników badań.", {
		x: 30,
		y: 740,
		color: rgb(0, 0, 0),
	});
	drawHeader(page, 30, 810);
}
