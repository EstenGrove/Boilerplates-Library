import React, { useState, useEffect } from "react";
import styles from "../../css/shared/Textarea.module.scss";
import { PropTypes } from "prop-types";

const Textarea = ({
	label,
	id,
	name,
	placeholder,
	val = "",
	handleChange,
	handleBlur,
	required = false,
	maxChar = "none",
	readOnly = false,
	disabled = false,
	addRequiredFlag = false,
	enableCharCount = false,
	customStyles = {}
}) => {
	const [charCount, setCharCount] = useState(0);

	useEffect(() => {
		setCharCount(val.length);
	}, [val]);

	return (
		<div className={styles.Textarea}>
			<label htmlFor={id} className={styles.Textarea_label}>
				{label}
				{addRequiredFlag && (
					<div className={styles.Textarea_label_requiredFlag}>*</div>
				)}
			</label>
			<textarea
				value={val}
				name={name}
				id={id}
				disabled={disabled}
				readOnly={readOnly}
				placeholder={placeholder}
				onChange={handleChange}
				onBlur={handleBlur}
				className={styles.Textarea_input}
				maxLength={maxChar}
				required={required}
			/>
			{enableCharCount && (
				<div
					className={
						charCount === maxChar
							? styles.outOfChars
							: styles.Textarea_charCount
					}
				>{`${charCount} / ${maxChar}`}</div>
			)}
		</div>
	);
};
export default Textarea;

// props w/ default values
Textarea.defaultProps = {
	label: null,
	val: "",
	required: false,
	maxChar: "none",
	readOnly: false,
	disabled: false,
	addRequiredFlag: false,
	enableCharCount: false,
	customStyles: {}
};

Textarea.propTypes = {
	val: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	id: PropTypes.string,
	placeholder: PropTypes.string,
	handleBlur: PropTypes.func,
	required: PropTypes.bool,
	maxChar: PropTypes.number,
	readOnly: PropTypes.bool,
	disabled: PropTypes.bool,
	addRequiredFlag: PropTypes.bool,
	enableCharCount: PropTypes.bool,
	customStyles: PropTypes.object
};
