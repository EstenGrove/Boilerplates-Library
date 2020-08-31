import { test } from "./utils_env";
import { reports } from "./utils_endpoints";
import { isEmptyArray, isEmptyObj, isEmptyVal } from "./utils_types";
import { processShiftTimes, matchShiftByName } from "./utils_shifts";
import { isCompleted } from "./utils_tasks";
import {
	isAfter,
	format,
	subDays,
	startOfDay,
	endOfDay,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
} from "date-fns";

/**
 * @description - Util for fetching past due task records between a start and end date.
 * @param {string} token - A base64 encoded security token generated from the server.
 * @param {string} facilityId - An internal facilityID (ALA-specific)
 * @param {Date} startDate - Start date to grab past records from.
 * @param {Date} endDate - Ending date to grab past records from.
 * @param {number} index - The starting point in the database to begin fetching records from.
 * @param {number} rows - The number of rows(count) from fetch from the database.
 */
const getCommunityPastDue = async (
	token,
	facilityId,
	startDate = subDays(new Date(), 2),
	endDate = new Date(),
	index = 0,
	rows = 50
) => {
	let url = test.base + reports.getPastDueReportByFacility;
	url += "?" + new URLSearchParams({ facilityId });
	url += "&" + new URLSearchParams({ startDate, endDate });
	url += "&" + new URLSearchParams({ index, rows });

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
		console.log("An error occurred ", err);
		return err.message;
	}
};

// fetches the past due records for ONLY a specific day (start of day - end of day)
const getDailyPastDue = async (
	token,
	facilityID,
	startDate = startOfDay(new Date()),
	endDate = endOfDay(new Date()),
	index = 0,
	rows = 25
) => {
	const dayStart = format(startDate, "MM/DD/YYYY");
	const dayEnd = format(endDate, "MM/DD/YYYY");
	const dailyRecords = await getCommunityPastDue(
		token,
		facilityID,
		dayStart,
		dayEnd,
		index,
		rows
	);
	return dailyRecords;
};

// fetches records ONLY for a specific week-long range.
const getWeeklyPastDue = async (
	token,
	facilityID,
	startDate = startOfWeek(new Date()),
	endDate = endOfWeek(new Date()),
	index = 0,
	rows = 25
) => {
	const weekStart = format(startDate, "MM/DD/YYYY");
	const weekEnd = format(endDate, "MM/DD/YYYY");
	const weekRecords = await getCommunityPastDue(
		token,
		facilityID,
		weekStart,
		weekEnd,
		index,
		rows
	);
	return weekRecords;
};

/**
 * @description - Custom wrapper around 'getCommunityPastDue()' util that handles & formats custom date ranges.
 * @param {String} token - Auth token
 * @param {String} facilityId - Unique facility uid.
 * @typedef {Object} "params" - Query params compartmentalized into an object.
 * @property {Date} params.startDate - Raw start date of range.
 * @property {Date} params.endDate - Raw end date of range.
 * @property {Number} params.index - Starting row in database to fetch data from.
 * @property {Number} params.rows - Number of rows from database to fetch data from.
 * @returns {Array} - Returns an array of custom past due records.
 */
const getCustomRangePastDue = async (
	token,
	facilityId,
	params = {
		startDate: new Date(),
		endDate: new Date(),
		index: 0,
		rows: 25,
	}
) => {
	const { startDate, endDate, index, rows } = params;
	const rangeRecords = await getCommunityPastDue(
		token,
		facilityId,
		startDate,
		endDate,
		index,
		rows
	);
	return rangeRecords;
};

// ##TODOS
// 1. FINISH WIRING UP THE VARIOUS CUSTOM RANGES' REQUESTS (for past due records)
/**
 * @description - Reducer helper for fetching past due records via custom ranges; "Custom Range", "By Month", "By Year", "By Day", "By Quarter" etc.
 * @param {Object} vals -An object of user-selected values to request past due records.
 * @param {String} token - A base64 auth token.
 * @param {String} facilityID - A unique id for a facility (ie uid).
 * @param {Number} index - Starting point in the database to fetch data from.
 * @param {Number} rows - Number (count) of rows in the database to fetch data from.
 */
const applySettingsByRange = async (
	vals,
	token,
	facilityID,
	index = 25,
	rows = 50
) => {
	switch (vals.dateRangeType) {
		case "Custom Range": {
			const { startDate, endDate } = vals;
			const rangeRecords = await getCustomRangePastDue(
				token,
				facilityID,
				startDate,
				endDate,
				index,
				rows
			);
			return rangeRecords;
		}
		case "By Day": {
			return;
		}
		case "By Month": {
			return;
		}
		case "By Quarter": {
			return;
		}

		default:
			return;
	}
};

// fetches records ONLY for a specific month
const getMonthlyPastDue = async (
	token,
	facilityID,
	startDate = startOfMonth(new Date()),
	endDate = endOfMonth(new Date()),
	index = 0,
	rows = 25
) => {
	const monthStart = format(startDate, "MM/DD/YYYY");
	const monthEnd = format(endDate, "MM/DD/YYYY");
	const monthRecords = await getCommunityPastDue(
		token,
		facilityID,
		monthStart,
		monthEnd,
		index,
		rows
	);
	return monthRecords;
};

// sorts past due records by resident last name
// accepts an array of past due records (ie the complete record, including resident info)
const sortPastDueRecords = (records) => {
	if (isEmptyArray(records)) return [];
	return records.sort((a, b) => {
		return a.Resident[0].ResidentLastName.localeCompare(
			b.Resident[0].ResidentLastName
		);
	});
};

/**
 * @description - Check is a task is past the 'endTime' of it's scheduled shift.
 * @param {Object} task - A task record ('ADLCareTask' or 'AssessmentUnscheduleTask' record).
 * @param {Date} dueDate - Date instance used to "anchor" the UTC hours & mins to the day the task is due.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' records, including the start & end times for each shift.
 * @returns {Boolean} - Returns true if 'PAST-DUE'.
 * - Updated 8/7/2020 @ 6:44 AM
 */
const isPastDue = (task, dueDate = new Date(), shiftTimes = []) => {
	const { Shift } = task;
	const shiftRecord = matchShiftByName(Shift, shiftTimes);
	const { endTime } = processShiftTimes(shiftRecord, dueDate);
	return isAfter(Date.now(), endTime) && !isCompleted(task);
};

// PAST DUE RECORD HELPERS - PAST DUE REPORT
// grabs the resident's first/last name
const getPastDueResident = (record) => {
	if (isEmptyObj(record)) return;
	const { Resident } = record;
	const [resRecord] = Resident;
	return `${resRecord.ResidentFirstName} ${resRecord.ResidentLastName}`;
};
const getPastDueResidentID = (record) => {
	if (isEmptyObj(record)) return;
	const { Resident } = record;
	const [resRecord] = Resident;
	return resRecord?.ResidentID;
};
// scheduled records
const getPastDueScheduled = (record) => {
	if (isEmptyObj(record)) return;
	const { PastDueScheduleTask } = record;
	return !isEmptyArray(PastDueScheduleTask) ? [...PastDueScheduleTask] : [];
};
// unscheduled records
const getPastDueUnscheduled = (record) => {
	if (isEmptyObj(record)) return;
	const { PastDueUnScheduleTask } = record;
	return !isEmptyArray(PastDueUnScheduleTask) ? [...PastDueUnScheduleTask] : [];
};
// checks the PastDue report records for tasks.
const noPastDueRecords = (record) => {
	const {
		PastDueScheduleTask: scheduled,
		PastDueUnScheduleTask: unscheduled,
	} = record;
	if (isEmptyArray(scheduled) && isEmptyArray(unscheduled)) return true;
	return false;
};
// checks the cloned local state of Past Due report's tasks
const noPastDueTasks = (pastDueTasks = {}) => {
	const { scheduled, unscheduled } = pastDueTasks;
	if (isEmptyArray(unscheduled) && isEmptyArray(scheduled)) return true;
	return false;
};

// totals up the # of past due records for a single resident
const getResidentPastDueCount = (record) => {
	const { length: scheduled } = getPastDueScheduled(record);
	const { length: unscheduled } = getPastDueUnscheduled(record);

	return scheduled + unscheduled;
};

// UPDATE HELPERS //
/**
 * @description - Checks if a task has already been marked 'PAST-DUE', if so, then prevents overwriting it.
 * @param {Object} task - A task record of any type: 'tracking' record or 'UI' task.
 */
const denyPastDueChange = (task) => {
	const { IsPastDue } = task;
	const deny = IsPastDue;
	if (deny) {
		return true;
	} else {
		return false;
	}
};

const excludeCompleted = (completedID, tasks = []) => {
	return tasks.filter((task) => {
		const id =
			task?.AssessmentTrackingTaskId ?? task?.AssessmentUnscheduleTaskId;
		if (id !== completedID) {
			return task;
		}
		return null;
	});
};

// reads from local state clone of records
const countPastDue = (pastDueTasks = {}) => {
	const scheduledCount = isEmptyArray(pastDueTasks?.scheduled)
		? 0
		: pastDueTasks.scheduled.length;
	const unscheduledCount = isEmptyArray(pastDueTasks?.unscheduled)
		? 0
		: pastDueTasks.unscheduled.length;

	return scheduledCount + unscheduledCount;
};

// REQUEST HELPERS
export {
	getCommunityPastDue,
	getDailyPastDue,
	getWeeklyPastDue,
	getMonthlyPastDue,
	getCustomRangePastDue,
	applySettingsByRange,
};

export { sortPastDueRecords };

// EXPORT PAST DUE SHIFT/DATE HELPERS
export {
	isPastDue,
	denyPastDueChange,
	excludeCompleted,
	countPastDue,
	noPastDueTasks,
};

// PAST DUE REPORT - RECORD HELPERS
export {
	getPastDueScheduled,
	getPastDueUnscheduled,
	noPastDueRecords,
	getPastDueResident,
	getPastDueResidentID,
	getResidentPastDueCount,
};
