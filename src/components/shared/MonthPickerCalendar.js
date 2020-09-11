import React, { useRef, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { isEmptyArray } from "../../helpers/utils_types";
import { format } from "date-fns";
import styles from "../../css/shared/MonthPickerCalendar.module.scss";
import sprite from "../../assets/carets-arrows.svg";
import MonthPickerMonth from "./MonthPickerMonth";

const MonthPickerCalendar = ({
	months,
	currentMonth,
	currentYear,
	getNextMonth,
	getPrevMonth,
	handleMonth,
	jumpToToday,
	closeCalendar,
	focusMode
}) => {
	const monthCalRef = useRef();
	const { isOutside } = useOutsideClick(monthCalRef);

	// close the calendar when clicking outside it
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
		<aside
			className={
				focusMode
					? styles.MonthPickerCalendar_focusMode
					: styles.MonthPickerCalendar
			}
			ref={monthCalRef}
		>
			<section className={styles.MonthPickerCalendar_top}>
				<div className={styles.MonthPickerCalendar_top_heading}>
					<h2 className={styles.MonthPickerCalendar_top_heading_month}>
						{format(currentMonth, "MMMM")}
					</h2>
					<p className={styles.MonthPickerCalendar_top_heading_year}>
						{currentYear}
					</p>
				</div>

				<div className={styles.MonthPickerCalendar_top_controls}>
					<svg
						className={styles.MonthPickerCalendar_top_controls_icon}
						onClick={getPrevMonth}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-down`}></use>
					</svg>
					<svg
						className={styles.MonthPickerCalendar_top_controls_icon}
						onClick={getNextMonth}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-up`}></use>
					</svg>
				</div>
			</section>
			<section className={styles.MonthPickerCalendar_calendar}>
				{!isEmptyArray(months) &&
					months.map((month, index) => (
						<MonthPickerMonth
							key={`${month}_${index}`}
							month={month}
							isSelected={format(currentMonth, "MMM") === month}
							handleMonth={handleMonth}
						/>
					))}
			</section>
			<section className={styles.MonthPickerCalendar_today}>
				<button
					className={styles.MonthPickerCalendar_today_btn}
					onClick={jumpToToday}
				>
					Today
				</button>
			</section>
		</aside>
	);
};

export default MonthPickerCalendar;

MonthPickerCalendar.defaultProps = {};

MonthPickerCalendar.propTypes = {
	months: PropTypes.arrayOf(PropTypes.string).isRequired,
	currentMonth: PropTypes.instanceOf(Date).isRequired,
	currentYear: PropTypes.number.isRequired,
	handleMonth: PropTypes.func.isRequired
};
