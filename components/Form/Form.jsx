import { useState } from "react";
import Select from "react-select";
import { generatePDF, downloadPDF } from "../../PDF/pdfGenerator";
import classes from "./Form.module.css";
import { referralTests } from "../../referralData";
import {
	getDateOfBirthFromPesel,
	getCurrentDateTime,
	getCurrentDate,
} from "../../helpers/helpers";
import { customStyles } from "../../styles/selectStyles";
import Authorized_person from "./Authorized_person";

const Form = ({
	formData,
	handleChange,
	handleTestChange,
	availableTests,
	resetForm,
}) => {
	const [selectedTests, setSelectedTests] = useState([]);
	const [isChecked, setIsChecked] = useState(false);
	const handleTestChangeInternal = (selectedOptions) => {
		setSelectedTests(selectedOptions);
		handleTestChange(selectedOptions);
	};

	const reset = () => {
		resetForm();
		setSelectedTests([]);
		setIsChecked(false);
	};

	const handleSubmitInternal = async (event) => {
		event.preventDefault();

		const pdfBytes = await generatePDF(
			formData,
			selectedTests,
			referralTests,
			getDateOfBirthFromPesel,
			getCurrentDateTime,
			getCurrentDate
		);

		downloadPDF(
			pdfBytes,
			`${formData.firstName}_${formData.lastName}_skierowanie.pdf`
		);

		reset();
	};

	const handleCheckboxChange = (event) => {
		setIsChecked(event.target.checked);
		handleChange({
			target: { name: "authorization", value: event.target.checked },
		});
	};

	return (
		<form onSubmit={handleSubmitInternal} className={classes.form}>
			<div className={classes.formGroup}>
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
			<div className={classes.formGroup}>
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
			<div className={classes.formGroup}>
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
			<div className={classes.formGroup}>
				<label htmlFor="phoneNumber">Numer telefonu</label>
				<input
					type="text"
					id="phoneNumber"
					name="phoneNumber"
					value={formData.phoneNumber}
					onChange={handleChange}
				/>
			</div>
			<div className={classes.formGroup}>
				<label htmlFor="tests">Wybierz badania</label>
				<Select
					id="tests"
					name="tests"
					options={availableTests}
					isMulti
					onChange={handleTestChangeInternal}
					placeholder="Wybierz badanie"
					styles={customStyles}
					value={selectedTests}
				/>
			</div>
			<div className={classes.checkboxContainer}>
				<input
					type="checkbox"
					id="authorization"
					name="authorization"
					value={formData.authorization}
					checked={isChecked}
					onChange={handleCheckboxChange}
				/>
				<label htmlFor="authorization">Upoważnienie do obioru badań</label>
			</div>
			{isChecked && (
				<Authorized_person formData={formData} handleChange={handleChange} />
			)}

			<div className={classes.buttonContainer}>
				<button type="submit" className={classes.submitButton}>
					Generuj
				</button>
			</div>
		</form>
	);
};

export default Form;
