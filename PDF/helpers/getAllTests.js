export default function getAllTests(selectedTests) {
	return selectedTests.map((test) => ({
		id: test.id,
		label: test.label,
		value: test.value,
		type: test.type,
	}));
}
