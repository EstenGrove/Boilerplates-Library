import { test } from "./utils_env";
import * as Sentry from "@sentry/react";
import { shiftTimes } from "./utils_endpoints";
import { isEmptyVal, isEmptyArray } from "./utils_types";
import { isScheduledTask, isPastDue } from "./utils_tasks";
import { FacilityShiftTimesModel } from "./utils_models";
import { convertUTCToLocal, utcToLocal } from "./utils_dates";
import {
	setHours,
	setMinutes,
	format,
	addDays,
	isAfter,
	isBefore,
	isWithinRange,
	getHours,
	getMinutes,
	subDays,
} from "date-fns";

// TODOS:
// - Clean up shift times helpers
// - Clean up 'updateShiftTimesModel' helper
// - Prepare validation helper

//////////////////////////////////////////////////////////////////////
//////////////////// SHIFT TIMES REQUEST HELPERS ////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * @description - Fetches a list of "AssessmentFacilityShift" records, detailing start and endtimes for a facility's shifts.
 * @param {String} token - A base64 encoded auth token.
 * @param {String} facilityID - A string uid for a facility.
 * @returns {Array} - Returns an array of objects. (Array of AssessmentFacilityShift records)
 */
const getShiftTimes = async (token, facilityID) => {
	let url = test.base + shiftTimes.getShiftTimes;
	url += "?" + new URLSearchParams({ facilityId: facilityID });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return err.message;
	}
};

/**
 * @description - POST request helper that updates a single shift time record(start & end time) for a given facility.
 * @param {String} token - A base64 encoded auth token.
 * @param {String} facilityID - A custom facility uid. (unique identifier)
 * @param {Array} shiftTimeRecord - An array of AssessmentFacilityShift records with updated shift time values to be applied.
 */
const saveShiftTimes = async (token, facilityID, shiftTimeRecord) => {
	let url = test.base + shiftTimes.saveShiftTimes;
	url += "?" + new URLSearchParams({ facilityId: facilityID });

	Sentry.captureMessage(`
	StartTime(raw): ${shiftTimeRecord.StartTime}
	EndTime(raw): ${shiftTimeRecord.EndTime}

	StartTime(formatted): ${format(shiftTimeRecord.StartTime, "MM/DD/YYYY hh:mm A")}
	EndTime(formatted): ${format(shiftTimeRecord.EndTime, "MM/DD/YYYY hh:mm A")}
	`);

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(shiftTimeRecord),
		});
		const response = await request.json();
		console.log("✅ SUCCESS! Changes were saved: ", response);
		return response.Data;
	} catch (err) {
		console.log("❌ Oops. Request failed: ", err);
		return err.message;
	}
};
/**
 * @description - POST request helper that updates 1 or more shift times (start & end time) for a given facility.
 * @param {String} token - A base64 encoded auth token.
 * @param {String} facilityID - A custom facility uid. (unique identifier)
 * @param {Array} shiftTimeModels - An array of AssessmentFacilityShift records with updated shift time values to be applied.
 */
const saveShiftTimesMany = async (token, facilityID, shiftTimeRecords) => {
	let url = test.base + shiftTimes.saveShiftTimesMany;
	url += "?" + new URLSearchParams({ facilityId: facilityID });

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(shiftTimeRecords),
		});
		const response = await request.json();
		console.log("✅ SUCCESS! Changes were saved: ", response);
		return response.Data;
	} catch (err) {
		console.log("❌ Oops. Request failed: ", err);
		return err.message;
	}
};

//////////////////////////////////////////////////////////////////////
////////////////////// MISC SHIFT TIMES HELPERS //////////////////////
//////////////////////////////////////////////////////////////////////

// DEFAULT SHIFT TIMES //
const SHIFT_TIMES = {
	AM: {
		startTime: new Date(2020, 3, 15, 7, 0), // 7AM
		endTime: new Date(2020, 3, 15, 16, 0), // 3PM
	},
	PM: {
		startTime: new Date(2020, 3, 15, 16, 0), // 3PM
		endTime: new Date(2020, 3, 16, 23, 0), // 11PM
	},
	NOC: {
		startTime: new Date(2020, 3, 15, 23, 0), // 11PM
		endTime: new Date(2020, 3, 15, 7, 0), // 7AM
	},
};

const getShiftID = (shift) => {
	if (shift === "AM") return 1;
	if (shift === "PM") return 2;
	if (shift === "NOC") return 3;
	return 1;
};

const getShiftName = (id) => {
	if (id === 1) return "AM";
	if (id === 2) return "PM";
	if (id === 3) return "NOC";
	return "AM"; // REMOVED "ANY/ALL" designation, defaults to "AM"
};

const handleShiftLabel = (task, shift) => {
	if (task.ADLCategory === "Meals" && shift.AssessmentShiftId === 1)
		return "Breakfast";
	if (task.ADLCategory === "Meals" && shift.AssessmentShiftId === 2)
		return "Lunch";
	if (task.ADLCategory === "Meals" && shift.AssessmentShiftId === 3)
		return "Dinner";
	if (task.ADLCategory === "Meals" && shift.AssessmentShiftId === 4)
		return "Any";
	return getShiftName(shift.AssessmentShiftId);
};

const getShiftEndTimeFromTask = (shiftID, facilityShiftTimes = []) => {
	const { EndTime: endTime } = matchShiftTimeByID(shiftID, facilityShiftTimes);
	return new Date(endTime);
};

// SORTS AssessmentShift records: AM, PM, NOC
const sortShifts = (shifts) => {
	if (isEmptyArray(shifts)) return [];
	return shifts.sort((a, b) => {
		return a?.AssessmentShiftId - b?.AssessmentShiftId;
	});
};

const matchShiftTimeFromRecords = (shift, shiftTimes) => {
	return shiftTimes.reduce((match, shiftRecord) => {
		if (shiftRecord.AssessmentShiftId === getShiftID(shift)) {
			match = shiftRecord.EndTime;
			return match;
		}
		return match;
	}, "");
};
/**
 * @description - Find matching 'AssessmentFacilityShift' record from the 'AssessmentShiftId'.
 * @param {Number} id - An 'AssessmentShiftId' for the current shift to match for.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' records including 'StartTime' & 'EndTime'.
 * @returns {Object} - Returns the matching record.
 */
const matchShiftTimeByID = (id, shiftTimes = []) => {
	if (isEmptyArray(shiftTimes)) return {};
	return shiftTimes.reduce((matchingShift, record) => {
		if (record.AssessmentShiftId === id) {
			matchingShift = { ...record };
			return matchingShift;
		}
		return matchingShift;
	}, {});
};
/**
 * @description - Finds the matching 'AssessmentFacilityShift' record from a string shift name (ie 'AM', 'PM' or 'NOC').
 * @param {String} shiftName - A string shift name (ie 'AM', 'PM' or 'NOC').
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' records w/ the start & end times for each shift.
 * @returns {Object} - Returns the matching shift times record.
 */
const matchShiftByName = (shiftName, shiftTimes = []) => {
	if (isEmptyArray(shiftTimes)) return {};
	return shiftTimes.reduce((match, record) => {
		if (shiftName === getShiftName(record?.AssessmentShiftId)) {
			match = { ...record };
			return match;
		}
		return match;
	}, {});
};

////////////////////////////////////////////////////////////////////
///////////////// SHIFT TIME PROCESSING & HELPERS /////////////////
////////////////////////////////////////////////////////////////////

const processShiftTimesNEW = (record, anchorDate = new Date()) => {
	const { StartTime, EndTime } = record;
	const startTime = utcToLocal(StartTime);
	const endTime = utcToLocal(EndTime);
	return {
		startTime,
		endTime,
	};
};

/**
 * @description - Extracts the times for from a record (task, shift record) & converts them times to local time. Supports Task records & FacilityShift records.
 * @param {Object} record - An AssessmentFacilityShift or ADLCareTask record.
 * @param {Date} anchorStart - A new Date instance used to "anchor" the 'start time' to a specific day.
 * @param {Date} anchorEnd - A new Date instance used to "anchor" the 'end time' to a specific day.
 * @returns {Object} - Returns an object w/ the 'startTime' & 'endTime' fields converted to the local timezone.
 * DEPRECATED ON 8/26/202 AT 2:27 PM
 */
const DEPRECATED_UTIL_processShiftTimes = (record, anchorDate = new Date()) => {
	const utcStart = record?.ShiftStartTime ?? record?.StartTime;
	const utcEnd = record?.ShiftEndTime ?? record?.EndTime;

	const start = convertUTCToLocal(utcStart, anchorDate);
	const end = convertUTCToLocal(utcEnd, anchorDate);

	return {
		startTime: start,
		endTime: end,
	};
};

// updated 8/26 at 2:27 PM
const processShiftTimes = (record, anchorDate = new Date()) => {
	const { startTime, endTime } = convertShiftTimesToDate(record, anchorDate);
	return {
		startTime,
		endTime,
	};
};

/**
 * @description - Extracts the start and end times from a shift record and transforms them into '07:00 AM' time string format for the UI.
 * @param {Object} shiftRecord - A 'AssessmentFacilityShift' record w/ a shift's start and end times.
 * @returns {Object} - Returns an object with the converted start and end times.
 */
const processShiftTimeToString = (shiftRecord) => {
	const { StartTime, EndTime } = shiftRecord;
	const startTime = format(new Date(StartTime), "hh:mm A");
	const endTime = format(new Date(EndTime), "hh:mm A");
	return {
		startTime,
		endTime,
	};
};

/**
 * @description - Will parse a user-selected time string (hh:mm:ss AM|PM) and return ONLY hh:mm AM|PM format.
 * @param {String} shiftTime - A time selection (used w/ the <TimePicker/>) in hh:mm:ss AM|PM format.
 * @returns {String} - Returns a time string in hh:mm AM|PM format. (ie "04:30 AM", "12:00 PM" etc.)
 * @example
 * const timeSelection = "04:30:00 AM";
 * const formattedTime = formatShiftTime(timeSelection); => "04:30 AM"
 */
const formatShiftTime = (shiftTime) => {
	if (isEmptyVal(shiftTime)) return "";
	const secs = /(?::[0-9]{2})(\s)/gm;
	return shiftTime.replace(secs, " ");
};

const isPastDueShift = (task, dueDate = new Date()) => {
	if (isScheduledTask(task)) {
		const { endTime } = processShiftTimes(task, dueDate);
		return isPastDue(task, endTime);
	} else {
		// handle unscheduled
		const { endTime } = SHIFT_TIMES[getShiftName(task.AssessmentShiftId)];
		return isPastDue(task, endTime);
	}
};

///////////////////////////////////////////////////////////////
/////////////////// SHIFT TIMES CONVERSIONS ///////////////////
///////////////////////////////////////////////////////////////

/**
 * @description - Extracts the hours and minutes from a datetime instance.
 * @param {Date} time - A date that includes the desired time and minutes set already.
 * @returns {Object} - Returns an object w/ the 'hours' and 'minutes' as fields.
 */
const extractShiftTimeParts = (time) => {
	const hrs = getHours(time);
	const mins = getMinutes(time);

	return {
		hrs,
		mins,
	};
};
/**
 * @description - Extracts the hours from 'time' variable and applies them to the 'baseDate'.
 * @param {Date} time - A datetime instance to be converted to a base date.
 * @param {Date} baseDate - The target date to anchor the time to.
 * @returns {Date} - Returns the 'baseDate' w/ the 'time' applied to it.
 */
const convertTimeToDate = (time, baseDate = new Date()) => {
	const { hrs, mins } = extractShiftTimeParts(time);
	const newBase = new Date(baseDate);

	newBase.setHours(hrs);
	newBase.setMinutes(mins);
	return newBase;
};
/**
 * @description - Converts the 'StartTime' & 'EndTime' from a single shift record to local time.
 * @param {Object} shift - An 'AssessmentFacilityShift' record.
 * @returns {Object} - Returns an object w/ the 'startTime' & 'endTime' in local, instead of UTC.
 */
const convertShiftTimesToLocal = (shift) => {
	const utcStart = shift?.ShiftStartTime ?? shift?.StartTime;
	const utcEnd = shift?.ShiftEndTime ?? shift?.EndTime;
	const startTime = utcToLocal(utcStart);
	const endTime = utcToLocal(utcEnd);

	return {
		startTime,
		endTime,
	};
};
/**
 * @description - Converts the start & end times from a shift record and applies them to a target date (ie 'baseDate')
 * @param {Object} shift - An 'AssessmentFacilityShift' record to convert times for.
 * @param {Date} baseDate - The target date to anchor the shift times to, as a base.
 * @returns {Object} - Returns an object w/ the converted start/end times.
 */
const convertShiftTimesToDate = (shift, baseDate = new Date()) => {
	const { startTime, endTime } = convertShiftTimesToLocal(shift);
	// extracts hrs & mins and 'anchors' to 'baseDate'
	let anchorStart = convertTimeToDate(startTime, baseDate);
	let anchorEnd = convertTimeToDate(endTime, baseDate);

	if (!isTimeSerial(anchorStart, anchorEnd)) {
		anchorEnd = addDays(anchorEnd, 1);
	}

	return {
		startTime: anchorStart,
		endTime: anchorEnd,
	};
};

// ##TODOS:
// - Fix 'beforeScheduleStart()' to better handle the 'beforeScheduleStart()'

/**
 * @description - Checks if the current time is *before* the start of 'todays' first shift. (ie is it yesterday's NOC shift?)
 * @param {Array} shiftTimes - Array of facility shift times.
 * @returns {Boolean} - Returns true, if before start of AM shift for today.
 */
const beforeScheduleStart = (shiftTimes = []) => {
	const now = Date.now();
	const shiftAM = matchShiftTimeByID(1, shiftTimes);
	const { startTime } = processShiftTimes(shiftAM, new Date());
	const isBeforeStart = isBefore(now, startTime);
	return isBeforeStart;
};

/**
 * @description - Rewinds the dates to reflect yesterday's NOC schedule and datetimes.
 * @param {Array} allShifts - An array of all shift times.
 * @returns {Object} - Returns object w/ start & end times from yesterday's NOC.
 */
const getYesterdayNOC = (allShifts = []) => {
	if (isEmptyArray(allShifts)) return {};
	const [, , noc] = allShifts;
	const { startTime, endTime } = convertShiftTimesToDate(
		noc,
		subDays(new Date(), 1)
	);

	return {
		startTime,
		endTime,
	};
};

const isBetweenYesterdayNOC = (allShifts) => {
	const { startTime, endTime } = getYesterdayNOC(allShifts);
	const rightNow = new Date(Date.now());

	return isBetween(rightNow, startTime, endTime);
};

/**
 * @description - Tests if 'testDate' falls inbetween 'rangeStart' and 'rangeEnd'
 * @param {Date} testDate - A date to be tested for.
 * @param {Date} rangeStart - The start of the test range.
 * @param {Date} rangeEnd - The end of the test range.
 * @returns {Boolean} - Returns a boolean.
 */
const isBetween = (testDate, rangeStart, rangeEnd) => {
	return isWithinRange(testDate, rangeStart, rangeEnd);
};
/**
 * @description - Finds the current shift name.
 * @param {Array} shifts - An array of 'AssessmentFacilityShiftTimes'.
 * @returns {String} - Returns the name of the current shift (ie 'AM', 'PM' etc)
 */
const getCurrentShift = (allShifts = []) => {
	if (isEmptyArray(allShifts)) return null;
	return allShifts.reduce((currentShift, shift) => {
		const { startTime, endTime } = convertShiftTimesToDate(shift, new Date());
		const rightNow = new Date(Date.now());

		if (isBetween(rightNow, startTime, endTime)) {
			const { AssessmentShiftId: id } = shift;
			currentShift = getShiftName(id);
			return currentShift;
		} else if (isBetweenYesterdayNOC(allShifts)) {
			const { AssessmentShiftId: id } = shift;
			currentShift = getShiftName(id);
			return currentShift;
		} else {
			return currentShift;
		}
	}, "");
};

const getCurrentShiftRecord = (allShifts = []) => {
	if (isEmptyArray(allShifts)) return null;
	return allShifts.reduce((currentShift, shift) => {
		const { startTime, endTime } = convertShiftTimesToDate(shift, new Date());
		const rightNow = new Date(Date.now());

		if (isBetween(rightNow, startTime, endTime)) {
			currentShift = { ...shift };
			return currentShift;
			// rewind dates to yesterday's NOC, then compare
		} else if (
			isBetweenYesterdayNOC(allShifts) &&
			!isBetween(rightNow, startTime, endTime)
		) {
			currentShift = { ...shift };
			return shift;
		}
		return currentShift;
	}, {});
};

////////////////////////////////////////////////////////////////////////////
/////////////////////// UPDATING SHIFT TIMES HELPERS ///////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * @description - Determines the active shift (being updated) to access the formState.values field being updated.
 * @param {Object} shift - An 'AssessmentFacilityShift' record; used to get the shift type/name.
 * @returns {Object} - Returns an object with the localState field names for the active shift.
 */
const getShiftNames = (shift) => {
	const { AssessmentShiftId } = shift;
	return {
		startVal: `${getShiftName(AssessmentShiftId)}ShiftStart`,
		endVal: `${getShiftName(AssessmentShiftId)}ShiftEnd`,
	};
};

/**
 * @description - Returns the user selected shift times to prepare POST request.
 * @param {Object} settings - An object of user-selected values (ie formState.values) with new shift timews.
 * @param {Object} shiftRecord - An 'AssessmentFacilityShift' record to be updated.
 */
const getShiftSelections = (settings, shiftRecord) => {
	const { startVal, endVal } = getShiftNames(shiftRecord);
	const start = settings[`${startVal}`];
	const end = settings[`${endVal}`];

	return {
		startTime: start,
		endTime: end,
	};
};

/**
 * @description - Extracts the 'hours', 'minutes' and 'time-of-day' from a user-selected time string (ie '09:00 AM', '12:00 PM' etc.)
 * @param {String} time - A string time to be parsed.
 * @returns {Object} - Returns an object w/ extracted time bits; hours, minutes and the time-of-day all in number format.
 */
const parseTimeSelection = (time) => {
	if (isEmptyVal(time)) return "";
	const matchTime = /[0-9]{2}/g;
	const [hrs, mins] = time.match(matchTime);
	const [tod] = time.match(/(AM|PM)$/g);
	// convert to 24hr time format (typeof Number)
	const newHrs = tod === "PM" ? Number(hrs) + 12 : Number(hrs);
	const newMins = Number(mins);

	return {
		hrs: newHrs,
		mins: newMins,
		tod,
	};
};

/**
 * @description - Transforms a time string (ie '04:00 AM') into a real ISO date. (ie '2020-05-14T21:00:00Z')
 * @param {String} time - A string-form time to be converted into a date; from the <TimePicker/>
 * @param {Date} base - The 'base' date instance used for converting to a real date format.
 * @returns {Date} - Returns the converted date in ISO format.
 */
const convertTimeStringToDate = (time, base = new Date()) => {
	const { hrs, mins } = parseTimeSelection(time);
	const withHrs = setHours(base, hrs);
	const newTime = setMinutes(withHrs, mins);
	return newTime.toUTCString();
};

// NEW HELPERS //

// checks if the 'endTime' is AFTER the 'startTime'
const isTimeSerial = (start, end) => {
	return isAfter(end, start);
};

/**
 * @description - Extracts the numberic hours, minutes and time of day from the string.
 * @param {String} time - A time string (ie '7:00 AM', '11:30 PM') to be extracted.
 * @returns {Object} - Returns an object with the 'hrs', 'mins' and 'tod'.
 */
const parseTimeToDate = (time) => {
	const matchTime = /^(?<hrs>\d{1,}):(?<mins>\d{2})\s(?<tod>AM|PM)/;
	const matches = time.match(matchTime);
	let { hrs, mins, tod } = matches.groups;

	if (tod === `PM`) {
		hrs = Number(hrs) + 12;
	}

	return {
		hrs: Number(hrs),
		mins: Number(mins),
		tod,
	};
};
const convertTimeStrToDate = (time, base = new Date()) => {
	const { hrs, mins } = parseTimeToDate(time);
	base.setHours(hrs);
	base.setMinutes(mins);
	return base;
};
// this should replace 'convertTimeStringToDate'
const convertSelectionToDate = (settings, shiftRecord) => {
	const { startTime: start, endTime: end } = getShiftSelections(
		settings,
		shiftRecord
	);

	let startTime = convertTimeStrToDate(start, new Date(9998, 11, 31));
	let endTime = convertTimeStrToDate(end, new Date(9998, 11, 31));

	if (shiftRecord?.IsRollOver) {
		endTime = addDays(endTime, 1);
	}

	return {
		startTime,
		endTime,
	};
};

////////////////////////////////////////////////////////////////////
///////////////////// SHIFT TIME MODEL UPDATERS /////////////////////
////////////////////////////////////////////////////////////////////

/**
 * @typedef {Object} "settings" - The user selected values in object form.
 * @property {Date} startTime - The user-selected start time as a date string.
 * @property {Date} endTime - The user-selected end time as a date string.
 * @property {String} facilityID - The facility's uid (unique identifier).
 * @property {Number} recordID - If a shift record ALREADY EXISTS, then apply the "AssessmentFacilityShiftId" (ie. recordID) to the model; else leave blank. The "recordID" is to be included in the "settings" object passed as the 1st param to "updateShiftTimesModel" updater fn.
 *
 * @function updateShiftTimesModel - Function definition:
 * @description - Accepts an object of user selections, inits the shift model, applies the values and returns the exposed model.
 * @param {Object} settings - An object of user-generated/selected values (ir start/end times).
 * @param {(String|Number)} shift - A string or number shift (ie "AM", "PM", "NOC" or 1, 2, 3)
 * @instance - Creates an instance of the "FacilityShiftTimesModel" class.
 * @returns {Object} - Returns the populated "FacilityShiftTimesModel" model ready to be saved to the server(ALA Services API).
 *
 */
// include helper to create actual dates for the shift times
const updateShiftTimesModel = (settings, shiftRecord, facilityID) => {
	// this probably isn't needed anymore
	const { startTime, endTime } = convertSelectionToDate(settings, shiftRecord);

	const base = new FacilityShiftTimesModel();
	base.setFacilityID(facilityID);
	base.setShiftID(shiftRecord.AssessmentShiftId);
	base.setShiftRecordID(shiftRecord?.AssessmentFacilityShiftId ?? null); // MIGHT NEED TO SET TO '0'
	base.setStartAndEndTime(startTime, endTime);
	base.setRollOver(shiftRecord?.AssessmentShiftId === 3);
	return base.getModel();
};

// NEW SHIFT TIME HELEPRS
export {
	isTimeSerial,
	parseTimeToDate,
	convertTimeStrToDate,
	convertSelectionToDate,
};

export {
	getShiftID,
	getShiftName,
	handleShiftLabel,
	sortShifts,
	matchShiftTimeFromRecords,
	matchShiftTimeByID,
	matchShiftByName,
	getShiftEndTimeFromTask,
};

// SHIFT-TIME/PROCESSING RELATED HELEPRS - USED W/ TIMEPICKER (SHIFT TIMES)
export {
	SHIFT_TIMES,
	processShiftTimeToString,
	formatShiftTime,
	parseTimeSelection,
	convertTimeStringToDate,
	// current shift utils
	processShiftTimes,
	isBetween,
	getCurrentShift,
	beforeScheduleStart,
	convertTimeToDate,
	convertShiftTimesToDate,
	getCurrentShiftRecord,
	getYesterdayNOC,
	isBetweenYesterdayNOC,
};

// PAST DUE SHIFT HELPERS
export { isPastDueShift };

// SHIFT TIMES REQUEST UPDATERS
export { getShiftTimes, saveShiftTimes, saveShiftTimesMany };

// SHIFT TIMES UPDATEHELPERS
export { getShiftNames, getShiftSelections };

// SHIFT TIME MODEL UPDATER HELPERS
export { updateShiftTimesModel };
