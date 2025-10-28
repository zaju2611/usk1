import { useLoading } from "../../context/LoadingContext";
import { useEffect } from "react";
import EditTestsList from "./EditTestsList";

export default function EditTests({ tests }) {
	const { setLoading } = useLoading();

	console.log(tests);

	useEffect(() => {
		setLoading(false);
	}, [setLoading]);

	return (
		<div>
			<div className>
				<h1>Edytuj badania</h1>
				<EditTestsList tests={tests} />
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	const res = await fetch(`${process.env.API_URL}/api/tests`);
	const data = await res.json();

	return {
		props: {
			tests: data.tests,
		},
	};
}
