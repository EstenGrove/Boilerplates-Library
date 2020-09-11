import React from "react";
import styles from "../../css/shared/TabButton.module.scss";
import { PropTypes } from "prop-types";

// tab button control w/ "onClick" handler injected into each child
const TabButton = ({ handleTabButton, activeIndex, tabIndex, children }) => {
	return (
		<button
			className={
				activeIndex === tabIndex ? styles.TabButton_isActive : styles.TabButton
			}
			onClick={() => handleTabButton(tabIndex)}
		>
			{children}
		</button>
	);
};

export default TabButton;

TabButton.defaultProps = {};

TabButton.propTypes = {
	children: PropTypes.any.isRequired,
	tabIndex: PropTypes.number, // this button's assigned index
	activeIndex: PropTypes.number, // the current active index
	handleTabButton: PropTypes.func // click handler for switching tabs
};
