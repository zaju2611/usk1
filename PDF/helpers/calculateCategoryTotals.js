import { categories } from "../data/categories";
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
		const { type: categoryName, price } = test;
		if (categoryPriceMap.hasOwnProperty(categoryName)) {
			categoryTotals[categoryName] += price;
		}
	});

	return categoryTotals;
}
