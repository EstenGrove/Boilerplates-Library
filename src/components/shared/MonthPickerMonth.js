import React from "react";
import styles from "../../css/shared/MonthPickerMonth.module.scss";
import { PropTypes } from "prop-types";
import { months } from "../../utils/useDates";

const MonthPickerMonth = ({
	currentYear,
	month,
	handleMonth,
	isSelected = false
}) => {
	return (
		<div
			className={
				isSelected
					? styles.MonthPickerMonth_isSelected
					: styles.MonthPickerMonth
			}
			onClick={() => handleMonth(month)}
		>
			<time
				className={styles.MonthPickerMonth_month}
				dateTime={new Date(`${currentYear}-${months.indexOf(month)}`)}
			>
				{month}
			</time>
		</div>
	);
};

export default MonthPickerMonth;

MonthPickerMonth.defaultProps = {};

MonthPickerMonth.propTypes = {
	month: PropTypes.string.isRequired
};
