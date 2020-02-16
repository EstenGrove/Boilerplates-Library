import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { isEmptyVal } from "../../helpers/utils_types";
import styles from "../../css/shared/YearPicker.module.scss";
import sprite from "../../assets/icon-bar.svg";
import YearPickerCalendar from "./YearPickerCalendar";

const range = (start, stop, callback) => {
	return Array.from({ length: stop - start }, (_, i) => callback(i + start));
};

const generateYearRange = (startYear, endYear) => {
	return range(startYear, endYear, x => x + 1);
};

// REQUIREMENTS:
// 1. WIRE UP "getNextYear" & "getPrevYear" HANDLERS

const YearPicker = ({
	label,
	name,
	id,
	placeholder,
	startYear,
	endYear,
	val,
	handleYear
}) => {
	const [showCalendar, setShowCalendar] = useState(false);
	const yearRange = generateYearRange(startYear, endYear);

	const getNextYear = () => {
		if (val < endYear) {
			return handleYear(val + 1);
		}
		return handleYear(val);
	};
	const getPrevYear = () => {
		if (val > startYear + 1) {
			return handleYear(val - 1);
		}
		return handleYear(val);
	};

	const clearDate = () => {
		handleYear("");
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
		<article className={styles.YearPicker}>
			<label className={styles.YearPicker_label}>{label}</label>
			<input
				type="text"
				name={name}
				id={id}
				value={val}
				className={styles.YearPicker_input}
				onChange={handleYear}
				onClick={() => setShowCalendar(!showCalendar)}
				placeholder={placeholder}
				readOnly
			/>

			<svg
				className={styles.YearPicker_icon}
				onClick={isEmptyVal(val) ? null : () => clearDate()}
			>
				<use
					xlinkHref={`${sprite}#icon-${
						isEmptyVal(val) ? "event_note" : "clearclose"
					}`}
				/>
			</svg>

			{showCalendar && (
				<YearPickerCalendar
					currentYear={val}
					yearRange={yearRange}
					handleYear={handleYear}
					getNextYear={getNextYear}
					getPrevYear={getPrevYear}
					closeCalendar={() => setShowCalendar(false)}
				/>
			)}
		</article>
	);
};

export default YearPicker;

YearPicker.defaultProps = {};

YearPicker.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	id: PropTypes.string,
	placeholder: PropTypes.string,
	val: PropTypes.oneOfType([
		PropTypes.number.isRequired,
		PropTypes.string.isRequired
	]),
	handleYear: PropTypes.func.isRequired,
	startYear: PropTypes.number.isRequired,
	endYear: PropTypes.number.isRequired
};
