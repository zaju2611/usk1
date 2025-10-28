import React from "react";
import classes from "./ConfirmDeleteModal.module.css";

export default function ConfirmDeleteModal({
	itemName,
	onConfirm,
	onClose,
	deleteTest,
}) {
	return (
		<div className={classes.overlay}>
			<div className={classes.modal}>
				<h2>Potwierdzenie usunięcia</h2>
				<p>{`Czy na pewno chcesz usunąć badanie - ${itemName} ?`}</p>
				<div className={classes.actions}>
					<button className={classes.cancelButton} onClick={onClose}>
						Anuluj
					</button>
					<button
						className={classes.confirmButton}
						onClick={async () => {
							await onConfirm(deleteTest);
							onClose();
						}}>
						Tak, usuń
					</button>
				</div>
			</div>
		</div>
	);
}
