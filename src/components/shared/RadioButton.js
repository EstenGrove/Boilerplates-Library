import React from "react";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/RadioButton.module.scss";

const RadioButton = ({
	label,
	name,
	id,
	val,
	handleSelection,
	handleRadio,
}) => {
	return (
		<section className={styles.RadioButton}>
			<input
				type="radio"
				name={name}
				id={id}
				checked={val}
				onChange={handleRadio}
				onClick={!handleSelection ? null : () => handleSelection(id)}
				className={styles.RadioButton_radio}
			/>
			<label htmlFor={id} className={styles.RadioButton_label} tabIndex={1}>
				{label}
			</label>
		</section>
	);
};

export default RadioButton;

RadioButton.defaultProps = {};
RadioButton.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	val: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
	handleSelection: PropTypes.func, // used for radio button groups
	handleRadio: PropTypes.func, // used for single radio buttons
};
