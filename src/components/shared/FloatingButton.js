import React from "react";
import styles from "../../css/shared/FloatingButton.module.scss";
import { PropTypes } from "prop-types";

// sizes, customizable via props
const sizes = {
	XSM: {
		width: "1.7rem",
		height: "1.7rem",
	},
	SM: {
		width: "2.5rem",
		height: "2.5rem",
	},
	MD: {
		width: "3rem",
		height: "3rem",
	},
	LG: {
		width: "4rem",
		height: "4rem",
	},
	XLG: {
		width: "5rem",
		height: "5rem",
	},
};

// page position, customizable via props
const positions = {
	"top-left": {
		top: "1rem",
		left: "1rem",
	},
	"top-right": {
		top: "1rem",
		right: "1rem",
	},
	"bottom-left": {
		bottom: "2rem",
		left: "2rem",
	},
	"bottom-right": {
		bottom: "1rem",
		right: "1rem",
	},
	"mobile-bottom-left": {
		bottom: "1rem",
		left: "1rem",
	},
};

const FloatingButton = ({
	position = "bottom-left",
	size = "LG",
	handleClick,
	customStyles = {},
	children,
}) => {
	const custom = {
		...customStyles,
	};

	return (
		<aside
			style={custom}
			className={styles.FloatingButton}
			onClick={handleClick}
		>
			<button className={styles.FloatingButton_btn}>{children}</button>
		</aside>
	);
};

export default FloatingButton;

FloatingButton.defaultProps = {
	position: "bottom-left",
	size: "MD",
	customStyles: {},
};
FloatingButton.propTypes = {
	position: PropTypes.string,
	sizes: PropTypes.string,
	handleClick: PropTypes.func.isRequired,
	customStyles: PropTypes.object,
	children: PropTypes.any.isRequired,
};
