import { Fragment } from "react";

import classes from "./TestsList.module.css";

function TestsList({ tests }) {
	const sortedTests = [...tests].sort((a, b) => a.type.localeCompare(b.type));

	let currentType = null;

	return (
		<table className={classes.table}>
			<thead>
				<tr>
					<th>Lp.</th>
					<th>Nazwa badania</th>
					<th>Cena</th>
				</tr>
			</thead>
			<tbody>
				{sortedTests.map((test, index) => {
					const typeChanged = currentType !== test.type;
					currentType = test.type;

					return (
						<Fragment key={test._id}>
							{typeChanged && (
								<tr
									key={`category-${test.type}`}
									className={classes.categoryRow}>
									<td colSpan="3">
										<strong>{test.type}</strong>
									</td>
								</tr>
							)}
							<tr key={test._id}>
								<td>{index + 1}</td>
								<td className={classes.testName}>{test.name}</td>
								<td>{test.price}</td>
							</tr>
						</Fragment>
					);
				})}
			</tbody>
		</table>
	);
}

export default TestsList;
