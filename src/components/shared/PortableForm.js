import React from "react";
import styles from "../../css/shared/PortableForm.module.scss";
import { PropTypes } from "prop-types";

const PortableForm = ({
	title,
	handleChange,
	handleCheckbox,
	handleBlur,
	isDisabled = false,
	enable,
	customStyles = {},
	children
}) => {
	const withEventHandlers = React.Children.map(children, child => {
		return React.cloneElement(child, {
			handleBlur: handleBlur,
			handleCheckbox: handleCheckbox,
			handleChange: handleChange
		});
	});

	return (
		<form className={styles.PortableForm} style={customStyles}>
			<h2 className={styles.PortableForm_title}>{title}</h2>
			<fieldset className={styles.PortableForm_fieldset} disabled={isDisabled}>
				{withEventHandlers}
			</fieldset>
			<div
				className={styles.PortableForm_isDisabled}
				title="Click to enable form"
				onClick={enable}
			>
				{isDisabled ? "Enable" : ""}
			</div>
		</form>
	);
};

export default PortableForm;

PortableForm.defaultProps = {
	isDisabled: false,
	customStyles: {}
};

PortableForm.propTypes = {
	title: PropTypes.string,
	isDisabled: PropTypes.bool,
	handleBlur: PropTypes.func,
	handleChange: PropTypes.func,
	handleCheckbox: PropTypes.func,
	customStyles: PropTypes.object,
	children: PropTypes.any
};
