export default function groupTestsByCategory(referralTests) {
	return referralTests.reduce((groups, test) => {
		if (!groups[test.category]) groups[test.category] = [];
		groups[test.category].push(test);
		return groups;
	}, {});
}
