import React from "react";
import styles from "../../css/shared/Badge.module.scss";
import { PropTypes } from "prop-types";

const sizes = {
	XSM: styles.Badge_XSM,
	SM: styles.Badge_SM,
	MD: styles.Badge_MD,
	LG: styles.Badge_LG
};

const Badge = ({ size = "SM", children, customStyles = {} }) => {
	return (
		<article className={sizes[size]} style={customStyles}>
			{children}
		</article>
	);
};

export default Badge;

Badge.defaultProps = {
	size: "SM",
	customStyles: {}
};
Badge.propTypes = {
	size: PropTypes.string,
	children: PropTypes.any,
	customStyles: PropTypes.object
};
