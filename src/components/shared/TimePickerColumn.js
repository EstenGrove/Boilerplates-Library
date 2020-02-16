import React from "react";
import styles from "../../css/shared/TimePickerColumn.module.scss";
import { PropTypes } from "prop-types";

// COLUMN TYPES:
// 1. MINS, HOURS, SECS, AM/PM

const TYPES = {
	HOURS: {
		border: "none"
	},
	MINS: {
		borderLeft: `1px solid #ccc`,
		borderRight: `1px solid #ccc`
	},
	SECS: {
		borderRight: `1px solid #ccc`
	},
	TIME_OF_DAY: {
		border: "none"
	}
};

const TimePickerColumn = ({ type = "HOUR", children }) => {
	return (
		<section className={styles.TimePickerColumn} style={TYPES[type]}>
			<div className={styles.TimePickerColumn_inner}>{children}</div>
		</section>
	);
};

export default TimePickerColumn;

TimePickerColumn.defaultProps = {
	type: "HOUR"
};

TimePickerColumn.propTypes = {
	type: PropTypes.string.isRequired,
	children: PropTypes.any.isRequired
};
