import { getTests } from "../../api/tests";

function TestsList({ tests }) {
	return (
		<ul>
			{tests.map((test) => (
				<li key={test._id}>
					<p>{test.name}</p>
				</li>
			))}
		</ul>
	);
}

export async function getServerSideProps() {
	const tests = await getTests();
	return {
		props: {
			tests,
		},
	};
}

export default TestsList;
