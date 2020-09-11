import React from "react";
import styles from "../../css/shared/DateRangeDaySM.module.scss";
import { PropTypes } from "prop-types";
import { format } from "date-fns";

// REQUIREMENTS:
// 1. ADD SUPPORT FOR RANGES
// 2. ADD PROP: "inRange"
//    2A. ADD LIGHT GREY BACKGROUND HIGHLIGHT
// 3. ADD PROP: "isSelectedDate"
//    3A. ADD "isToday" STYLES OR SOME HIGHLIGHT

const DateRangeDaySM = ({
	isToday = false,
	isMonthStart = false,
	inRange = false, //
	isSelectedDate = false,
	isRestricted = false,
	day,
	handleSelection,
}) => {
	// since it's 0-based you must add 1
	// used to start set the start point on the grid for the month
	const monthStartIndex = Number(format(day, "d")) + 1;

	const handleStyles = () => {
		if (isRestricted && !isToday) {
			return styles.DateRangeDaySM_isRestricted;
		}
		if (isRestricted && isToday) {
			return styles.DateRangeDaySM_isRestrictedAndToday;
		}
		if (isToday) {
			return styles.DateRangeDaySM_isToday;
		}
		if (isSelectedDate) {
			return styles.DateRangeDaySM_isSelected;
		}
		if (inRange) {
			return styles.DateRangeDaySM_inRange;
		}
		return styles.DateRangeDaySM;
	};

	return (
		<div
			className={handleStyles()}
			style={isMonthStart ? { gridColumnStart: monthStartIndex } : null}
			onClick={handleSelection}
		>
			<time className={styles.DateRangeDaySM_entry}>{format(day, "D")}</time>
		</div>
	);
};

export default DateRangeDaySM;

DateRangeDaySM.defaultProps = {
	isToday: false,
	isMonthStart: false,
	isInRange: false,
	isSelectedDate: false,
	isRestricted: false,
};

DateRangeDaySM.propTypes = {
	day: PropTypes.instanceOf(Date),
	isToday: PropTypes.bool.isRequired,
	isMonthStart: PropTypes.bool.isRequired,
	isRestricted: PropTypes.bool.isRequired,
	handleSelection: PropTypes.func.isRequired,
};
