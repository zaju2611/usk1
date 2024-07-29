import Tests from "../../components/TestsList/TestsList";

export default function Prices({ tests }) {
	return (
		<div>
			<div className>
				<h1>Cennik badań</h1>
				<Tests tests={tests} />
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	const res = await fetch("https://usk1.vercel.app//api/tests");
	const data = await res.json();

	return {
		props: {
			tests: data.tests,
		},
	};
}
