import React from "react";
import styles from "../../css/shared/TabPanels.module.scss";
import { PropTypes } from "prop-types";

// CONTAINS SHOWN/HIDDEN TAB CONTENT SECTIONS //

const TabPanels = ({ activeIndex, children }) => {
	const withActiveIndex = React.Children.map(children, (child, i) =>
		React.cloneElement(child, { activeIndex: activeIndex, tabIndex: i })
	);
	return <section className={styles.TabPanels}>{withActiveIndex}</section>;
};

export default TabPanels;

TabPanels.defaultProps = {};

TabPanels.propTypes = {
	activeIndex: PropTypes.number,
	children: PropTypes.any.isRequired
};
