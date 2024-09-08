export default function getAllTests(selectedTests) {
	return selectedTests.map((test) => ({
		label: test.label,
		value: test.value,
	}));
}
