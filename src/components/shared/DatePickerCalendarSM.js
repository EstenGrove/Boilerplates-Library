import React, { useRef, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { format, isSameDay } from "date-fns";
import styles from "../../css/shared/DatePickerCalendarSM.module.scss";
import sprite from "../../assets/carets-arrows.svg";
import DatePickerDaySM from "./DatePickerDaySM";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DatePickerCalendarSM = ({
	today,
	currentYear,
	currentMonth,
	currentDays,
	getNextMonth,
	getPrevMonth,
	jumpToToday,
	selectDay,
	selectedDate,
	showDays = false,
	closeCalendar,
	focusMode
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
	}, [isOutside, closeCalendar]);

	console.group("<DatePickerCalendarSM/>");
	console.log("selectedDate", selectedDate);
	console.groupEnd();

	return (
		<article
			className={
				focusMode
					? styles.DatePickerCalendarSM_focusMode
					: styles.DatePickerCalendarSM
			}
			ref={calendarRef}
		>
			<nav className={styles.DatePickerCalendarSM_controls}>
				<h2 className={styles.DatePickerCalendarSM_controls_heading}>
					{format(currentMonth, "MMMM")} <b>{currentYear}</b>
				</h2>
				<div className={styles.DatePickerCalendarSM_controls_arrows}>
					<svg
						className={styles.DatePickerCalendarSM_controls_arrows_chevron}
						onClick={getPrevMonth}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-down`}></use>
					</svg>
					<svg
						className={styles.DatePickerCalendarSM_controls_arrows_chevron}
						onClick={getNextMonth}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-up`}></use>
					</svg>
				</div>
			</nav>
			{showDays && (
				<section className={styles.DatePickerCalendarSM_weekDays}>
					{days.map(day => (
						<span key={day}>{day}</span>
					))}
				</section>
			)}
			<section className={styles.DatePickerCalendarSM_calendar}>
				{currentDays &&
					currentDays.map((day, index) => (
						<DatePickerDaySM
							isToday={isSameDay(today, day)}
							isMonthStart={index === 0 ? true : false}
							isSelected={
								format(selectedDate, "MM/DD/YYYY") === format(day, "MM/DD/YYYY")
							}
							key={`${day}_${index}`}
							day={day}
							selectDay={() => selectDay(day)}
						/>
					))}
			</section>
			<section className={styles.DatePickerCalendarSM_today}>
				<button
					className={styles.DatePickerCalendarSM_today_btn}
					title="Jump to Today"
					onClick={jumpToToday}
				>
					Today
				</button>
			</section>
		</article>
	);
};

export default DatePickerCalendarSM;

DatePickerCalendarSM.defaultProps = {
	showDays: false
};

DatePickerCalendarSM.propTypes = {
	today: PropTypes.instanceOf(Date),
	currentYear: PropTypes.number, // ie. 2020
	currentMonth: PropTypes.instanceOf(Date), // ie. Sat. Feb 01 2020...
	currentDays: PropTypes.arrayOf(PropTypes.instanceOf(Date)), // array of dates
	getNextMonth: PropTypes.func,
	getPrevMonth: PropTypes.func,
	jumpToToday: PropTypes.func,
	selectDay: PropTypes.func,
	showDays: PropTypes.bool,
	selectedDate: PropTypes.oneOfType([PropTypes.string]) // should be the selected date formatted (MM/DD/YYYY)
};
