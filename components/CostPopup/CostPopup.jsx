import classes from "../GlucosePopup/Glucose.module.css";
export default function CostPopup({ onClose, onConfirm }) {
	const handleOverlayClick = (event) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	return (
		<div className={classes.popupOverlay} onClick={handleOverlayClick}>
			<div className={classes.popup}>
				<div className={classes.popupContent}>
					<h3>Czy chcesz doliczyć koszt pobrania?</h3>
					<div className={classes.popupActions}>
						<button
							onClick={() => onConfirm(true)}
							className={classes.okButton}>
							Tak
						</button>
						<button
							onClick={() => onConfirm(false)}
							className={classes.okButton}>
							Nie
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
