import { rgb } from "pdf-lib";

export const drawHeader = (page, x, y) => {
	page.drawText("Dział Diagnostyki Laboratoryjnej USK Nr 1", {
		x,
		y,
		color: rgb(0, 0, 0),
	});
	page.drawText("20-841 Lublin ul. Al. Solidarności 8", {
		x,
		y: y - 15,
		color: rgb(0, 0, 0),
	});
	page.drawText("(wejście od ul. Staszica 16)", {
		x,
		y: y - 30,
		color: rgb(0, 0, 0),
	});
	page.drawText("tel. (81)-532-38-16", {
		x,
		y: y - 45,
		color: rgb(0, 0, 0),
	});
};

export const drawPatientInfo = (page, formData, x, y, signatureType) => {
	let signatureText = `Pacjent: ${formData.firstName} ${formData.lastName}`;
	if (signatureType === "authorizing") {
		signatureText = `Ja pacjent: ${formData.firstName} ${formData.lastName}`;
	}
	page.drawText(signatureText, {
		x,
		y,
		color: rgb(0, 0, 0),
	});
	page.drawText(`PESEL: ${formData.pesel}`, {
		x,
		y: y - 15,
		color: rgb(0, 0, 0),
	});
};

export const drawAuthorizedPersonInfo = (page, formData, x, y) => {
	page.drawText(
		`Upoważniam ${formData.firstNameAuthorized} ${formData.lastNameAuthorized}`,
		{
			x,
			y,
			color: rgb(0, 0, 0),
		}
	);

	page.drawText(`PESEL: ${formData.peselAuthorized}`, {
		x,
		y: y - 15,
		color: rgb(0, 0, 0),
	});
	page.drawText(`Do odbioru moich wyników badań.`, {
		x,
		y: y - 30,
		color: rgb(0, 0, 0),
	});
};

export const drawFooter = (page, x, y, getCurrentDate, signatureType) => {
	page.drawText(`Data: `, {
		x,
		y,
		color: rgb(0, 0, 0),
	});

	let signatureText = `Podpis os. pobierającej: `;
	if (signatureType === "authorizing") {
		signatureText = `Podpis os. upoważniającej: `;
	}

	page.drawText(signatureText, {
		x: x + 130,
		y,
		color: rgb(0, 0, 0),
	});

	page.drawText(`${getCurrentDate()}`, {
		x,
		y: y - 15,
		color: rgb(0, 0, 0),
	});
	page.drawText(`............................................`, {
		x: x + 130,
		y: y - 15,
		color: rgb(0, 0, 0),
	});

	page.drawText("Wyniki badań odbierane są w laboratorium po", {
		x,
		y: y - 45,
		color: rgb(0, 0, 0),
	});
	page.drawText("okazaniu dowodu osobistego i dokumentu", {
		x,
		y: y - 60,
		color: rgb(0, 0, 0),
	});
	page.drawText("zapłaty", {
		x,
		y: y - 75,
		color: rgb(0, 0, 0),
	});
};

export const formatTestNames = (tests) => {
	const filteredTests = tests.filter(
		(test) => test.value !== "Pobranie materiału"
	);

	return filteredTests.map((test) => test.value).join(", ");
};
