import React, { useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { isEmptyArray } from "../../helpers/utils_types";
import styles from "../../css/shared/YearPickerCalendar.module.scss";
import sprite from "../../assets/icon-bar.svg";
import YearPickerYear from "./YearPickerYear";

const checkIsSelected = (currentYear, year) => {
	return currentYear === year ? true : false;
};

const YearPickerCalendar = ({
	yearRange,
	currentYear,
	getPrevYear,
	getNextYear,
	handleYear,
	closeCalendar
}) => {
	const yearCalRef = useRef();
	const { isOutside } = useOutsideClick(yearCalRef);

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
		<aside className={styles.YearPickerCalendar} ref={yearCalRef}>
			<section className={styles.YearPickerCalendar_top}>
				<div className={styles.YearPickerCalendar_top_heading}>
					<h2 className={styles.YearPickerCalendar_top_heading_year}>
						{currentYear}
					</h2>
				</div>
				<div className={styles.YearPickerCalendar_top_controls}>
					<svg
						className={styles.YearPickerCalendar_top_controls_icon}
						onClick={getPrevYear}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-down`} />
					</svg>
					<svg
						className={styles.YearPickerCalendar_top_controls_icon}
						onClick={getNextYear}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-up`} />
					</svg>
				</div>
			</section>
			<section className={styles.YearPickerCalendar_calendar}>
				{!isEmptyArray(yearRange) &&
					yearRange.map((year, index) => (
						<YearPickerYear
							key={`${year}__${index}`}
							isSelected={checkIsSelected(currentYear, year)}
							year={year}
							handleYear={() => handleYear(year)}
						/>
					))}
			</section>
		</aside>
	);
};

export default YearPickerCalendar;

YearPickerCalendar.defaultProps = {};

YearPickerCalendar.propTypes = {
	yearRange: PropTypes.arrayOf(PropTypes.number),
	currentYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	getNextYear: PropTypes.func.isRequired,
	getPrevYear: PropTypes.func.isRequired,
	handleYear: PropTypes.func.isRequired,
	closeCalendar: PropTypes.func.isRequired
};
