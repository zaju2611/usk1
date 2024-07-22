export const getDateOfBirthFromPesel = (pesel) => {
	const year = parseInt(pesel.slice(0, 2), 10);
	let month = parseInt(pesel.slice(2, 4), 10);
	const day = parseInt(pesel.slice(4, 6), 10);

	let fullYear = year + 1900; // years 1900-1999

	if (month > 20) {
		fullYear += 100; // years 2000-2099
		month -= 20;
	} else if (month > 0) {
		// years 1900-1999
	} else {
		// wrong date
		return "Niepoprawny PESEL";
	}

	return `${day.toString().padStart(2, "0")}.${month
		.toString()
		.padStart(2, "0")}.${fullYear}`;
};

export const getCurrentDateTime = () => {
	const now = new Date();
	const day = now.getDate().toString().padStart(2, "0");
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	const year = now.getFullYear();
	const hours = now.getHours().toString().padStart(2, "0");
	const minutes = now.getMinutes().toString().padStart(2, "0");

	return `${day}.${month}.${year} ${hours}.${minutes}`;
};

export const getCurrentDate = () => {
	const now = new Date();
	const day = now.getDate().toString().padStart(2, "0");
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	const year = now.getFullYear();

	return `${day}.${month}.${year}`;
};
