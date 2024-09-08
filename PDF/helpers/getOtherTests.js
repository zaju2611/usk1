export default function getOtherTests(
	allTests,
	referralTests,
	hasSampleCollection
) {
	return allTests.filter(
		(test) =>
			!referralTests.some((refTest) => refTest.value === test.value) &&
			(!hasSampleCollection || test.value !== "Pobranie materiału")
	);
}
