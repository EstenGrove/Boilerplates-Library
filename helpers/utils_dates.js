import * as Sentry from "@sentry/react";

import {
	isToday,
	format,
	isPast,
	distanceInWordsToNow,
	differenceInDays,
	distanceInWords,
	startOfDay,
	endOfDay,
	startOfMonth,
	endOfMonth,
	startOfQuarter,
	endOfQuarter,
	subDays,
	getTime,
	getQuarter,
	getYear,
	startOfYear,
	endOfYear,
	isSameMonth,
	subYears,
} from "date-fns";
import { isEmptyVal } from "./utils_types";
import { isScheduledTask } from "./utils_tasks";

export const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

// returns an array of each date type: [year, month, day, hour, mins, secs, ms]
const extractDateTypes = (date = new Date()) => {
	return new Date(date)
		.toISOString()
		.split(/[^0-9]/)
		.slice(0, -1);
};

// '07:30 AM' => '7:30 AM'
const removeLeadingZero = (time) => {
	if (isEmptyVal(time)) return;
	const [hrs, mins] = time.split(":");
	const [newMins, tod] = mins.split(" ");
	return {
		hrs: Number(hrs).toString(),
		mins: newMins,
		tod,
	};
};

///////////////////////////////////////////////////////////////////////////
//////////////////////// TIMEZONE CONVERSION UTILS ////////////////////////
///////////////////////////////////////////////////////////////////////////

// converts times in 24hr format to 12hr format (ie 'meridiem' format)
const convertToMeridiem = (time) => {
	const numTime = Number(time);
	if (numTime > 12) {
		return numTime - 12;
	}
	return numTime;
};

// ✅ Working Conversion Util
/**
 * @description - Extracts the UTC hours & mins from a UTC date & anchors them to a custom date in local time.
 * @param {Date} utcDate - A UTC date string, typically derives from an 'ADLCareTask', 'FacilityShiftTime' or 'AssessmentShiftTime' record.
 * @param {Date} anchorDate - An "anchor date" used to anchor a timestamp to a custom day & date.
 * @returns {Date} - Returns a converted datetime in the user's local timezone.
 * - Updated 8/7/2020 @ 11:07 AM
 */
const convertUTCToLocal = (utcDate, anchorDate = new Date()) => {
	const localAnchor = new Date(anchorDate);
	// create temp date & extract UTC hrs & mins
	const temp = new Date(utcDate);
	const utcHrs = temp.getUTCHours();
	const utcMins = temp.getUTCMinutes();
	// use UTC time settings to anchor to desired date instance
	localAnchor.setHours(utcHrs);
	localAnchor.setMinutes(utcMins);
	localAnchor.setSeconds(0);
	return localAnchor;
};

// converts utc date to local date
const utcToLocal = (utcDate) => {
	const localDate = new Date(utcDate).toString();
	return localDate;
};

// enables custom 'locale' & 'timeZone' & returns time string
const convertToLocaleTime = (date, options = { timeZone: "UTC" }) => {
	return date.toLocaleTimeString("en-US", options);
};
// enables custom 'locale' & 'timeZone' & returns date string
const convertToLocaleDate = (date, options = { timeZone: "UTC" }) => {
	return date.toLocaleDateString("en-US", options);
};

///////////////////////////////////////////////////////////////////////////
/////////////////////// DATE/TIME FORMATTING UTILS ///////////////////////
///////////////////////////////////////////////////////////////////////////

// returns date string (ie 03/24/2020 2:34 PM)
const getDateTimeStamp = (date = new Date()) => {
	return format(getTime(date), "MM/DD/YYYY h:mm");
};
// returns time string (ie 2:34 PM)
const getTimeStampOnly = (date = new Date()) => {
	return format(date, "h:mm A");
};

// formats an ISO/UTC time string into 'hh:mm A' format
// used for the Shift Times UI
const formatShiftTimes = (time) => {
	if (isEmptyVal(time)) return "XX:XX AM|PM";
	const local = utcToLocal(time);
	return format(local, "h:mm A");
};

// format => 'Sun, Jan 13 2020'
const formatDate = (date = null) => {
	if (!date) return "No date";
	const day = format(date, "ddd");
	const dayDate = format(date, "D");
	const month = format(date, "MMM");
	const year = format(date, "YYYY");
	return `${day}, ${month} ${dayDate} ${year}`;
};

// formats => 'Sunday, Jan 13 2020'
const formatWithFullDay = (date = new Date()) => {
	if (!date) return "No date";
	const day = format(date, "dddd");
	const monthDay = format(date, "Do");
	const month = format(date, "MMM");
	const year = format(date, "YYYY");
	return `${day}, ${month} ${monthDay} ${year}`;
};

// used specifically for handling the LOA return date.
// DOES NOT accept an actual date but rather a stringifyied date
const formatReturnDate = (loaList) => {
	const [current] = loaList;
	const { ReturnDate } = current;
	const weekDay = format(new Date(ReturnDate), "ddd"); // dddd for full weekDay
	const month = format(new Date(ReturnDate), "MMMM");
	const day = format(new Date(ReturnDate), "Do");
	const year = format(new Date(ReturnDate), "YYYY");
	return `${weekDay} ${month}, ${day} ${year}`;
};

// adds padded '0' & formats => '09:25 AM'
const formatTime = (time) => {
	let hours = time.getHours();
	let mins = time.getMinutes();
	let timeOfDay = "AM";
	if (hours > 12) {
		hours = hours - 12;
		timeOfDay = "PM";
	}
	if (mins < 10) {
		mins = "0" + mins;
	}
	return `${hours}:${mins} ${timeOfDay}`;
};

// returns string: 3 days ago, 4 hours ago...
const formatTimeToNow = (date) => {
	if (!isToday(date)) {
		return `${distanceInWords(date, new Date())}`;
	}
	return "";
};

// returns date boolean - wraps the 'isPast' date-fns helper
const isPastDue = (dueDate) => {
	if (isPast(dueDate)) return true;
	return false;
};

// date to now in words (ie '3 hours ago', '12 days ago')
const formatPastDate = (date) => {
	if (!isPast(date)) return "";
	return `${distanceInWordsToNow(date)} ago`;
};

// difference, in days, til today's date (ie '2 days' OR 'today')
const formatDifferenceInDays = (date) => {
	if (!isToday(date)) {
		return `${differenceInDays(date)} days`;
	}
	return "today";
};
const formatDateInWords = (date) => {
	const inPast = isPast(date);
	let desc;
	if (inPast) {
		desc = `${distanceInWordsToNow(date)} ago`;
		return desc;
	} else {
		desc = `${distanceInWordsToNow(date)} from now`;
		return desc;
	}
};

// matches day ("Monday", "Tuesday")
const matchDayOfWeek = (dateStr) => {
	const dayOfWeek = format(new Date(), "dddd");
	if (dayOfWeek === dateStr) {
		return true;
	}
	return false;
};

// matches day & date (ie "Monday" & "12/19/2019")
const matchDayAndDate = (day, dateStr) => {
	const dayOfWeek = format(new Date(), "dddd");
	if (dayOfWeek === day && isToday(dateStr)) {
		return true;
	}
	return false;
};

// returns 0-6 (ie. "Sunday" = 0, "Monday" = 1, ...)
const getZeroBasedDayOfWeek = (day = new Date()) => {
	const dayOfWeek = format(day, "d");
	return dayOfWeek;
};

const checkForPastDue = (task) => {
	// if unscheduled task
	if (!isScheduledTask(task)) {
		return isPast(task.EntryDate)
			? formatPastDate(task.EntryDate)
			: formatDate(task.EntryDate);
	}
	return isPast(task.TrackDate)
		? formatPastDate(task.TrackDate)
		: formatDifferenceInDays(task.TrackDate);
};

// updated 4/14/2020 - used in <TimePicker/>
const formatNum = (num) => {
	if (num < 10 && num.length !== 2) {
		return `0${num}`;
	}
	return num.toString();
};

//////////////////////////////////
////// DATE PICKER HELPERS //////
//////////////////////////////////

// handles "By Month" selection
// deps: months array
const getRangeFromMonth = (selection) => {
	if (isEmptyVal(selection)) return;
	const mo = selection.split(" ")[0].trim();
	const yr = Number(selection.split(" ")[1].trim());

	const monthIdx = months.indexOf(mo);
	const monthStart = format(
		startOfMonth(new Date(yr, monthIdx, 1)),
		"MM/DD/YYYY"
	);
	const monthEnd = format(endOfMonth(new Date(yr, monthIdx, 1)), "MM/DD/YYYY");
	return {
		startDate: monthStart,
		endDate: monthEnd,
	};
};

// handles "By Quarter" selection
const getRangeFromQuarter = (selection) => {
	if (isEmptyVal(selection)) return;
	const qtr = selection.split(" ")[0].trim();
	const yr = Number(selection.split(" ")[1].trim());
	if (qtr === "Q1") {
		return {
			startDate: format(startOfQuarter(new Date(yr, 0, 1)), "MM/DD/YYYY"),
			endDate: format(endOfQuarter(new Date(yr, 0, 1)), "MM/DD/YYYY"),
		};
	}
	if (qtr === "Q2") {
		return {
			startDate: format(startOfQuarter(new Date(yr, 3, 1)), "MM/DD/YYYY"),
			endDate: format(endOfQuarter(new Date(yr, 3, 1)), "MM/DD/YYYY"),
		};
	}
	if (qtr === "Q3") {
		return {
			startDate: format(startOfQuarter(new Date(yr, 6, 1)), "MM/DD/YYYY"),
			endDate: format(endOfQuarter(new Date(yr, 6, 1)), "MM/DD/YYYY"),
		};
	}
	if (qtr === "Q4") {
		return {
			startDate: format(startOfQuarter(new Date(yr, 9, 1)), "MM/DD/YYYY"),
			endDate: format(endOfQuarter(new Date(yr, 9, 1)), "MM/DD/YYYY"),
		};
	}
	throw new Error("❌ Oops. Invalid quarter given", qtr);
};

const getRangeFromLastQuarter = () => {
	const curQtr = getQuarter(new Date());
	if (curQtr === 1) {
		// 1st qtr handler
		const lastQtrAndYr = `Q4 ${getYear(new Date()) - 1}`;
		const { startDate, endDate } = getRangeFromQuarter(lastQtrAndYr);

		return {
			startDate,
			endDate,
		};
	} else {
		// 2nd-4th qtr handler
		const lastQtrAndYr = `Q${curQtr - 1} ${getYear(new Date())}`;
		const { startDate, endDate } = getRangeFromQuarter(lastQtrAndYr);
		return {
			startDate,
			endDate,
		};
	}
};

// handles "Last 30 Days" selection
const getRangeFromLast30Days = () => {
	return {
		startDate: format(subDays(new Date(), 30), "MM/DD/YYYY"),
		endDate: format(new Date(), "MM/DD/YYYY"),
	};
};

// handles "Specific Date" selection
const getRangeFromDate = (selection) => {
	if (isEmptyVal(selection)) return;
	return {
		startDate: format(startOfDay(selection), "MM/DD/YYYY"),
		endDate: format(endOfDay(selection), "MM/DD/YYYY"),
	};
};

// converts dates for the reports' model params
const getStartAndEndDates = (vals) => {
	if (isEmptyVal(vals.dateRangeType)) return { startDate: "", endDate: "" };

	switch (vals.dateRangeType) {
		case "Custom Range": {
			const { startDate, endDate } = vals;
			return {
				startDate,
				endDate,
			};
		}
		case "By Month": {
			const { byMonth } = vals;
			const { startDate, endDate } = getRangeFromMonth(byMonth);

			return {
				startDate,
				endDate,
			};
		}
		case "By Quarter": {
			const { startDate, endDate } = getRangeFromQuarter(vals.byQuarter);
			return {
				startDate,
				endDate,
			};
		}
		case "By Year": {
			const { byYear } = vals;
			return {
				startDate: format(startOfYear(new Date(byYear, 1)), "MM/DD/YYYY"),
				endDate: format(endOfYear(new Date(byYear, 1)), "MM/DD/YYYY"),
			};
		}
		case "By Date": {
			const { startDate, endDate } = getRangeFromDate(vals.byDate);
			return {
				startDate,
				endDate,
			};
		}
		case "Last 30 days": {
			const { startDate, endDate } = getRangeFromLast30Days();
			return {
				startDate,
				endDate,
			};
		}
		case "Last year": {
			const curYr = getYear(new Date());
			const lastYr = subYears(new Date(curYr, 0, 1), 1);

			const startDate = startOfYear(lastYr);
			const endDate = endOfYear(lastYr);
			return {
				startDate,
				endDate,
			};
		}
		case "Last quarter": {
			const { startDate, endDate } = getRangeFromLastQuarter();
			return {
				startDate,
				endDate,
			};
		}
		case "Today": {
			return {
				startDate: format(startOfDay(new Date()), "M/DD/YYYY"),
				endDate: format(endOfDay(new Date()), "M/DD/YYYY"),
			};
		}
		default:
			Sentry.captureMessage(
				`getStartAndEndDates() util failed: ${vals.dateRangeType}
				(empty value provided)
				`
			);
	}
};

// parses selection from <QuarterPicker/>
// 'Q1 2019' => { startDate: 01/01/2019, endDate: 03/31/2019 }
const parseQuarter = (selection) => {
	if (isEmptyVal(selection)) return;
	const qtr = selection.split(" ")[0].trim();
	const yr = Number(selection.split(" ")[1].trim());
	if (qtr === "Q1") {
		return {
			startDate: format(startOfQuarter(new Date(yr, 0, 1)), "MM/DD/YYYY"),
			endDate: format(endOfQuarter(new Date(yr, 0, 1)), "MM/DD/YYYY"),
		};
	}
	if (qtr === "Q2") {
		return {
			startDate: format(startOfQuarter(new Date(yr, 3, 1)), "MM/DD/YYYY"),
			endDate: format(endOfQuarter(new Date(yr, 3, 1)), "MM/DD/YYYY"),
		};
	}
	if (qtr === "Q3") {
		return {
			startDate: format(startOfQuarter(new Date(yr, 6, 1)), "MM/DD/YYYY"),
			endDate: format(endOfQuarter(new Date(yr, 6, 1)), "MM/DD/YYYY"),
		};
	}
	if (qtr === "Q4") {
		return {
			startDate: format(startOfQuarter(new Date(yr, 9, 1)), "MM/DD/YYYY"),
			endDate: format(endOfQuarter(new Date(yr, 9, 1)), "MM/DD/YYYY"),
		};
	}
	throw new Error("❌ Oops. Invalid quarter given", qtr);
};

// parses selection from <MonthPicker/> into a start & end date
// 'Jun 2019' => { startDate: 06/01/2019, endDate: 06/31/2019 }
const parseMonth = (selection) => {
	if (isEmptyVal(selection)) return;
	const mo = selection.split(" ")[0].trim();
	const yr = Number(selection.split(" ")[1].trim());

	const monthIdx = months.indexOf(mo);
	const monthStart = format(
		startOfMonth(new Date(yr, monthIdx, 1)),
		"MM/DD/YYYY"
	);
	const monthEnd = format(endOfMonth(new Date(yr, monthIdx, 1)), "MM/DD/YYYY");
	return {
		startDate: monthStart,
		endDate: monthEnd,
	};
};

// returns a date range desc in text form (ie 'from 02/14/2020 thru 06/14/2020')
const getDateRangeDesc = (settings) => {
	switch (settings.dateRangeType) {
		case "Custom Range": {
			return ` from ${settings.startDate} thru ${settings.endDate} `;
		}
		case "By Month": {
			return `for ${settings.byMonth} `;
		}
		case "By Quarter": {
			return `for ${settings.byQuarter} `;
		}
		case "By Year": {
			return `for ${settings.byYear} `;
		}
		case "By Date": {
			return `for ${settings.byDate} `;
		}
		case "Last 30 days": {
			return `for the last 30 days `;
		}
		case "Last year": {
			return `for the last year `;
		}
		case "Last quarter": {
			return `for the last quarter `;
		}
		case "Today": {
			return `for today `;
		}
		default:
			throw new Error("❌ Oops. Invalid 'dateRangeType' value.");
	}
};

// checks if two dates are within the same month
// used for various date picker components
const checkForSameMonth = (day, monthToMatch = new Date()) => {
	return Boolean(isSameMonth(day, monthToMatch));
};

// LOCAL HELPERS (IE SPECIFIC TO ONLY THIS FILE) //
export {
	isPastDue,
	matchDayOfWeek,
	matchDayAndDate,
	getZeroBasedDayOfWeek,
	checkForPastDue,
	checkForSameMonth,
};
// DATE FORMATTING HELPERS //
export {
	getDateTimeStamp,
	getTimeStampOnly,
	formatNum,
	formatReturnDate,
	formatWithFullDay,
	formatDate,
	formatTime,
	formatTimeToNow,
	formatPastDate,
	formatDateInWords,
	formatDifferenceInDays,
	extractDateTypes,
	removeLeadingZero,
	formatShiftTimes,
	convertToMeridiem,
	convertUTCToLocal,
	convertToLocaleTime,
	convertToLocaleDate,
	utcToLocal,
};

//////////////////////////////////
////// DATE PICKER HELPERS //////
//////////////////////////////////

export {
	getRangeFromDate,
	getRangeFromLast30Days,
	getRangeFromMonth,
	getRangeFromLastQuarter,
	getRangeFromQuarter,
	getStartAndEndDates,
	// parsing date selections
	parseQuarter,
	parseMonth,
};

// DATE TRANSFORMS TO WORDS //
export { getDateRangeDesc };
