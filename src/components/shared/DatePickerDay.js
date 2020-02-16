import React from "react";
import styles from "../../css/shared/DatePickerDay.module.scss";
import { PropTypes } from "prop-types";
import { format } from "date-fns";

const DatePickerDay = ({
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
			return styles.DatePickerDay_isTodayAndSelected;
		}
		if (isToday) {
			return styles.DatePickerDay_isToday;
		}
		if (isSelected) {
			return styles.DatePickerDay_isSelected;
		}
		return styles.DatePickerDay;
	};

	return (
		<div
			className={handleStyles()}
			style={isMonthStart ? { gridColumnStart: monthStartIndex } : null}
			onClick={selectDay}
		>
			<time className={styles.DatePickerDay_entry}>{format(day, "D")}</time>
		</div>
	);
};

export default DatePickerDay;

DatePickerDay.defaultProps = {
	isToday: false,
	isMonthStart: false
};

DatePickerDay.propTypes = {
	day: PropTypes.instanceOf(Date),
	isToday: PropTypes.bool.isRequired,
	isMonthStart: PropTypes.bool.isRequired,
	selectDay: PropTypes.func.isRequired
};
