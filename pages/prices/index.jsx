import Tests from "../../components/TestsList/TestsList";

export default function Prices({ tests }) {
	return (
		<div>
			<div className="central">
				<h1>Prices</h1>
				<Tests tests={tests} />
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	const res = await fetch("http://localhost:3001/api/tests");
	const data = await res.json();

	return {
		props: {
			tests: data.tests,
		},
	};
}
