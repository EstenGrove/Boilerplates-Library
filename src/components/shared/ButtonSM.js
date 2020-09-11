import React from "react";
import styles from "../../css/shared/ButtonSM.module.scss";
import { PropTypes } from "prop-types";

const ButtonSM = ({
	isDisabled = false,
	handleClick,
	handleSubmit,
	children,
	customStyles,
	title,
	type = "button",
}) => {
	return (
		<button
			type={type}
			className={styles.ButtonSM}
			disabled={isDisabled}
			onClick={handleClick}
			onSubmit={handleSubmit}
			style={customStyles}
			title={title}
		>
			{children}
		</button>
	);
};

export default ButtonSM;

ButtonSM.defaultProps = {
	isDisabled: false,
	type: "button",
};

ButtonSM.propTypes = {
	type: PropTypes.string,
	isDisabled: PropTypes.bool,
	handleClick: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func,
	children: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
		PropTypes.string,
	]),
	customStyles: PropTypes.object,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
