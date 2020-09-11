import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useDates, months } from "../../utils/useDates";
import { isEmptyVal } from "../../helpers/utils_types";
import { format } from "date-fns";
import styles from "../../css/shared/MonthPicker.module.scss";
import sprite from "../../assets/icon-bar.svg";
import MonthPickerCalendar from "./MonthPickerCalendar";

// UPDATED AS OF 3/14/2020 ✅
// UPDATED "handleMonth" SETTER TO SUPPORT MORE FLEXIBLE OPTIONS
// NOW CAN WILL WORK WITH "useForm" AND OTHER OBJECT-BASED STATE SETTERS

const MonthPicker = ({
	label,
	name,
	id,
	placeholder,
	val,
	handleMonth,
	focusMode = false
}) => {
	const {
		globalDates,
		getNextMonth,
		getPrevMonth,
		jumpToToday,
		setMonthFromString
	} = useDates(); // to use a starting date pass any date instance
	const { year, month, today } = globalDates;
	const [showCalendar, setShowCalendar] = useState(false);

	// determines the selected month from a string (ie "Jan")
	// finds the string's index in the "months" list
	// sets the value in "useDates" hook and in the text input
	const monthSelectHandler = month => {
		setMonthFromString(month);
		handleMonth(name, month + ` ${year}`);
	};

	// sets & formats the current month
	// updates the "useDates" hook accordingly
	const jumpToTodayHandler = () => {
		handleMonth(name, format(today, "MMM") + ` ${year}`);
		jumpToToday();
	};

	// clears the text input when "x" is clicked
	const clearDate = () => {
		handleMonth(name, "");
	};

	// closes the calendar once a selection is made
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
		<article className={styles.MonthPicker}>
			{!isEmptyVal(label) && (
				<label htmlFor={id} className={styles.MonthPicker_label}>
					{label}
				</label>
			)}
			<input
				type="text"
				name={name}
				id={id}
				className={styles.MonthPicker_input}
				placeholder={placeholder}
				value={val}
				readOnly
				onChange={handleMonth}
				onClick={() => setShowCalendar(!showCalendar)}
			/>
			<svg
				className={styles.MonthPicker_icon}
				onClick={isEmptyVal(val) ? null : () => clearDate()}
			>
				<use
					xlinkHref={`${sprite}#icon-${
						isEmptyVal(val) ? "event_note" : "clearclose"
					}`}
				></use>
			</svg>

			{showCalendar && (
				<MonthPickerCalendar
					months={months}
					currentMonth={month.monthStart}
					currentYear={year}
					getNextMonth={getNextMonth}
					getPrevMonth={getPrevMonth}
					jumpToToday={jumpToTodayHandler}
					handleMonth={monthSelectHandler}
					closeCalendar={() => setShowCalendar(false)}
					focusMode={focusMode}
				/>
			)}
		</article>
	);
};

export default MonthPicker;

MonthPicker.defaultProps = {};

MonthPicker.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.string,
	placeholder: PropTypes.string,
	val: PropTypes.string.isRequired,
	handleMonth: PropTypes.func.isRequired
};
