import React from "react";
import styles from "../../css/shared/CheckboxSM.module.scss";
import { PropTypes } from "prop-types";

const CheckboxSM = ({
	label,
	name,
	id,
	val,
	handleCheckbox,
	isDisabled = false,
	addStrike = false,
	customTxt,
}) => {
	return (
		<div className={styles.CheckboxSM}>
			<input
				type="checkbox"
				name={name}
				id={id}
				value={val}
				checked={val}
				onChange={handleCheckbox}
				className={styles.CheckboxSM_checkbox}
				disabled={isDisabled}
			/>
			<label
				aria-labelledby={id}
				htmlFor={id}
				className={
					val && addStrike
						? `${styles.CheckboxSM_label} ${styles.strike}`
						: styles.CheckboxSM_label
				}
				style={customTxt}
			>
				{label}
			</label>
		</div>
	);
};

export default CheckboxSM;

CheckboxSM.defaultProps = {
	defaultChecked: false,
	isDisabled: false,
	addStrike: false,
};

CheckboxSM.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	val: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	handleCheckbox: PropTypes.func.isRequired,
	// extra settings
	isDisabled: PropTypes.bool,
	addStrike: PropTypes.bool,
	customTxt: PropTypes.object,
};
