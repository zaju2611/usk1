import { categories } from "../data/categories";

const categoryMap = {
	"Badania hematologiczne": "Badania hematologiczne",
	"Hemostaza (osocze cytrynianowe)": "Hemostaza (osocze cytrynianowe)",
	"Chemia kliniczna (surowica)": "Chemia kliniczna (surowica)",
	"Chemia kliniczna (mocz)": "Chemia kliniczna (mocz)",
	"Immunochemia (surowica)": "Immunochemia (surowica)",
	"Immunochemia (osocze wersenianowe)": "Immunochemia (osocze wersenianowe)",
	"Markery Chorób Zakaźnych": "Markery Chorób Zakaźnych",
	"Białka specyficzne": "Białka specyficzne",
	"Analityka ogólna": "Analityka ogólna",
	"Płyn z jamy ciała - badania dodatkowe":
		"Płyn z jamy ciała - badania dodatkowe",
	"Test kasetkowy": "Test kasetkowy",
};

function mapCategory(dbCategory) {
	if (!dbCategory || typeof dbCategory !== "string") {
		return "";
	}

	const normalized = dbCategory.trim().toLowerCase();
	return categoryMap[normalized] || dbCategory;
}

export default function calculateCategoryTotals(selectedTests) {
	const categoryPriceMap = categories.reduce((map, category) => {
		map[category.name] = category.price;
		return map;
	}, {});

	const categoryTotals = categories.reduce((totals, category) => {
		totals[category.name] = 0;
		return totals;
	}, {});

	selectedTests.forEach((test) => {
		const mappedCategory = mapCategory(test.type);
		const { price } = test;

		if (categoryTotals.hasOwnProperty(mappedCategory)) {
			categoryTotals[mappedCategory] += price;
		} else {
			console.warn(`Nieznana kategoria: ${test.type}`);
		}
	});

	return categoryTotals;
}
