import React, { useState } from "react";
import classes from "./EditModal.module.css";
import Select from "react-select";

export default function AddModal({ tests, onClose, refetch }) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [type, setType] = useState("");

	const categories = Array.from(
		new Set(tests.map((t) => t.type).filter(Boolean))
	);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newTest = {
			name,
			price: Number(price),
			type,
		};

		try {
			const response = await fetch("/api/addTests", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newTest),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Nie udało się dodać testu");
			}

			setName("");
			setPrice("");
			setType("");

			onClose();
			refetch();
		} catch (error) {
			console.error("Adding test failed:", error);
			alert(error.message);
		}
	};

	return (
		<div className={classes.overlay}>
			<div className={classes.modal}>
				<h2>Dodaj badanie</h2>
				<form onSubmit={handleSubmit}>
					<label htmlFor="name">Nazwa:</label>
					<input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className={classes.fontSize}
					/>

					<label htmlFor="price">Cena:</label>
					<input
						id="price"
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
						className={classes.fontSize}
					/>
					<label htmlFor="type">Kategoria:</label>
					<Select
						inputId="type"
						classNamePrefix="react-select"
						options={categories.map((cat) => ({ value: cat, label: cat }))}
						value={categories
							.map((cat) => ({ value: cat, label: cat }))
							.find((opt) => opt.value === type)}
						onChange={(selected) => setType(selected ? selected.value : "")}
						placeholder="Wybierz kategorię"
						isSearchable={false}
						required
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
