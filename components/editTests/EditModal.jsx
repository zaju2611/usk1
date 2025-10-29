import React, { useState, useEffect } from "react";
import classes from "./EditModal.module.css";
import Select from "react-select";

export default function EditModal({ test, tests, onClose, refetch }) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [type, setType] = useState("");

	const categories = Array.from(
		new Set(tests.map((t) => t.type).filter(Boolean))
	);

	useEffect(() => {
		if (test) {
			setName(test.name || "");
			setPrice(test.price || "");
			setType(test.type || "");
		}
	}, [test]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const updatedTest = {
			...test,
			name,
			price: Number(price),
			type,
		};

		try {
			const response = await fetch("/api/updateTests", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedTest),
			});

			onClose();
			refetch();
		} catch (error) {
			console.error("Updating test failed:", error);
		}
	};

	if (!test) return null;

	return (
		<div className={classes.overlay}>
			<div className={classes.modal}>
				<h2>Edytuj badanie</h2>
				<form onSubmit={handleSubmit}>
					<label htmlFor="name">Nazwa:</label>
					<input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={classes.fontSize}
					/>

					<label htmlFor="price">Cena:</label>
					<input
						id="price"
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						className={classes.fontSize}
					/>

					<label htmlFor="type">Kategoria:</label>
					<Select
						inputId="type" // odpowiada za htmlFor="type"
						classNamePrefix="react-select" // potrzebny do stylów
						options={categories.map((cat) => ({ value: cat, label: cat }))}
						value={
							categories
								.map((cat) => ({ value: cat, label: cat }))
								.find((opt) => opt.value === type) || null
						}
						onChange={(selected) => setType(selected ? selected.value : "")}
						placeholder="Wybierz kategorię"
						isSearchable={false}
					/>

					<div className={classes.actions}>
						<button type="button" onClick={onClose}>
							Anuluj
						</button>
						<button type="submit">Zapisz</button>
					</div>
				</form>
			</div>
		</div>
	);
}
