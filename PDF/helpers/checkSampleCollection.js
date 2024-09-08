export default function checkSampleCollection(selectedTests) {
	return Object.values(selectedTests).some(
		(test) => test.value === "Pobranie materiału"
	);
}
