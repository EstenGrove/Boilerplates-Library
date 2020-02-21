import React from "react";
import styles from "../../css/shared/DatePickerDaySM.module.scss";
import { PropTypes } from "prop-types";
import { format } from "date-fns";

const DatePickerDaySM = ({
	isToday = false,
	isMonthStart = false,
	isSelected = false,
	day,
	selectDay
}) => {
	// since it's 0-based you must add 1
	// used to start set the start point on the grid for the month
	const monthStartIndex = Number(format(day, "d")) + 1;

	const handleStyles = () => {
		if (isToday && isSelected) {
			return styles.DatePickerDaySM_isSelected;
		}
		if (isToday) {
			return styles.DatePickerDaySM_isToday;
		}
		if (isSelected) {
			return styles.DatePickerDaySM_isSelected;
		}
		return styles.DatePickerDaySM;
	};
	return (
		<div
			className={handleStyles()}
			style={isMonthStart ? { gridColumnStart: monthStartIndex } : null}
			onClick={selectDay}
		>
			<time className={styles.DatePickerDaySM_entry}>{format(day, "D")}</time>
		</div>
	);
};

export default DatePickerDaySM;

DatePickerDaySM.defaultProps = {
	isToday: false,
	isMonthStart: false,
	isSelected: false
};

DatePickerDaySM.propTypes = {
	day: PropTypes.instanceOf(Date),
	isToday: PropTypes.bool.isRequired,
	isMonthStart: PropTypes.bool.isRequired,
	isSelected: PropTypes.bool.isRequired,
	selectDay: PropTypes.func.isRequired
};
