import { useState } from "react";
import { Fragment } from "react";
import SearchBar from "../SearchBar/SearchBar";
import classes from "./TestsList.module.css";

function TestsList({ tests }) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredTests = tests.filter((test) =>
		test.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	const sortedTests = [...filteredTests].sort((a, b) =>
		a.type.localeCompare(b.type)
	);

	let currentType = null;

	return (
		<>
			<SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
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
									<td className={classes.colLp}>{index + 1}</td>
									<td className={classes.colName}>{test.name}</td>
									<td className={classes.colPrice}>{test.price}</td>
								</tr>
							</Fragment>
						);
					})}
				</tbody>
			</table>
		</>
	);
}

export default TestsList;
