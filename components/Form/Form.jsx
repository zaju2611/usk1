import { useState, useEffect } from "react";
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
import GlucosePopup from "../GlucosePopup/Glucose";
import calculateTotalAmount from "@/PDF/helpers/calculateTotalAmount";
import CostPopup from "../CostPopup/CostPopup";

const Form = ({
	formData,
	handleChange,
	handleTestChange,
	availableTests,
	resetForm,
}) => {
	const [selectedTests, setSelectedTests] = useState([]);
	const [isChecked, setIsChecked] = useState(false);
	const [glucoseTestDraws, setGlucoseTestDraws] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [totalAmount, setTotalAmount] = useState(0);
	const [showDownloadPopup, setShowDownloadPopup] = useState(false);

	const handleTestChangeInternal = (selectedOptions) => {
		setSelectedTests(selectedOptions);
		handleTestChange(selectedOptions);
	};

	useEffect(() => {
		const categoryTotals = selectedTests.reduce((totals, test) => {
			totals[test.label] =
				test.price *
				(test.label.includes("Test tolerancji glukozy") ? glucoseTestDraws : 1);
			return totals;
		}, {});

		const hasSampleCollectionTest = selectedTests.some((test) =>
			[
				"Test tolerancji glukozy (75g)",
				"Test tolerancji glukozy u ciężarnej (75g)",
			].includes(test.label)
		);

		const totalCost = calculateTotalAmount(
			categoryTotals,
			hasSampleCollectionTest
		);

		setTotalAmount(totalCost);
	}, [selectedTests, glucoseTestDraws]);

	const reset = () => {
		resetForm();
		setSelectedTests([]);
		setIsChecked(false);
		setGlucoseTestDraws(1);
		setShowDownloadPopup(false);
	};

	const handleSubmitInternal = async (event) => {
		event.preventDefault();

		const isGlucoseTestSelected = selectedTests.some((option) =>
			[
				"Test tolerancji glukozy (75g) (doustny test obciążenia glukozą)",
				"Test tolerancji glukozy u ciężarnej (75g) (doustny test obciążenia glukozą)",
			].includes(option.label)
		);

		if (isGlucoseTestSelected) {
			setShowPopup(true);
			return;
		}

		setShowDownloadPopup(true);
	};

	const generateAndDownloadPDF = async (updatedTests) => {
		const finalSelectedTests = updatedTests.map((test) => {
			if (test.label.includes("Test tolerancji glukozy")) {
				return {
					...test,
					price: test.price * glucoseTestDraws,
				};
			}
			return test;
		});

		const pdfBytes = await generatePDF(
			formData,
			finalSelectedTests,
			referralTests,
			getDateOfBirthFromPesel,
			getCurrentDateTime,
			getCurrentDate
		);

		downloadPDF(
			pdfBytes,
			`${formData.firstName}_${formData.lastName}_skierowanie.pdf`
		);
	};

	const handleCheckboxChange = (event) => {
		setIsChecked(event.target.checked);
		handleChange({
			target: { name: "authorization", value: event.target.checked },
		});
	};

	const handlePopupClose = async () => {
		setShowPopup(false);
	};

	const handlePopupConfirm = async () => {
		setShowPopup(false);
		setShowDownloadPopup(true);
	};

	const handleCostPopupConfirm = async (addSampleCollection) => {
		let updatedTests = [...selectedTests];
		if (addSampleCollection) {
			updatedTests.push({
				label: "Pobranie materiału",
				price: 7,
				value: "Pobranie materiału",
			});
		}
		handleTestChangeInternal(updatedTests);

		await generateAndDownloadPDF(updatedTests);

		reset();
	};

	return (
		<>
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
				<div className={classes.costContainer}>
					<p className={classes.costText}>Koszt badań: {totalAmount} zł</p>
				</div>
				<div className={classes.buttonContainer}>
					<button type="submit" className={classes.submitButton}>
						Generuj
					</button>
				</div>
			</form>

			{showPopup && (
				<GlucosePopup
					glucoseTestDraws={glucoseTestDraws}
					setGlucoseTestDraws={setGlucoseTestDraws}
					onClose={handlePopupClose}
					onConfirm={handlePopupConfirm}
				/>
			)}

			{showDownloadPopup && (
				<CostPopup
					onClose={() => setShowDownloadPopup(false)}
					onConfirm={handleCostPopupConfirm}
				/>
			)}
		</>
	);
};

export default Form;
