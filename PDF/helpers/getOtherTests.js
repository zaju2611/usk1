export default function getOtherTests(
	allTests,
	referralTests,
	hasSampleCollection
) {
	return allTests.filter(
		(test) =>
			!referralTests.some((refTest) => refTest.value === test.value) && !hasSampleCollection
			// (!hasSampleCollection || test.value !== "Pobranie materiału")
	);
}
