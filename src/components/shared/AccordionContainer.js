import React from "react";
import styles from "../../css/shared/AccordionContainer.module.scss";
import { PropTypes } from "prop-types";

const AccordionContainer = ({ customStyles = {}, children }) => {
	return (
		<div className={styles.AccordionContainer} style={customStyles}>
			{children}
		</div>
	);
};

export default AccordionContainer;

AccordionContainer.defaultProps = {
	customStyles: {},
};

AccordionContainer.propTypes = {
	customStyles: PropTypes.object,
	children: PropTypes.any,
};
