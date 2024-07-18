import { useState } from "react";
import Select from "react-select";

export default function TestGenerator({ tests }) {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		pesel: "",
		phoneNumber: "",
		selectedTests: [],
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleTestChange = (selectedOption) => {
		setFormData((prevState) => ({
			...prevState,
			selectedTests: selectedOption
				? selectedOption.map((option) => option.value)
				: [],
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form data", formData);
	};

	const availableTests = tests.map((test) => ({
		value: test.name,
		label: test.name,
	}));

	return (
		<div>
			<div className="central">
				<h1>Generator skierowań</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="firstName">Imię</label>
						<input
							type="text"
							id="firstName"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label htmlFor="lastName">Nazwisko</label>
						<input
							type="text"
							id="lastName"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label htmlFor="pesel">Pesel</label>
						<input
							type="text"
							id="pesel"
							name="pesel"
							value={formData.pesel}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label htmlFor="phoneNumber">Numer telefonu</label>
						<input
							type="text"
							id="phoneNumber"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label htmlFor="tests">Wybierz badania</label>
						<Select
							id="tests"
							name="tests"
							options={availableTests}
							isMulti
							onChange={handleTestChange}
							placeholder="Wybierz badanie"
						/>
					</div>
					<button type="submit">Generuj</button>
				</form>
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	const res = await fetch("http://localhost:3000/api/tests");
	const data = await res.json();

	return {
		props: {
			tests: data.tests,
		},
	};
}
