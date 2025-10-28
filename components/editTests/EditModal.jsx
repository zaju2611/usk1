import React, { useState, useEffect } from "react";
import classes from "./EditModal.module.css";

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
					/>

					<label htmlFor="price">Cena:</label>
					<input
						id="price"
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>

					<label htmlFor="type">Kategoria:</label>
					<select
						id="type"
						className={classes.select}
						value={type}
						onChange={(e) => setType(e.target.value)}>
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
