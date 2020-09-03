import { hasProp, isEmptyObj, isEmptyArray, isEmptyVal } from "./utils_types";
import {
	format,
	startOfMonth,
	endOfMonth,
	eachDay,
	startOfQuarter,
	endOfQuarter,
} from "date-fns";
import { range } from "./utils_processing";

// CHECKS IF HAS RECURRING SELECTIONS
const hasRecurringType = (val) => {
	if (val !== "Never" && val !== "") {
		return true;
	}
	return false;
};

// checks if a task is "Recurring" or repeats
const isRecurring = (task) => {
	if (!isEmptyVal(task.AssessmentRecurringId)) {
		return true;
	} else {
		return false;
	}
};

// CREATE DAY'S RANGES
const daysRange = range(0, 99, (x) => (x + 1).toString());
// determines which days were selected from the day checkboxes
const getRepeatDays = (repeatSettings) => {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return days.filter((day) => {
		if (repeatSettings[`isRecurring${day}`]) {
			return day;
		}
		return null;
	});
};

// takes the return of "getRepeatDays" and formats the days into a comma-separated string.
// ie ['Mon', 'Wed', 'Fri'] => Mon, Wed, Fri
const formatDays = (days = []) => {
	if (isEmptyArray(days)) return [];
	return days.reduce((week, day) => (week += ", " + day));
};

////////////////////////////////////////////
/////// RECURRING TYPE DESCRIPTIONS ///////
//////////////////////////////////////////

const getDailyDesc = (settings) => {
	const { recurringCycle, startDate, endDate } = settings;
	let desc;
	// if > 1, hide weekday checkboxes
	if (Number(recurringCycle) > 1) {
		desc = `Occurs every ${recurringCycle} days `;
		desc += `from ${startDate} until ${endDate}`;

		return desc;
	}
	// include weekdays
	desc = `Occurs every ${recurringCycle} days `;
	desc += `on ${formatDays(getRepeatDays(settings))} `;
	desc += `from ${startDate} until ${endDate}`;

	return desc;
};

const getWeeklyDesc = (settings) => {
	const { recurringCycle: cycle, startDate, endDate } = settings;
	const repeatDays = getRepeatDays(settings);
	let desc = "Occurs every ";
	desc += cycle + " weeks";

	if (isEmptyArray(repeatDays)) {
		desc += ` on ${format(new Date(), "ddd")} `;
		desc += `from ${startDate} until ${endDate}`;
		return desc;
	}
	desc += ` on ${formatDays(getRepeatDays(settings))} `;
	desc += `from ${startDate} until ${endDate}`;
	return desc;
};

const getMonthlyDesc = (settings) => {
	const {
		recurringCycle: cycle,
		startDate,
		endDate,
		repeatCycleOption,
	} = settings;
	let desc;
	if (repeatCycleOption === "Weekday") {
		const nthDay = getNthDayFromDate(startDate);
		desc = `Occurs on the ${nthDay} of the month `;
		desc += `every ${cycle} months `;
		desc += `from ${startDate} until ${endDate}`;
		return desc;
	}
	const dayOfMonth = getDayOfMonth(startDate);
	desc = `Occurs on the ${dayOfMonth} of the month `;
	desc += `every ${cycle} months `;
	desc += `from ${startDate} until ${endDate}`;
	return desc;
};

const getYearlyDesc = (settings) => {
	const {
		recurringCycle: cycle,
		startDate,
		endDate,
		repeatCycleOption,
	} = settings;
	let desc;
	if (repeatCycleOption === "Weekday") {
		const nthDay = getNthDayFromDate(startDate);
		desc = `Occurs on the ${nthDay} `;
		desc += `every ${cycle} years `;
		desc += `from ${startDate} until ${endDate}`;
		return desc;
	}
	const dayOfMonth = getDayOfMonth(startDate);
	desc = `Occurs on the ${dayOfMonth} of ${format(startDate, "MMMM")} `;
	desc += `every ${cycle} years `;
	desc += `from ${startDate} until ${endDate}`;
	return desc;
};

const getQuarterlyDesc = (settings) => {
	const {
		recurringCycle: cycle,
		startDate,
		endDate,
		repeatCycleOption,
	} = settings;
	let desc;
	if (repeatCycleOption === "Weekday") {
		// (e.g. 11th Tuesday of each quarter)
		const nthDay = getNthWeekdayOfQuarter(startDate);
		desc = `Occurs on the ${nthDay} of each quarter `;
		desc += `every ${cycle} quarters `;
		desc += `from ${startDate} until ${endDate}`;
		return desc;
	}
	// (e.g. day 11 of each quarter)
	const dayOfMonth = getDayOfMonth(startDate);
	desc = `Occurs on the ${dayOfMonth} of each quarter `;
	desc += `every ${cycle} quarters `;
	desc += `from ${startDate} until ${endDate}`;
	return desc;
};

const getThisDayEveryMonthDesc = (settings) => {
	const { recurringCycle: cycle, startDate, endDate } = settings;
	const dayOfMonth = getDayOfMonth(startDate);

	let desc;
	desc += `Occurs on the ${dayOfMonth} of each month every ${cycle} months `;
	desc += `from ${startDate} until ${endDate}`;
	return desc;
};

//////////////////////////////////////
/////// DATE-IN-WORDS HELPERS ///////
////////////////////////////////////

/**
 * @description - Returns an object, with all dates separated by weekday (ie, Sunday, Monday etc.)
 * @param {Date} monthDate - An "anchor date" used to get the month ranges.
 * @returns {Object} - { Sunday: [...], Monday: [...], ... }
 */
const getWeekDaysInMonth = (monthDate = new Date()) => {
	const monthStart = startOfMonth(monthDate);
	const monthEnd = endOfMonth(monthDate);
	const daysInMonth = eachDay(monthStart, monthEnd);
	return daysInMonth.reduce((all, day) => {
		if (!all[format(day, "dddd")]) {
			all[format(day, "dddd")] = [];
		}
		all[format(day, "dddd")].push(format(day, "MM/DD/YYYY"));
		return all;
	}, {});
};

/**
 * @description - Groups all dates in a range by weekday (is "Sunday", "Monday" etc)
 * @param {Date} start - The start date of the range to get all weekdays in date form.
 * @param {Date} end - The end date of the range to get all weekdays in date form.
 * @returns {Object} - Returns an object of Weekday properties with their respective dates
 */
const getWeekDaysInRange = (start, end) => {
	const daysInRange = eachDay(start, end);

	return daysInRange.reduce((all, day) => {
		if (!all[format(day, "dddd")]) {
			all[format(day, "dddd")] = [];
		}
		all[format(day, "dddd")].push(format(day, "MM/DD/YYYY"));
		return all;
	}, {});
};

const getWeekDaysByQuarter = (date = new Date()) => {
	const quarterStart = startOfQuarter(date);
	const quarterEnd = endOfQuarter(date);
	const daysInRange = eachDay(quarterStart, quarterEnd);

	return daysInRange.reduce((all, day) => {
		if (!all[format(day, "dddd")]) {
			all[format(day, "dddd")] = [];
		}
		all[format(day, "dddd")].push(format(day, "MM/DD/YYYY"));
		return all;
	}, {});
};

/**
 * @description - Returns the date of the "nth weekday of the month" (ie 2nd Sunday of the month)
 * @param {Number} nthDay - A numeric (zero-based)index for a month's day (ie 4th Sunday === 3)
 * @param {String} weekday - A string weekday (ie "Sunday", "Friday" etc.)
 * @returns {String}- Returns "3rd Sunday of March"
 */
const getNthDayFromWeekday = (
	nthDay = 1,
	weekday = "Sunday",
	anchorDate = new Date()
) => {
	const dayMap = getWeekDaysInMonth(anchorDate);
	if (dayMap[weekday].length <= nthDay) {
		return `Only ${dayMap[weekday].length} ${weekday}s in the month`;
	}
	return dayMap[weekday][nthDay];
};

// convert a date (ie '02/12/2020') into "3rd Sunday of the month"
/**
 * @description - Convert a date and return "nth word" of the month
 * @param {Date} date - A date that will be transformed into its "nth weekday" (ie 3rd Saturday)
 * @returns {String} - Ex. "It's the 3rd Sunday of March."
 */
const getNthDayFromDate = (date = new Date()) => {
	const dayMap = getWeekDaysInMonth(date);
	const weekDay = format(date, "dddd");
	return dayMap[weekDay].reduce((all, day, index) => {
		if (format(date, "MM/DD/YYYY") === day) {
			return `${formatNthDay(index + 1)} ${format(date, "dddd")}`;
		}
		return all;
	}, 0);
};

// returns "11th" or "2nd" etc - (e.g. the 11th Thursday in Q1)
const getNthDayInQuarter = (date = new Date()) => {
	const quarterMap = getWeekDaysByQuarter(date);
	const weekDay = format(date, "dddd");

	return quarterMap[weekDay].reduce((all, day, index) => {
		if (format(date, "MM/DD/YYYY") === day) {
			return `${formatNthDay(index + 1)}`;
		}
		return all;
	});
};

const getDayInQuarter = (date = new Date()) => {
	const quarterMap = getWeekDaysByQuarter(date);
	const weekDay = format(date, "dddd");

	return quarterMap[weekDay].reduce((all, day, index) => {
		if (format(date, "MM/DD/YYYY") === day) {
			return `${index + 1}`;
		}
		return all;
	});
};

const getElapsedDaysInQuarter = (date = new Date()) => {
	const rangeStart = startOfQuarter(date);
	const rangeEnd = endOfQuarter(date);
	const daysInQtr = eachDay(rangeStart, rangeEnd).map((x) =>
		format(x, "MM/DD/YYYY")
	);
	return daysInQtr.indexOf(format(date, "MM/DD/YYYY"));
};

// RETURNS STRING DESCRIPTION OF A DATE IN CONTEXT
const getNthWeekdayOfQuarter = (date = new Date()) => {
	const nthWeekday = getNthDayInQuarter(date); // 2nd Monday of Q2
	const weekday = format(date, "dddd"); // Monday, Tuesday...
	return `${nthWeekday} ${weekday} `;
};

/**
 * @description - Formats a day as a number (ie 4th)
 * @param {Number} day - A numeric form day (ie Sunday = 0, Saturday = 6)
 * @returns {String} - Returns a string (1st, 2nd, 3rd etc.)
 */
const formatNthDay = (day) => {
	switch (true) {
		case day === 1 || day === 21 || day === 31: {
			return `${day}st`;
		}
		case day === 2 || day === 22: {
			return `${day}nd`;
		}
		case day === 3 || day === 23: {
			return `${day}rd`;
		}
		case day >= 4 && day <= 20: {
			return `${day}th`;
		}

		default:
			return;
	}
};

// returns 10th, or 31st - for the day of the month
const getDayOfMonth = (date = new Date()) => {
	return `${format(date, "Do")}`;
};

//////////////////////////////////////////////////////////////////////
///////////////////// RECURRING SETTINGS HELPERS /////////////////////
////////////////////////////////////////////////////////////////////

// gets the 'initial' value for which day's are selected to recur
const getDefaultDay = (day, task) => {
	const { RecurringDays } = task;
	if (isEmptyArray(RecurringDays)) return "";
	return RecurringDays.includes(day);
};
// gets the 'initial' value for which day's are selected to recur
const getDefaultShift = (shift, task) => {
	const { RecurringShifts } = task;
	if (isEmptyArray(RecurringShifts)) return "";
	return RecurringShifts.includes(shift);
};

const getRepeatOptionsText = (settings) => {
	const { recurringType, repeatStartDate } = settings;
	switch (recurringType) {
		case "Monthly": {
			const weekday = getNthDayFromDate(repeatStartDate);
			const nthDate = getDayOfMonth(repeatStartDate);
			return {
				weekday: `${weekday} of each month`,
				date: `${nthDate} of each month`,
			};
		}
		case "Quarterly": {
			const weekday = getNthWeekdayOfQuarter(repeatStartDate);
			const nthQtr = getElapsedDaysInQuarter(repeatStartDate);
			return {
				weekday: `${weekday} of each quarter`,
				date: `Day ${nthQtr} of each quarter`,
			};
		}
		case "Yearly": {
			const nthDate = getDayOfMonth(repeatStartDate);
			const weekday = getNthDayFromDate(repeatStartDate);
			const mo = format(repeatStartDate, "MMMM");
			return {
				weekday: `${weekday} of ${mo}`,
				date: `${nthDate} of ${mo}`,
			};
		}
		case "This day every month": {
			const nthDate = getDayOfMonth(repeatStartDate);
			const weekday = getNthDayFromDate(repeatStartDate);
			return {
				weekday: `${weekday} of every month`,
				date: `${nthDate} of every month`,
			};
		}
		default:
			throw new Error("❌ Oops. Invalid recurringType", recurringType);
	}
};

// used for the repeat cycle description (ie Occurs every x "days on ")
const getRepeatText = (settings) => {
	const { recurringType, recurringCycle } = settings;
	switch (recurringType) {
		case "Daily": {
			if (recurringCycle > 1) return " days";
			return " days on";
		}
		case "Weekly": {
			return " weeks on";
		}
		case "Monthly": {
			return " months on";
		}
		case "Quarterly": {
			return " quarters on";
		}
		case "Yearly": {
			return " years on";
		}
		case "Bi-Weekly": {
			return " bi-weeks on";
		}
		case "This day every month": {
			return " months";
		}
		default:
			return "";
	}
};

// RETURNS APPROPRIATE TIME UNIT (ie days, weeks etc) based off the "repeatType"
// MOSTLY USED FOR UI ONLY!!
const getRepeatDesc = (type) => {
	switch (type) {
		case "Daily": {
			return " days";
		}
		case "Weekly": {
			return " weeks";
		}
		case "Monthly": {
			return " months";
		}
		case "Quarterly": {
			return " quarters";
		}
		case "Yearly": {
			return " years";
		}
		case "Bi-Weekly": {
			return " bi-weeks";
		}
		case "This day every ": {
			return "";
		}
		default:
			return "";
	}
};

const getCompleteRepeatDesc = (settings) => {
	const { recurringType } = settings;
	if (isEmptyVal(recurringType) || recurringType === "Never") return;
	switch (recurringType) {
		case "Daily": {
			return getDailyDesc(settings);
		}
		case "Weekly": {
			return getWeeklyDesc(settings);
		}
		case "Monthly": {
			return getMonthlyDesc(settings);
		}
		case "Quarterly": {
			return getQuarterlyDesc(settings);
		}
		case "Yearly": {
			return getYearlyDesc(settings);
		}
		case "This day every month": {
			return getThisDayEveryMonthDesc(settings);
		}
		default:
			throw new Error(
				"❌ Oops. Invalid repeat settings (recurringType): ",
				recurringType
			);
	}
};

// determines whether to show the <DayOption/> components
// needs to show for ALL options of Weekly
const showDays = (settings) => {
	const { recurringType, recurringCycle } = settings;
	const dayTypes = ["Daily", "Weekly"];
	if (!dayTypes.includes(recurringType)) return false;
	if (recurringType === "Daily" && Number(recurringCycle) >= 2) return false;
	return true;
};

// determines whether to show the <CycleOption/> components
const showCycleOptions = (currentType) => {
	const cycleTypes = ["Monthly", "Quarterly", "Yearly", "This day every month"];
	if (cycleTypes.includes(currentType)) return true;
	return false;
};
// MODEL UPDATING HELPERS
const getRecurringTypeID = (type) => {
	switch (type) {
		case "Daily":
			return 1;
		case "Weekly":
			return 2;
		case "Bi-weekly":
		case "Bi-Weekly":
			return 3;
		case "Monthly":
			return 4;
		case "Quarterly":
			return 5;
		case "Bi-annual":
		case "Bi-Annual":
			return 6;
		case "Yearly":
		case "Annual":
			return 7;
		case "Never":
			return null;
		default:
			return 0;
	}
};

const getRecurringTypeFromID = (type) => {
	switch (type) {
		case 1:
			return "Daily";
		case 2:
			return "Weekly";
		case 3:
			return "Bi-Weekly";
		case 4:
			return "Monthly";
		case 5:
			return "Quarterly";
		case 6:
			return "Bi-Annual";
		case 7:
			return "Annual";
		case null:
			return "Never";
		default:
			return "Never";
	}
};

///////////////////////////////////////////////////////////////
///////////////// RECURRING TEXT DESCRIPTIONS /////////////////
///////////////////////////////////////////////////////////////

/**
 * @description - Accepts an "unscheduled" task record and checks for what days it repeats on, if applicable. Handles GetResidentDayXXXX & GetUnscheuledTask task formats. (both unscheduled task formats are different) 💡
 * @param {Object} task - An "AssessmentUnscheduleTask" record to retrieve "recurring days" from.
 * @returns {Array} - Returns an array of abbreviated days (ie "Sun", "Mon" etc) as strings.
 */
const getRecurringDays = (task) => {
	if (!isRecurring(task)) return [];
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	if (hasProp(task, "RecurringMon")) {
		return [...days].filter((day) => {
			if (task[`Recurring${day}`]) {
				return day;
			} else {
				return;
			}
		});
	} else {
		const { RecurringDays } = task;
		return [...RecurringDays];
	}
};

/**
 * @description - Returns all dates for a recurring task; formatted in "MM/DD/YYYY hh:mm A" format
 * @param {Object} task - An "AssessmentUnscheduleTask" record typically from the GetResidentDayXXXX API.
 * @returns {Array} - Returns an array of formatted date strings.
 */
const getRecurringDates = (task) => {
	if (isEmptyObj(task)) return [];
	const { RecurringDates } = task;
	if (isEmptyArray(RecurringDates)) return [];
	return RecurringDates.map((date) => format(date, "MM/DD/YYYY"));
};

/**
 * @description - Returns the shifts that a recurring task is scheduled for.
 * @param {Object} task - An "AssessmentUnscheduleTask" record from one of the GetResidentXXX API(s).
 * @returns {Array} - Returns an array of shifts as strings. (ie "AM", "PM", "NOC")
 */
const getRecurringShifts = (task) => {
	if (isEmptyObj(task)) return [];
	const { RecurringShifts } = task;
	if (isEmptyArray(RecurringShifts)) return [];
	return [...RecurringShifts];
};

/**
 * @description - Returns the start and end dates for a recurring task's recurring cycle.
 * @param {Object} task - An unschedule task record.
 * @returns {Object} - Returns an object with "startDate" & "endDate" being returned properties.
 */
const getRecurringStartAndEnd = (task) => {
	if (isEmptyObj(task)) return [];
	let { RecurringStartDate, RecurringEndDate } = task;

	return {
		startDate: isEmptyVal(RecurringStartDate)
			? ""
			: format(RecurringStartDate, "MM/DD/YYYY"),
		endDate: isEmptyVal(RecurringEndDate)
			? ""
			: format(RecurringEndDate, "MM/DD/YYYY"),
	};
};

/**
 * @description - Returns ALL pertinent recurring info for a task.
 * @param {Object} task - A task record to parse.
 * @returns {Object} - Returns an object w/: "recurringDates", "recurringDays", "recurringShifts" "startDate" & "endDate" fields taken from the task record.
 */
const getRecurringDetails = (task) => {
	if (!isRecurring(task)) return {};
	const { startDate, endDate } = getRecurringStartAndEnd(task);
	const dates = getRecurringDates(task);
	const days = getRecurringDays(task);
	const shifts = getRecurringShifts(task);
	return {
		recurringDates: dates,
		recurringDays: days,
		recurringShifts: shifts,
		startDate,
		endDate,
	};
};

// TRANSFORM IDS/NAMES //
export {
	isRecurring,
	hasRecurringType,
	getRecurringTypeID,
	getRecurringTypeFromID,
};

// DETERMINES WHETHER TO SHOW CYCLE OPTIONS OR DAY OPTIONS COMPONENTS
export { showCycleOptions, showDays, daysRange };

// dates converted to and from words
export {
	getWeekDaysInMonth,
	getWeekDaysInRange,
	getWeekDaysByQuarter,
	getNthDayFromWeekday,
	getNthWeekdayOfQuarter,
	getDayInQuarter,
	getNthDayFromDate,
	getNthDayInQuarter,
	getElapsedDaysInQuarter,
	getDayOfMonth,
};

export {
	getDefaultDay,
	getDefaultShift,
	getRepeatText,
	getRepeatDesc,
	getRepeatOptionsText,
	getRepeatDays,
	formatDays,
	formatNthDay,
};

// get repeating descriptions
export {
	getDailyDesc,
	getWeeklyDesc,
	getMonthlyDesc,
	getQuarterlyDesc,
	getYearlyDesc,
	getCompleteRepeatDesc,
};

// get repeating fields' description(s) (<TaskUpdateForm/>)
export {
	getRecurringDays,
	getRecurringDates,
	getRecurringShifts,
	getRecurringStartAndEnd,
	getRecurringDetails,
};
