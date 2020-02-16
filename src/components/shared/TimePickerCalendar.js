import React, { useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { formatNum } from "../../helpers/utils_dates";
import styles from "../../css/shared/TimePickerCalendar.module.scss";
import TimePickerColumn from "./TimePickerColumn";
import TimePickerOption from "./TimePickerOption";

// creates a range sequence from start-stop with a step
const rangeWithStep = (start, stop, step) => {
	return Array.from(
		{ length: (stop - start) / step + 1 },
		(_, i) => start + i * step
	);
};

const TimePickerCalendar = ({
	hourRangeStart = 0,
	hourRangeEnd = 0,
	minsIncrement = 0,
	times = {},
	handleTime,
	closeCalendar
}) => {
	const calendarRef = useRef();
	const { isOutside } = useOutsideClick(calendarRef);

	const hours = rangeWithStep(hourRangeStart, hourRangeEnd, 1);
	const mins = rangeWithStep(0, 59, minsIncrement);
	const secs = rangeWithStep(0, 59, 1);

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
		<section className={styles.TimePickerCalendar} ref={calendarRef}>
			{/* START - HOURS */}
			<TimePickerColumn key="HOURS" type="HOURS">
				{hours.map((hr, i) => (
					<TimePickerOption
						key={`HOUR_${hr}`}
						type="HOUR"
						time={hr}
						isSelected={formatNum(times.hour) === formatNum(hr)}
						handleTime={() => handleTime({ type: "HOUR", val: hr })}
					/>
				))}
			</TimePickerColumn>
			{/* END - HOURS */}

			{/* START - MINS */}
			<TimePickerColumn key="MINS" type="MINS">
				{mins.map((min, i) => (
					<TimePickerOption
						key={`MIN_${min}`}
						type="MIN"
						time={min}
						isSelected={formatNum(times.mins) === formatNum(min)}
						handleTime={() => handleTime({ type: "MINS", val: min })}
					/>
				))}
			</TimePickerColumn>
			{/* END - MINS */}

			{/* START - SECS */}
			<TimePickerColumn key="SECS" type="SECS">
				{secs.map((sec, i) => (
					<TimePickerOption
						key={`SEC_${sec}`}
						type="SEC"
						time={sec}
						isSelected={formatNum(times.secs) === formatNum(sec)}
						handleTime={() => handleTime({ type: "SECS", val: sec })}
					/>
				))}
			</TimePickerColumn>
			{/* END - SECS */}

			{/* START - TIME OF DAY */}
			<TimePickerColumn key="TIME_OF_DAY" type="TIME_OF_DAY">
				<TimePickerOption
					type="TIME_OF_DAY"
					time="AM"
					isSelected={times.timeOfDay === "AM"}
					handleTime={() => handleTime({ type: "TIME_OF_DAY", val: "AM" })}
				/>
				<TimePickerOption
					type="TIME_OF_DAY"
					time="PM"
					isSelected={times.timeOfDay === "PM"}
					handleTime={() => handleTime({ type: "TIME_OF_DAY", val: "PM" })}
				/>
			</TimePickerColumn>
			{/* END - TIME OF DAY */}
		</section>
	);
};

export default TimePickerCalendar;

TimePickerCalendar.defaultProps = {};

TimePickerCalendar.propTypes = {
	hourRangeStart: PropTypes.number,
	hourRangeEnd: PropTypes.number,
	minsIncrement: PropTypes.number,
	times: PropTypes.object.isRequired,
	handleTime: PropTypes.func.isRequired,
	closeCalendar: PropTypes.func.isRequired
};
