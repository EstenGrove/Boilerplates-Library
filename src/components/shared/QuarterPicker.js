import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { isEmptyVal } from "../../helpers/utils_types";
import { useDates, quarters } from "../../utils/useDates";
import { format } from "date-fns";
import styles from "../../css/shared/QuarterPicker.module.scss";
import sprite from "../../assets/icon-bar.svg";
import QuarterPickerCalendar from "./QuarterPickerCalendar";

// BUG(s):
// 1. "jumpToTodayHandler()" doesn't include the year - DONE ✅

const getCurrentQuarter = () => {
	return `Q${format(new Date(), "Q")} ${format(new Date(), "YYYY")}`;
};

const QuarterPicker = ({
	label,
	name,
	id,
	placeholder,
	val,
	handleQuarter,
	focusMode = false
}) => {
	const {
		globalDates,
		getNextQuarter,
		getPrevQuarter,
		jumpToToday,
		setQuarterFromString
	} = useDates();
	const { year, quarter } = globalDates;
	const [showCalendar, setShowCalendar] = useState(false);

	const quarterSelectHandler = qtr => {
		setQuarterFromString(qtr);
		handleQuarter(name, qtr + ` ${year}`);
	};

	const clearDate = () => {
		handleQuarter(name, "");
	};

	const jumpToTodayHandler = () => {
		jumpToToday();
		handleQuarter(name, getCurrentQuarter());
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
		<article className={styles.QuarterPicker}>
			{!isEmptyVal(label) && (
				<label htmlFor={id} className={styles.QuarterPicker_label}>
					{label}
				</label>
			)}
			<input
				type="text"
				name={name}
				id={id}
				value={val}
				onChange={quarterSelectHandler}
				onClick={() => setShowCalendar(!showCalendar)}
				className={styles.QuarterPicker_input}
				placeholder={placeholder}
				readOnly
			/>
			<svg
				className={styles.QuarterPicker_icon}
				onClick={isEmptyVal(val) ? null : () => clearDate()}
			>
				<use
					xlinkHref={`${sprite}#icon-${
						isEmptyVal(val) ? "event_note" : "clearclose"
					}`}
				></use>
			</svg>

			{showCalendar && (
				<QuarterPickerCalendar
					currentYear={year}
					currentQuarter={quarter.name}
					quarters={quarters}
					getNextQuarter={getNextQuarter}
					getPrevQuarter={getPrevQuarter}
					handleQuarter={quarterSelectHandler}
					jumpToToday={jumpToTodayHandler}
					closeCalendar={() => setShowCalendar(false)}
					focusMode={focusMode}
				/>
			)}
		</article>
	);
};

export default QuarterPicker;

QuarterPicker.defaultProps = {};

QuarterPicker.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.string,
	placeholder: PropTypes.string,
	val: PropTypes.string.isRequired,
	handleQuarter: PropTypes.func.isRequired
};
