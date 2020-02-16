import React from "react";
import styles from "../../css/shared/TimePickerOption.module.scss";
import { PropTypes } from "prop-types";
import { formatNum } from "../../helpers/utils_dates";

// TYPES: HOUR, MIN, SEC, TIME_OF_DAY(AM/PM)

const TimePickerOption = ({
	time,
	type = "HOUR",
	isSelected = false,
	handleTime
}) => {
	if (type === "TIME_OF_DAY") {
		return (
			<div
				className={
					isSelected
						? styles.TimePickerOption_isSelected
						: styles.TimePickerOption
				}
				onClick={handleTime}
			>
				<span className={styles.TimePickerOption_tod}>{time}</span>
			</div>
		);
	}
	return (
		<div
			className={
				isSelected
					? styles.TimePickerOption_isSelected
					: styles.TimePickerOption
			}
			onClick={handleTime}
		>
			<span className={styles.TimePickerOption_time}>{formatNum(time)}</span>
		</div>
	);
};

export default TimePickerOption;

TimePickerOption.defaultProps = {
	type: "HOUR",
	isSelected: false
};

TimePickerOption.propTypes = {
	time: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired
	]),
	type: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	handleTime: PropTypes.func.isRequired
};
