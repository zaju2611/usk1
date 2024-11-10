import { useEffect } from "react";
import classes from "../GlucosePopup/Glucose.module.css";

const GlucosePopup = ({
	glucoseTestDraws,
	setGlucoseTestDraws,
	onClose,
	onConfirm,
}) => {
	useEffect(() => {
		setGlucoseTestDraws(1);
	}, [setGlucoseTestDraws]);

	const handleOverlayClick = (event) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};
	return (
		<div className={classes.popupOverlay} onClick={handleOverlayClick}>
			<div className={classes.popup}>
				<h2>Liczba pobrań</h2>
				<input
					type="number"
					value={glucoseTestDraws}
					onChange={(e) => setGlucoseTestDraws(e.target.value)}
					min="1"
					max="5"
					required
				/>
				<div className={classes.buttonContainer}>
					<button onClick={onConfirm} className={classes.okButton}>
						OK
					</button>
				</div>
			</div>
		</div>
	);
};

export default GlucosePopup;
