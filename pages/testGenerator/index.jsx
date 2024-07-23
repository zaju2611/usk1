import { useState } from "react";
import Form from "../../components/Form/Form";

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
				? selectedOption.map((option) => ({
						value: option.value,
						price: option.price,
						type: option.type,
				  }))
				: [],
		}));
	};

	const resetForm = () => {
		setFormData({
			firstName: "",
			lastName: "",
			pesel: "",
			phoneNumber: "",
		});
	};

	const availableTests = tests.map((test) => ({
		value: test.name,
		label: test.name,
		price: test.price,
		type: test.type,
	}));

	return (
		<div>
			<div>
				<h1>Generator skierowań</h1>
				<Form
					formData={formData}
					handleChange={handleChange}
					handleTestChange={handleTestChange}
					availableTests={availableTests}
					resetForm={resetForm}
				/>
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
