import React from "react";
import styles from "../../css/shared/NumberInput.module.scss";
import { PropTypes } from "prop-types";

const NumberInput = ({
	label,
	name,
	id,
	placeholder = "Only accepts numbers...",
	required = false,
	val,
	handleChange,
	handleBlur,
	handleFocus,
	handleReset,
	autoComplete = "off",
	addRequiredFlag = false,
	customStyles = {},
}) => {
	// validates number & handles onchange
	const changeHandler = (e) => {
		const { value } = e.target;
		if (isNaN(value)) return;
		return handleChange(e);
	};

	return (
		<div className={styles.NumberInput}>
			<label htmlFor={id} className={styles.NumberInput_label}>
				{label}
				{addRequiredFlag && (
					<div className={styles.NumberInput_requiredFlag}>*</div>
				)}
			</label>
			<input
				type="text"
				name={name}
				id={id}
				className={styles.NumberInput_input}
				placeholder={placeholder}
				required={required}
				value={val}
				onChange={changeHandler}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onReset={handleReset}
				style={customStyles}
				autoComplete={autoComplete}
			/>
		</div>
	);
};

export default NumberInput;

// #PropTypes
NumberInput.defaultProps = {
	required: false,
	addRequiredFlag: false,
	customStyles: {},
};

NumberInput.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	id: PropTypes.string,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	val: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleFocus: PropTypes.func,
	handleBlur: PropTypes.func,
	handleReset: PropTypes.func,
	addRequiredFlag: PropTypes.bool,
	customStyles: PropTypes.object,
};
