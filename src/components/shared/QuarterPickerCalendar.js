import React, { useRef, useEffect } from "react";
import { PropTypes } from "prop-types";
import { isEmptyArray } from "../../helpers/utils_types";
import { useOutsideClick } from "../../utils/useOutsideClick";
import styles from "../../css/shared/QuarterPickerCalendar.module.scss";
import sprite from "../../assets/icon-bar.svg";
import QuarterPickerQuarter from "./QuarterPickerQuarter";

const QuarterPickerCalendar = ({
	currentYear,
	currentQuarter,
	quarters,
	getPrevQuarter,
	getNextQuarter,
	handleQuarter,
	jumpToToday,
	closeCalendar,
	focusMode
}) => {
	const quarterCalRef = useRef();
	const { isOutside } = useOutsideClick(quarterCalRef);

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
		<article
			className={
				focusMode
					? styles.QuarterPickerCalendar_focusMode
					: styles.QuarterPickerCalendar
			}
			ref={quarterCalRef}
		>
			<section className={styles.QuarterPickerCalendar_top}>
				<div className={styles.QuarterPickerCalendar_top_heading}>
					<h2 className={styles.QuarterPickerCalendar_top_heading_quarter}>
						{currentQuarter}
					</h2>
					<p className={styles.QuarterPickerCalendar_top_heading_year}>
						{currentYear}
					</p>
				</div>
				<div className={styles.QuarterPickerCalendar_top_controls}>
					<svg
						className={styles.QuarterPickerCalendar_top_controls_icon}
						onClick={getPrevQuarter}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-down`}></use>
					</svg>
					<svg
						className={styles.QuarterPickerCalendar_top_controls_icon}
						onClick={getNextQuarter}
					>
						<use xlinkHref={`${sprite}#icon-chevron-small-up`}></use>
					</svg>
				</div>
			</section>

			<section className={styles.QuarterPickerCalendar_calendar}>
				{!isEmptyArray(quarters) &&
					quarters.map((quarter, index) => (
						<QuarterPickerQuarter
							key={`${quarter.quarterStart}_${index}`}
							quarter={quarter}
							isSelected={currentQuarter === quarter}
							handleQuarter={() => handleQuarter(quarter)}
						/>
					))}
			</section>
			<section className={styles.QuarterPickerCalendar_today}>
				<button
					className={styles.QuarterPickerCalendar_today_btn}
					onClick={jumpToToday}
				>
					Today
				</button>
			</section>
		</article>
	);
};

export default QuarterPickerCalendar;

QuarterPickerCalendar.defaultProps = {};

QuarterPickerCalendar.propTypes = {
	currentYear: PropTypes.number.isRequired,
	currentQuarter: PropTypes.string.isRequired,
	quarters: PropTypes.array.isRequired,
	getPrevQuarter: PropTypes.func.isRequired,
	getNextQuarter: PropTypes.func.isRequired,
	handleQuarter: PropTypes.func.isRequired,
	jumpToToday: PropTypes.func.isRequired,
	closeCalendar: PropTypes.func.isRequired
};
