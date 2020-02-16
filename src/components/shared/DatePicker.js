import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useDates } from "../../utils/useDates";
import { isEmptyVal } from "../../helpers/utils_types";
import { format } from "date-fns";
import styles from "../../css/shared/DatePicker.module.scss";
import sprite from "../../assets/icon-bar.svg";
import DatePickerCalendar from "./DatePickerCalendar";

const DatePicker = ({
	label,
	name,
	id,
	placeholder,
	val,
	handleDate,
	selectedDate
}) => {
	const { globalDates, getNextMonth, getPrevMonth, jumpToToday } = useDates();
	const { today, month, year } = globalDates;
	const [showCalendar, setShowCalendar] = useState(false);

	const selectDay = day => {
		handleDate(format(day, "MM/DD/YYYY"));
	};

	const clearDate = () => {
		handleDate("");
	};

	const jumpToTodayHandler = () => {
		handleDate(format(today, "MM/DD/YYYY"));
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
			className={styles.DatePicker}
			title={`Click to ${showCalendar ? "close" : "open"} the calendar`}
		>
			{!isEmptyVal(label) && (
				<label htmlFor={id} className={styles.DatePicker_label}>
					{label}
				</label>
			)}
			<input
				type="text"
				name={name}
				id={id}
				className={styles.DatePicker_input}
				placeholder={placeholder}
				value={val}
				onChange={handleDate}
				readOnly
				onClick={() => setShowCalendar(!showCalendar)}
			/>
			<svg
				className={styles.DatePicker_icon}
				onClick={isEmptyVal(val) ? null : () => clearDate()}
			>
				<use
					xlinkHref={`${sprite}#icon-${
						isEmptyVal(val) ? "event_note" : "clearclose"
					}`}
				></use>
			</svg>

			{showCalendar && (
				<DatePickerCalendar
					today={today}
					currentYear={year}
					currentMonth={month.monthStart}
					currentDays={month.days}
					getNextMonth={getNextMonth}
					getPrevMonth={getPrevMonth}
					selectDay={selectDay}
					selectedDate={selectedDate}
					jumpToToday={jumpToTodayHandler}
					closeCalendar={() => setShowCalendar(false)}
				/>
			)}
		</article>
	);
};

export default DatePicker;

DatePicker.defaultProps = {};

DatePicker.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	handleDate: PropTypes.func.isRequired
};
