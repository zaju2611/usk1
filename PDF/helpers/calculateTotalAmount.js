export default function calculateTotalAmount(
	categoryTotals,
	hasSampleCollection
) {
	const totalCategoryTotals = Object.values(categoryTotals).reduce(
		(total, amount) => total + amount,
		0
	);
	return hasSampleCollection ? totalCategoryTotals + 7.0 : totalCategoryTotals;
}
