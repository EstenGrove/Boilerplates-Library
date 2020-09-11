import React, { useState } from "react";
import styles from "../../css/shared/TabsContainer.module.scss";
import { PropTypes } from "prop-types";

const TabsContainer = ({ defaultIndex = 0, children }) => {
	const [activeIndex, setActiveIndex] = useState(defaultIndex);

	const handleTabButton = tabIndex => {
		return setActiveIndex(tabIndex);
	};

	const withHandler = React.Children.map(children, (child, i) =>
		React.cloneElement(child, {
			handleTabButton: handleTabButton,
			activeIndex: activeIndex
		})
	);
	return <article className={styles.TabsContainer}>{withHandler}</article>;
};

export default TabsContainer;

TabsContainer.defaultProps = {};

TabsContainer.propTypes = {
	defaultIndex: PropTypes.number.isRequired,
	children: PropTypes.any.isRequired
};
