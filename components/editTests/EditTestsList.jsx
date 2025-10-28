import { useState, Fragment } from "react";
import Icon from "@mdi/react";
import { mdiPencil, mdiDelete, mdiPlus } from "@mdi/js";
import classes from "../../components/TestsList/TestsList.module.css";

import SearchBar from "@/components/SearchBar/SearchBar";
import EditModal from "./EditModal";
import ConfirmDeleteModal from "./DeleteModal";
import AddModal from "./AddModal";

export default function EditTestsList({ tests }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteTest, setDeleteTest] = useState(null);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [initialTests, setInitialTests] = useState(tests);
	const filteredTests = initialTests.filter((test) =>
		test.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	const sortedTests = [...filteredTests].sort((a, b) =>
		a.type.localeCompare(b.type)
	);

	let currentType = null;

	const [selectedTest, setSelectedTest] = useState(null);

	const handleEdit = (test) => {
		setSelectedTest(test);
	};

	const handleCloseModal = () => {
		setSelectedTest(null);
	};

	const fetchTests = async () => {
		try {
			const res = await fetch("/api/tests");
			const data = await res.json();
			setInitialTests(data.tests);
		} catch (err) {
			console.error("Błąd pobierania testów:", err);
		}
	};

	const handleCloseDeleteModal = () => {
		setDeleteTest(null);
	};

	const handleDelete = async (test) => {
		try {
			const res = await fetch(`/api/tests/${test._id}`, {
				method: "DELETE",
			});

			if (!res.ok) throw new Error("Usuwanie nie powiodło się");
			fetchTests();
		} catch (err) {
			console.error("Błąd usuwania testu:", err);
		}
	};

	return (
		<div className={classes.wrapper}>
			<SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
			<button
				className={classes.buttonText}
				onClick={() => setAddModalOpen(true)}>
				<Icon path={mdiPlus} size={1} color="#0070f3" />
				<span>Dodaj badanie</span>
			</button>
			<table className={classes.table}>
				<thead>
					<tr>
						<th>Lp.</th>
						<th>Nazwa badania</th>
						<th>Cena</th>
						<th>Edycja</th>
						<th>Usuń</th>
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
										<td colSpan="5">
											<strong>{test.type}</strong>
										</td>
									</tr>
								)}
								<tr key={test._id}>
									<td className={classes.colLp}>{index + 1}</td>
									<td className={classes.colName}>{test.name}</td>
									<td className={classes.colPrice}>{test.price}</td>
									<td className={classes.colEdit}>
										<button
											className={`${classes.iconButton} ${classes.noBorder}`}
											onClick={() => handleEdit(test)}>
											<Icon path={mdiPencil} size={1} color="#0070f3" />
										</button>
									</td>
									<td className={classes.colDelete}>
										<button
											className={`${classes.iconButton} ${classes.noBorder}`}
											onClick={() => setDeleteTest(test)}>
											<Icon path={mdiDelete} size={1} color="#d11a2a" />
										</button>
									</td>
								</tr>
							</Fragment>
						);
					})}
				</tbody>
			</table>
			{selectedTest && (
				<EditModal
					test={selectedTest}
					onClose={handleCloseModal}
					tests={initialTests}
					refetch={fetchTests}
				/>
			)}
			{deleteTest && (
				<ConfirmDeleteModal
					itemName={deleteTest.name}
					onConfirm={handleDelete}
					onClose={handleCloseDeleteModal}
					deleteTest={deleteTest}
				/>
			)}
			{addModalOpen && (
				<AddModal
					tests={initialTests}
					onClose={() => setAddModalOpen(false)}
					refetch={fetchTests}
				/>
			)}
		</div>
	);
}
