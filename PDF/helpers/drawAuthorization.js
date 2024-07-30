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

export const drawPatientInfo = (page, formData, x, y) => {
	page.drawText(`Pacjent: ${formData.firstName} ${formData.lastName}`, {
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
	page.drawText("Upoważniam", {
		x,
		y,
		color: rgb(0, 0, 0),
	});
	page.drawText(
		`Osoba upoważniona: ${formData.firstNameAuthorized} ${formData.lastNameAuthorized}`,
		{
			x,
			y: y - 15,
			color: rgb(0, 0, 0),
		}
	);
	page.drawText(`PESEL osoby upoważnionej: ${formData.peselAuthorized}`, {
		x,
		y: y - 30,
		color: rgb(0, 0, 0),
	});
};

export const drawFooter = (page, x, y, getCurrentDate) => {
	page.drawText(`Data: `, {
		x,
		y,
		color: rgb(0, 0, 0),
	});
	page.drawText(`Podpis os. pobierającej: `, {
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
	// Filtrujemy testy, aby wykluczyć te z wartością "Pobranie materiału"
	const filteredTests = tests.filter(
		(test) => test.value !== "Pobranie materiału"
	);

	// Mapujemy wartości i łączymy je w jeden string
	return filteredTests.map((test) => test.value).join(", ");
};
