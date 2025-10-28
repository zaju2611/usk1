import React, { useState, useEffect } from "react";
import classes from "./EditModal.module.css"; // używamy tego samego CSS

export default function AddModal({ tests, onClose, refetch }) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [type, setType] = useState("");

	const categories = Array.from(
		new Set(tests.map((t) => t.type).filter(Boolean))
	);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Walidacja podstawowa
		if (!name || !price || !type) {
			alert("Proszę wypełnić wszystkie pola!");
			return;
		}

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
					/>

					<label htmlFor="price">Cena:</label>
					<input
						id="price"
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>

					<label htmlFor="type">Kategoria:</label>
					<select
						id="type"
						className={classes.select}
						value={type}
						onChange={(e) => setType(e.target.value)}
						required>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>

					<div className={classes.actions}>
						<button type="submit">Zapisz</button>
						<button type="button" onClick={onClose}>
							Anuluj
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
