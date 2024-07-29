import classes from "./Form.module.css";

export default function Authorized_person({ formData, handleChange }) {
	return (
		<>
			<div className={classes.formGroup}>
				<label htmlFor="firstNameAuthorized">Imię osoby upoważnionej</label>
				<input
					type="text"
					id="firstNameAuthorized"
					name="firstNameAuthorized"
					value={formData.firstAuthorized}
					onChange={handleChange}
				/>
			</div>
			<div className={classes.formGroup}>
				<label htmlFor="lastNameAuthorized">Nazwisko osoby upoważnionej</label>
				<input
					type="text"
					id="lastNameAuthorized"
					name="lastNameAuthorized"
					value={formData.lastNameAuthorized}
					onChange={handleChange}
				/>
			</div>
			<div className={classes.formGroup}>
				<label htmlFor="peselAuthorized">Pesel osoby upoważnionej</label>
				<input
					type="text"
					id="peselAuthorized"
					name="peselAuthorized"
					value={formData.peselAuthorized}
					onChange={handleChange}
				/>
			</div>
		</>
	);
}
