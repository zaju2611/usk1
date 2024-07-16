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

export default TestsList;
