import React from "react";
import { PropTypes } from "prop-types";

// TAB CONTENT SECTION

const TabPanel = ({ activeIndex, tabIndex, children }) => {
	return <>{activeIndex === tabIndex ? children : null}</>;
};

export default TabPanel;

TabPanel.defaultProps = {};

TabPanel.propTypes = {
	children: PropTypes.any.isRequired,
	activeIndex: PropTypes.number,
	tabIndex: PropTypes.number
};
