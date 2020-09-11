import React from "react";
import styles from "../../css/shared/TabButtons.module.scss";
import { PropTypes } from "prop-types";

// CONTAINER FOR EACH TAB BUTTON CONTROL.

const TabButtons = ({ handleTabButton, activeIndex, children }) => {
	const withProps = React.Children.map(children, (child, i) =>
		React.cloneElement(child, {
			handleTabButton,
			tabIndex: i,
			activeIndex: activeIndex
		})
	);
	return <section className={styles.TabButtons}>{withProps}</section>;
};

export default TabButtons;

TabButtons.defaultProps = {};

TabButtons.propTypes = {
	children: PropTypes.any.isRequired,
	activeIndex: PropTypes.number,
	handleTabButton: PropTypes.func
};
