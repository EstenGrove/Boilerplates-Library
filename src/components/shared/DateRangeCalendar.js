import React, { useRef, useEffect } from "react";
import styles from "../../css/shared/DateRangeCalendar.module.scss";
import sprite from "../../assets/icon-bar.svg";
import DateRangeDay from "./DateRangeDay";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { days as weekDays } from "../../utils/useDates";
import { format, isSameDay, isWithinRange } from "date-fns";

const checkForMatch = (start, end, day) => {
	if (
		format(start, "MM/DD/YYYY") === format(day, "MM/DD/YYYY") ||
		format(end, "MM/DD/YYYY") === format(day, "MM/DD/YYYY")
	) {
		return true;
	}
	return false;
};

const DateRangeCalendar = ({
	startDate,
	endDate,
	today,
	currentYear,
	currentMonth,
	currentDays,
	getNextMonth,
	getPrevMonth,
	handleSelection,
	jumpToToday,
	closeCalendar,
	showDays = true
}) => {
	const rangeCalendarRef = useRef();
	const { isOutside } = useOutsideClick(rangeCalendarRef);

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

	console.group("Calendar");
	console.log("startDate", startDate);
	console.log("startDate - constructor", startDate.constructor.name);
	console.log("endDate", endDate);
	console.log("endDate - type", endDate.constructor.name);
	console.groupEnd();

	return (
		<article className={styles.DateRangeCalendar} ref={rangeCalendarRef}>
			<nav className={styles.DateRangeCalendar_controls}>
				<h2 className={styles.DateRangeCalendar_controls_heading}>
					{format(currentMonth, "MMMM")} <b>{currentYear}</b>
				</h2>
				<div className={styles.DateRangeCalendar_controls_arrows}>
					<svg
						className={styles.DateRangeCalendar_controls_arrows_chevron}
						onClick={getPrevMonth}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-down`} />
					</svg>
					<svg
						className={styles.DateRangeCalendar_controls_arrows_chevron}
						onClick={getNextMonth}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-up`} />
					</svg>
				</div>
			</nav>
			{showDays && (
				<section className={styles.DateRangeCalendar_weekDays}>
					{weekDays.map(day => (
						<span key={day}>{day}</span>
					))}
				</section>
			)}
			<section className={styles.DateRangeCalendar_calendar}>
				{currentDays &&
					currentDays.map((day, index) => (
						<DateRangeDay
							isToday={isSameDay(today, day)}
							isMonthStart={index === 0 ? true : false}
							isSelectedDate={checkForMatch(startDate, endDate, day)}
							inRange={isWithinRange(day, startDate, endDate)}
							key={`${day}_${index}`}
							day={day}
							isSelectedGroup={false} // needs to be written
							handleSelection={() => handleSelection(day)}
						/>
					))}
			</section>
			<section className={styles.DateRangeCalendar_today}>
				<button
					className={styles.DateRangeCalendar_today_btn}
					title="Jump to Today"
					onClick={jumpToToday}
				>
					Today
				</button>
			</section>
		</article>
	);
};

export default DateRangeCalendar;

DateRangeCalendar.defaultProps = {
	showDays: true
};

DateRangeCalendar.propTypes = {
	startDate: PropTypes.string.isRequired,
	endDate: PropTypes.string.isRequired,
	today: PropTypes.instanceOf(Date),
	currentYear: PropTypes.number,
	currentMonth: PropTypes.instanceOf(Date).isRequired,
	currentDays: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
	getNextMonth: PropTypes.func.isRequired,
	getPrevMonth: PropTypes.func.isRequired,
	handleSelection: PropTypes.func.isRequired,
	jumpToToday: PropTypes.func.isRequired,
	closeCalendar: PropTypes.func.isRequired,
	showDays: PropTypes.bool
};
