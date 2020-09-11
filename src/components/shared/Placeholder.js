import React from "react";
import styles from "../../css/shared/Placeholder.module.scss";
import { PropTypes } from "prop-types";
import { main } from "../../helpers/utils_styles";

const sizes = {
	XSM: "1.4rem",
	SM: "1.6rem",
	MD: "2rem",
	LG: "3rem",
	XLG: "3.5rem"
};

// used for error message and other placeholder messages

const Placeholder = ({
	size = "MD",
	color = "red",
	msg = "",
	customStyles = {},
	children
}) => {
	const msgStyles = {
		fontSize: sizes[size],
		color: main[color],
		...customStyles
	};

	return (
		<aside className={styles.Placeholder}>
			<h1 className={styles.Placeholder_msg} style={msgStyles}>
				{msg}
			</h1>
			{children}
		</aside>
	);
};

export default Placeholder;

Placeholder.defaultProps = {
	customStyles: {}
};
Placeholder.propTypes = {
	size: PropTypes.string,
	msg: PropTypes.string.isRequired,
	customStyles: PropTypes.object,
	children: PropTypes.any
};
