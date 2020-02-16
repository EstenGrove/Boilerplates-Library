import React, { useRef, useEffect } from "react";
import { PropTypes } from "prop-types";
import { format, isSameDay } from "date-fns";
import { useOutsideClick } from "../../utils/useOutsideClick";
import styles from "../../css/shared/DatePickerCalendar.module.scss";
import sprite from "../../assets/carets-arrows.svg";
import DatePickerDay from "./DatePickerDay";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const checkIsSelected = (selectedDate, day) => {
	console.group("checkIsSelected");
	console.log("selectedDate", selectedDate);
	console.log("day", day);
	console.log("formatted day", format(day, "MM/DD/YYYY"));
	console.log(selectedDate === format(day, "MM/DD/YYYY"));
	console.groupEnd();
	return selectedDate === format(day, "MM/DD/YYYY") ? true : false;
};

const DatePickerCalendar = ({
	today,
	currentYear,
	currentMonth,
	currentDays,
	getNextMonth,
	getPrevMonth,
	jumpToToday,
	selectDay,
	selectedDate,
	showDays = true,
	closeCalendar
}) => {
	const calendarRef = useRef();
	const { isOutside } = useOutsideClick(calendarRef);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (isOutside) {
			return closeCalendar();
		}

		return () => {
			isMounted = false;
		};
	}, [closeCalendar, isOutside]);

	return (
		<article className={styles.DatePickerCalendar} ref={calendarRef}>
			<nav className={styles.DatePickerCalendar_controls}>
				<h2 className={styles.DatePickerCalendar_controls_heading}>
					{format(currentMonth, "MMMM")} <b>{currentYear}</b>
				</h2>
				<div className={styles.DatePickerCalendar_controls_arrows}>
					<svg
						className={styles.DatePickerCalendar_controls_arrows_chevron}
						onClick={getPrevMonth}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-down`}></use>
					</svg>
					<svg
						className={styles.DatePickerCalendar_controls_arrows_chevron}
						onClick={getNextMonth}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-up`}></use>
					</svg>
				</div>
			</nav>
			{showDays && (
				<section className={styles.DatePickerCalendar_weekDays}>
					{days.map(day => (
						<span key={day}>{day}</span>
					))}
				</section>
			)}
			<section className={styles.DatePickerCalendar_calendar}>
				{currentDays &&
					currentDays.map((day, index) => (
						<DatePickerDay
							isToday={isSameDay(today, day)}
							isMonthStart={index === 0 ? true : false}
							isSelected={checkIsSelected(selectedDate, day)}
							key={`${day}_${index}`}
							day={day}
							selectDay={() => selectDay(day)}
						/>
					))}
			</section>
			<section className={styles.DatePickerCalendar_today}>
				<button
					className={styles.DatePickerCalendar_today_btn}
					title="Jump to Today"
					onClick={jumpToToday}
				>
					Today
				</button>
			</section>
		</article>
	);
};

export default DatePickerCalendar;

DatePickerCalendar.defaultProps = {
	showDays: true
};

DatePickerCalendar.propTypes = {
	today: PropTypes.instanceOf(Date),
	currentYear: PropTypes.number, // ie. 2020
	currentMonth: PropTypes.instanceOf(Date), // ie. Sat. Feb 01 2020...
	currentDays: PropTypes.arrayOf(PropTypes.instanceOf(Date)), // array of dates
	getNextMonth: PropTypes.func,
	getPrevMonth: PropTypes.func,
	jumpToToday: PropTypes.func,
	selectDay: PropTypes.func,
	showDays: PropTypes.bool,
	closeCalendar: PropTypes.func.isRequired
};
