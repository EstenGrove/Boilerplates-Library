import React from "react";
import styles from "../../css/shared/Checkbox.module.scss";
import { PropTypes } from "prop-types";

const Checkbox = ({
	label,
	name,
	id,
	val,
	isDisabled = false,
	handleCheckbox,
	addStrike = false
}) => {
	return (
		<div className={styles.Checkbox}>
			<input
				value={val}
				type="checkbox"
				name={name}
				id={id}
				checked={val}
				className={styles.Checkbox_checkbox}
				onChange={handleCheckbox}
				disabled={isDisabled}
			/>
			<label
				htmlFor={id}
				className={
					val && addStrike
						? `${styles.Checkbox_label} ${styles.strike}`
						: styles.Checkbox_label
				}
			>
				{label}
			</label>
		</div>
	);
};
export default Checkbox;

Checkbox.defaultProps = {
	readOnly: false,
	isDisabled: false,
	addStrike: false
};

Checkbox.propTypes = {
	label: PropTypes.string,
	name: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired
	]),
	id: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired
	]),
	val: PropTypes.bool.isRequired,
	handleCheckbox: PropTypes.func.isRequired,
	addStrike: PropTypes.bool
};
