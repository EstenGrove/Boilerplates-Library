import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { formatNum } from "../../helpers/utils_dates";
import { isEmptyVal } from "../../helpers/utils_types";
import styles from "../../css/shared/TimePicker.module.scss";
import sprite from "../../assets/icon-bar.svg";
import TimePickerCalendar from "./TimePickerCalendar";

// PROBABLY NEEDS TO BE UPDATED FOR "EVENT-OBJECT" METHOD OF SETTER

const TimePicker = ({
	label,
	name,
	id,
	placeholder,
	val,
	handleTime,
	hourRangeStart = 1,
	hourRangeEnd = 12,
	minsIncrement = 1,
	enableSecs = true,
}) => {
	const [showCalendar, setShowCalendar] = useState(false);
	const [timePortions, setTimePortions] = useState({
		hour: "00",
		mins: "00",
		secs: "00",
		timeOfDay: "PM",
	});

	const timeHandler = ({ type, val }) => {
		switch (type) {
			case "HOUR": {
				const { mins, secs, timeOfDay } = timePortions;
				const time = enableSecs
					? `${formatNum(val)}:${mins}:${secs} ${timeOfDay}`
					: `${formatNum(val)}:${mins} ${timeOfDay}`;

				setTimePortions({
					...timePortions,
					hour: formatNum(val),
				});
				return handleTime(name, formatNum(time));
			}
			case "MINS": {
				const { hour, secs, timeOfDay } = timePortions;
				const time = enableSecs
					? `${formatNum(hour)}:${formatNum(val)}:${secs} ${timeOfDay}`
					: `${formatNum(hour)}:${formatNum(val)} ${timeOfDay}`;

				setTimePortions({
					...timePortions,
					mins: formatNum(val),
				});
				return handleTime(name, formatNum(time));
			}
			case "SECS": {
				const { hour, mins, timeOfDay } = timePortions;
				const time = enableSecs
					? `${formatNum(hour)}:${formatNum(mins)}:${formatNum(
							val
					  )} ${timeOfDay}`
					: `${formatNum(hour)}:${formatNum(mins)} ${timeOfDay}`;

				setTimePortions({
					...timePortions,
					secs: formatNum(val),
				});
				return handleTime(name, formatNum(time));
			}
			case "TIME_OF_DAY": {
				const { hour, mins, secs } = timePortions;
				const time = enableSecs
					? `${formatNum(hour)}:${formatNum(mins)}:${formatNum(secs)} ${val}`
					: `${formatNum(hour)}:${formatNum(mins)} ${val}`;
				setTimePortions({
					...timePortions,
					timeOfDay: val,
				});
				return handleTime(name, formatNum(time));
			}
			default:
				break;
		}
	};

	const clearTime = () => {
		setTimePortions({
			hour: "00",
			mins: "00",
			secs: "00",
			timeOfDay: "AM",
		});
		handleTime(name, "");
	};

	return (
		<article className={styles.TimePicker}>
			<label htmlFor={id} className={styles.TimePicker_label}>
				{label}
			</label>
			<div className={styles.TimePicker_inputContainer}>
				<input
					type="text"
					name={name}
					id={id}
					className={styles.TimePicker_inputContainer_input}
					value={val}
					onChange={handleTime}
					onClick={() => setShowCalendar(!showCalendar)}
					placeholder={placeholder}
					readOnly
				/>

				<svg
					className={styles.TimePicker_inputContainer_icon}
					onClick={
						isEmptyVal(val) ? () => setShowCalendar(true) : () => clearTime()
					}
				>
					<use
						xlinkHref={`${sprite}#icon-${
							isEmptyVal(val) ? "timer" : "clearclose"
						}`}
					></use>
				</svg>
			</div>

			{showCalendar && (
				<TimePickerCalendar
					hourRangeStart={hourRangeStart}
					hourRangeEnd={hourRangeEnd}
					minsIncrement={minsIncrement}
					times={timePortions}
					handleTime={timeHandler}
					closeCalendar={() => setShowCalendar(false)}
					enableSecs={enableSecs}
				/>
			)}
		</article>
	);
};

export default TimePicker;

TimePicker.defaultProps = {
	hourRangeStart: 1,
	hourRangeEnd: 12,
	minsIncrement: 1,
	enableSecs: true,
};

TimePicker.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	val: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired,
	]),
	handleTime: PropTypes.func.isRequired,
	hourRangeStart: PropTypes.number,
	hourRangeEnd: PropTypes.number,
	enableSecs: PropTypes.bool.isRequired,
};
