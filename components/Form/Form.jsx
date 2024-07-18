import Select from "react-select";
import classes from "./Form.module.css";

const customStyles = {
	control: (provided) => ({
		...provided,
		width: 300,
	}),
	menuList: (provided) => ({
		...provided,
		maxHeight: 150,
	}),
};

const Form = ({
	formData,
	handleChange,
	handleTestChange,
	handleSubmit,
	availableTests,
}) => {
	return (
		<form onSubmit={handleSubmit} className={classes.form}>
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
					required
				/>
			</div>
			<div className={classes.formGroup}>
				<label htmlFor="tests">Wybierz badania</label>
				<Select
					id="tests"
					name="tests"
					options={availableTests}
					isMulti
					onChange={handleTestChange}
					placeholder="Wybierz badanie"
					styles={customStyles}
				/>
			</div>
			<div className="classes.buttonContainer">
				<button type="submit" className={classes.submitButton}>
					Generuj
				</button>
			</div>
		</form>
	);
};

export default Form;
