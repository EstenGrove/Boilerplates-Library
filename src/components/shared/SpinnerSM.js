import React from "react";
import styles from "../../css/shared/SpinnerSM.module.scss";
import { PropTypes } from "prop-types";

const SpinnerSM = ({ color }) => {
	const custom = {
		borderTopColor: color
	};
	return <div className={styles.SpinnerSM} style={custom}></div>;
};

export default SpinnerSM;

SpinnerSM.defaultProps = {};

SpinnerSM.propTypes = {
	color: PropTypes.string
};
