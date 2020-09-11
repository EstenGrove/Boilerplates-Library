import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useDates } from "../../utils/useDates";
import { isEmptyVal } from "../../helpers/utils_types";
import { format } from "date-fns";
import styles from "../../css/shared/DatePickerSM.module.scss";
import sprite from "../../assets/icon-bar.svg";
import DatePickerCalendarSM from "./DatePickerCalendarSM";

// ##TODOS:
// - Added 'Range Restriction' support

const DatePickerSM = ({
	label,
	name,
	id,
	placeholder,
	val,
	handleDate,
	focusMode = false,
	restrictions = {},
}) => {
	const { globalDates, getNextMonth, getPrevMonth, jumpToToday } = useDates();
	const { today, month, year } = globalDates;
	const [showCalendar, setShowCalendar] = useState(false);

	const selectDay = (day) => {
		handleDate(name, format(day, "MM/DD/YYYY"));
	};

	const clearDate = () => {
		handleDate(name, "");
	};

	const jumpToTodayHandler = () => {
		handleDate(name, format(today, "MM/DD/YYYY"));
		jumpToToday();
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (!isEmptyVal(val)) {
			return setShowCalendar(false);
		}
		return () => {
			isMounted = false;
		};
	}, [val]);

	return (
		<article
			className={styles.DatePickerSM}
			title={`Click to ${showCalendar ? "close" : "open"} the calendar`}
		>
			{!isEmptyVal(label) && (
				<label htmlFor={id} className={styles.DatePickerSM_label}>
					{label}
				</label>
			)}
			<input
				type="text"
				name={name}
				id={id}
				className={styles.DatePickerSM_input}
				placeholder={placeholder}
				value={val}
				onChange={handleDate}
				readOnly
				onClick={() => setShowCalendar(!showCalendar)}
			/>
			<svg
				className={styles.DatePickerSM_icon}
				onClick={isEmptyVal(val) ? null : () => clearDate()}
			>
				<use
					xlinkHref={`${sprite}#icon-${
						isEmptyVal(val) ? "event_note" : "clearclose"
					}`}
				></use>
			</svg>

			{showCalendar && (
				<DatePickerCalendarSM
					name={name}
					today={today}
					currentYear={year}
					currentMonth={month.monthStart}
					currentDays={month.days}
					getNextMonth={getNextMonth}
					getPrevMonth={getPrevMonth}
					selectDay={selectDay}
					selectedDate={val}
					jumpToToday={jumpToTodayHandler}
					closeCalendar={() => setShowCalendar(false)}
					focusMode={focusMode}
					restrictions={restrictions}
				/>
			)}
		</article>
	);
};

export default DatePickerSM;

DatePickerSM.defaultProps = {
	focusMode: false,
	restrictions: {
		isActive: false,
		rangeStart: "",
		rangeEnd: "",
	},
};

DatePickerSM.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	val: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.instanceOf(Date),
	]),
	handleDate: PropTypes.func.isRequired,
};
