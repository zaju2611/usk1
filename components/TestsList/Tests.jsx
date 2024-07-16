import TestsList from "./TestsList";

function Tests({ tests }) {
	return (
		<section>
			<TestsList tests={tests} />
		</section>
	);
}

export default Tests;
