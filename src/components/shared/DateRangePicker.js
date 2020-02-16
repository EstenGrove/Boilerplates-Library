import React, { useState, useEffect } from "react";
import styles from "../../css/shared/DateRangePicker.module.scss";
import sprite from "../../assets/icon-bar.svg";
import DateRangeCalendar from "./DateRangeCalendar";
import { PropTypes } from "prop-types";
import { useDates } from "../../utils/useDates";
import { isEmptyVal } from "../../helpers/utils_types";
import { format, isBefore } from "date-fns";

// REQUIREMENTS FOR PROPS
// 1. MUST PROVIDE "startName" & "endName"
// 2. MUST PROVIDE THE STATE VALUES FOR (start and end dates) (ie "rangeVals")
// 3. MUST PROVIDE THE STATE SETTER TO SET THE VALUES (ie "handleSelection")

const DateRangePicker = ({
	label,
	id,
	startName,
	endName,
	rangeVals,
	handleSelection
}) => {
	const { globalDates, getNextMonth, getPrevMonth, jumpToToday } = useDates();
	const { month, year, today } = globalDates;
	const [showCalendar, setShowCalendar] = useState(false);
	const [isBeforeError, setIsBeforeError] = useState(false);

	const jumpToTodayHandler = () => {
		if (isEmptyVal(rangeVals[startName])) {
			handleSelection({
				[startName]: format(today, "MM/DD/YYYY"),
				[endName]: ""
			});
			return jumpToToday();
		}
		handleSelection({
			...rangeVals,
			[endName]: format(today, "MM/DD/YYYY")
		});
		return jumpToToday();
	};

	// handles click selection
	// if start date is empty, then sets the start date first
	// if start date is filled then sets the end date
	// if the end date is "before" the start date, it returns an alert
	const selectionHandler = date => {
		if (isEmptyVal(rangeVals[startName])) {
			return handleSelection({
				[startName]: format(date, "MM/DD/YYYY"),
				[endName]: ""
			});
		}
		if (isBefore(format(date, "MM/DD/YYYY"), rangeVals[startName])) {
			return setIsBeforeError(true);
		}
		setIsBeforeError(false);
		return handleSelection({
			...rangeVals,
			[endName]: format(date, "MM/DD/YYYY")
		});
	};

	const clearVals = () => {
		handleSelection({
			[startName]: "",
			[endName]: ""
		});
	};

	useEffect(() => {
		if (!isEmptyVal(rangeVals[startName]) && !isEmptyVal(rangeVals[endName])) {
			return setShowCalendar(false);
		}
	}, [endName, rangeVals, rangeVals.end, startName]);

	return (
		<>
			{isBeforeError && (
				<span className={styles.DateRangePicker_error}>
					Ending date must come <i>AFTER</i> the start date
				</span>
			)}
			<article className={styles.DateRangePicker}>
				{!isEmptyVal(label) && (
					<label htmlFor={id} className={styles.DateRangePicker_label}>
						{label}
					</label>
				)}
				<div className={styles.DateRangePicker_inputs}>
					<input
						type="text"
						name={startName}
						id={startName}
						className={styles.DateRangePicker_inputs_startDate}
						placeholder="Select start date"
						value={rangeVals[startName]}
						readOnly
						onChange={handleSelection}
						onClick={() => setShowCalendar(!showCalendar)}
					/>
					<input
						type="text"
						name={endName}
						id={endName}
						className={styles.DateRangePicker_inputs_endDate}
						placeholder="Select end date"
						value={
							isEmptyVal(rangeVals[endName]) ? "" : `~   ${rangeVals[endName]}`
						}
						readOnly
						onChange={handleSelection}
						onClick={() => setShowCalendar(!showCalendar)}
					/>
					<svg
						className={styles.DateRangePicker_inputs_icon}
						onClick={
							isEmptyVal(rangeVals[startName]) ? null : () => clearVals()
						}
					>
						<use
							xlinkHref={`${sprite}#icon-${
								isEmptyVal(rangeVals[startName]) ? "event_note" : "clearclose"
							}`}
						/>
					</svg>

					{showCalendar && (
						<DateRangeCalendar
							startDate={rangeVals[startName]}
							endDate={rangeVals[endName]}
							currentDays={month.days}
							currentMonth={month.monthStart}
							currentYear={year}
							getNextMonth={getNextMonth}
							getPrevMonth={getPrevMonth}
							jumpToToday={jumpToTodayHandler}
							handleSelection={selectionHandler}
							closeCalendar={() => setShowCalendar(false)}
						/>
					)}
				</div>
			</article>
		</>
	);
};

export default DateRangePicker;

DateRangePicker.defaultProps = {};

DateRangePicker.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string,
	startName: PropTypes.string.isRequired,
	endName: PropTypes.string.isRequired,
	rangeVals: PropTypes.object.isRequired,
	handleSelection: PropTypes.func.isRequired
};
