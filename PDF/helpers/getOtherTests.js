export default function getOtherTests(
	allTests,
	referralTests,
	hasSampleCollection
) {
	return allTests.filter(
		(test) =>
			!referralTests.some(
				(refTest) =>
					(refTest.id && test.id && refTest.id === test.id) ||
					(refTest.value && test.value && refTest.value === test.value)
			)
	);
}
