import { test } from "./utils_env";
import { unscheduledTasks } from "./utils_endpoints";
import { requestParams } from "./utils_params";
import { UnscheduledTaskModel } from "./utils_models";

import { isEmptyArray, isEmptyObj } from "./utils_types";
import { getShiftID, getShiftName } from "./utils_shifts";
import { getCategoryID, getCategoryNameFromID } from "./utils_categories";
import { getPriorityID } from "./utils_priority";
import { replaceNullWithMsg } from "./utils_processing";
import { convertToWeekdays } from "./utils_tasks";
import {
	getRecurringTypeID,
	hasRecurringType,
	isRecurring,
} from "./utils_repeatingTasks";
import { isScheduledTask } from "./utils_tasks";
import { format } from "date-fns";

// GLOBAL TASK UTILS
const UNSCHEDULED_ID = "AssessmentUnscheduleTaskId";

/**
 * @description "CREATE" request to create and save one or more new task records
 * @param {String} token base64 encoded auth token
 * @param {Object} params query params; includes DB and table name
 * @param {Array} tasks array of AssessmentUnscheduleTask models with updated values to save to database
 */
const saveUnscheduledUpdates = async (token, tasks) => {
	let url = test.base + unscheduledTasks.save.taskMany;
	// url += "?" + new URLSearchParams(requestParams.unscheduledTask);

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify([tasks]),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return err.message;
	}
};
/**
 * @description - Fetches a single 'AssessmentUnscheduleTask' record by ID.
 * @param {String} token - An auth security token.
 * @param {Number} AssessmentUnscheduleTaskId - An 'AssessmentUnscheduleTaskId' for the desired task.
 */
const getUnscheduledRecord = async (token, AssessmentUnscheduleTaskId) => {
	let url = test.base + unscheduledTasks.get.task;
	url += "?" + new URLSearchParams({ AssessmentUnscheduleTaskId });

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
 * @description - Fetches a residents' unscheduled task records.
 * @param {string} token - base64 encoded SecurityToken
 * @param {object} params - request params in object form w/ key/value pairs
 * @param {number} residentID - numeric resident id
 */
const getUnscheduledTasks = async (token, residentID) => {
	let url = test.base + unscheduledTasks.get.task;
	url += "?" + new URLSearchParams(requestParams.unscheduledTask);
	url += "&residentId=" + residentID;

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

////////////////////////////////////////////////////
///////// UNSCHEDULED TASK MODEL HANDLERS /////////
//////////////////////////////////////////////////

/**
 * @description - Utility for instantiating a task model, applying user's selections and returning the model for use.
 * @param {Object} vals - A user's selected values in an object.
 * @param {String} residentID - A string resident ID for a selected resident.
 * @param {String} userID - A string user ID for the current user.
 * @returns {Object} - Returns a populated new task model.
 */
const initAndUpdateModel = (vals, residentID, userID) => {
	const base = new UnscheduledTaskModel();
	base.setProperty("ResidentId", residentID);
	base.setProperty("UserId", userID);
	const model = base.getModel();

	return {
		...model,
		AssessmentCategoryId: getCategoryID(vals.newTaskCategory),
		AssessmentTaskStatusId: 4, // NOT-COMPLETE,
		AssessmentShiftId: getShiftID(vals.newTaskShift),
		AssessmentPriorityId: getPriorityID(vals.newTaskPriority),
		CreatedDate: new Date().toUTCString(),
		EntryDate: new Date().toUTCString(),
		CompletedDate: null,
		SignedBy: replaceNullWithMsg(vals.newTaskSignature, ""),
		Notes: replaceNullWithMsg(vals.newTaskNotes, ""),
		Description: vals.newTaskName,
		IsCompleted: false,
		IsFinal: false,
		IsLocked: vals.isLocked,
	};
};

/**
 * @description - A helper to map recurring task settings to the task model.
 * @param {Object} vals - An object of form values from user selections.
 * @param {Object} model - An "UnscheduledTaskModel" instance w/ already updated form values, including residentID & userID.
 */
const mapRecurringSettingsToModel = (vals, model) => {
	const isAM = vals.newTaskShift === "AM" ? 1 : null;
	const isPM = vals.newTaskShift === "PM" ? 1 : null;
	const isNOC = vals.newTaskShift === "NOC" ? 1 : null;

	return {
		...model,
		AssessmentRecurringId: getRecurringTypeID(vals.recurringType),
		RecurringStartDate: vals.startDate,
		RecurringEndDate: vals.endDate,
		RecurringMon: vals.isRecurringMon,
		RecurringTue: vals.isRecurringTue,
		RecurringWed: vals.isRecurringWed,
		RecurringThu: vals.isRecurringThu,
		RecurringFri: vals.isRecurringFri,
		RecurringSat: vals.isRecurringSat,
		RecurringSun: vals.isRecurringSun,
		RecurringAMShiftId: isAM,
		RecurringPMShiftId: isPM,
		RecurringNOCShiftId: isNOC,
	};
};

/**
 * @description - Utility that handles updating/populating a new task model to be saved to the database. Handles recurring task settings as well.
 * @param {Object} vals - A user's selected values in a form vals object.
 * @param {String} residentID - A string resident ID.
 * @param {String} userID - A string user ID (ie the current user's ID)
 * @returns {Object} - Returns a populated and ready "UnscheduledTaskModel" record ready to be submitted to server.
 */
const updateNewTaskModel = (vals, residentID, userID) => {
	const model = initAndUpdateModel(vals, residentID, userID);
	// handle recurring task settings
	if (hasRecurringType(vals.recurringType)) {
		const updatedModel = mapRecurringSettingsToModel(vals, model);
		return { ...updatedModel };
		// handle non-recurring task settings
	} else {
		return { ...model };
	}
};

///////////////////////////////////////////////////////
///////// UNSCHEDULED TASK CRITERIA MATCHERS /////////
/////////////////////////////////////////////////////

// checks recurring options to find a match for a weekday
const matchRecurringDay = (task, day = "Sunday") => {
	const { RecurringDates } = task;
	const abbrvDay = day.slice(0, 3);
	const recurringDates = RecurringDates.map((x) => format(x, "ddd"));
	if (recurringDates.includes(abbrvDay)) {
		return task;
	} else {
		return;
	}
};

// checks a tasks' recurring options for a day match
const matchesRecurringDayBoolean = (task, day) => {
	const { RecurringDates } = task;
	const abbrvDay = day.slice(0, 3);
	const recurringDates = RecurringDates.map((x) => format(x, "ddd"));
	if (recurringDates.includes(abbrvDay)) {
		return true;
	} else {
		return false;
	}
};

// checks if task has shift match (includes recurring shifts)
const matchesShiftBoolean = (task, shift) => {
	const { AssessmentShiftId, RecurringShifts: recurringShifts } = task;
	if (
		getShiftName(AssessmentShiftId) === shift ||
		recurringShifts.includes(shift)
	) {
		return true;
	} else {
		return false;
	}
};

/**
 * - UPDATED as of 6/17/2020 8:00 AM
 * @description - Updated helper for quickly matching a task by ADL category.
 * @param {Object} task - Any task record, including 'ADLCareTask'(scheduled) & 'AssessmentUnscheduleTask'(unscheduled) to test.
 * @param {String} adl - A string-form ADL category (ie 'Ambulation', 'Bathing' etc) to match against.
 */
const matchesADLBoolean = (task, adl) => {
	const adlID = getCategoryID(adl);
	const { AssessmentCategoryId } = task;
	return adlID === AssessmentCategoryId;
};
const matchesDayBoolean = (task, day) => {
	if (isRecurring(task)) {
		const dates = convertToWeekdays(task.RecurringDates);
		return dates.includes(day);
	} else {
		const tasksDate = task?.DayOfWeek ?? format(task.TaskDate, "dddd");
		return tasksDate === day;
	}
};

const matchesADLAndDayBoolean = (task, adl, day) => {
	if (matchesADLBoolean(task, adl) && matchesDayBoolean(task, day)) {
		return true;
	} else {
		return false;
	}
};

/**
 * @description - Checks if a task's "FollowUpDate" and/or "TaskDate" matches a given weekday (such as "Sunday")
 * @param {Object} task - A task record (typically an "AssessmentUnscheduleTask" record.)
 * @param {String} day - A weekday as a string (ie "Sunday") to match.
 * @returns {Object|Null} - Returns the task if a match is found (by date), otherwise returns nothing (ie null)
 */
const matchNonRecurringDay = (task, day) => {
	const { FollowUpDate, TaskDate } = task;
	const followUp = format(FollowUpDate, "dddd");
	const taskDate = format(TaskDate, "dddd");
	if (day === taskDate || day === followUp) {
		return task;
	} else {
		return;
	}
};

const matchAllDates = (task, dateToMatch = new Date()) => {
	const { TaskDate, FollowUpDate } = task;
	const matchMe = format(dateToMatch, "MM/DD/YYYY");
	if (
		format(TaskDate, "MM/DD/YYYY") === matchMe ||
		format(TaskDate, "MM/DD/YYYY") === FollowUpDate
	) {
		return task;
	} else {
		return;
	}
};

/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// UNSCHEDULED TASK FILTERING/SORTING //////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * @description - Returns ALL Recurring unscheduled tasks that occur of a given weekday (ie occurs on "Monday")
 * @param {Array} tasks - An array of AssessmentUnscheduleTask(s).
 * @param {String} day - A string-form weekday (ie Monday, Tuesday, Wednesday etc..)
 */
const findRecurringByDay = (tasks, day = "Sunday") => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => {
		if (isRecurring(task)) {
			// handles recurring tasks
			return matchRecurringDay(task, day);
		} else {
			// handles non-recurring tasks by checking FollowUpDate & TaskDate
			return matchAllDates(task, new Date());
		}
	});
};

const findUnscheduledByADL = (tasks, adl) => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => {
		if (matchesADLBoolean(task, adl)) {
			return task;
		} else {
			return;
		}
	});
};

const findUnscheduledByShift = (tasks, shift) => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => {
		if (matchesShiftBoolean(task, shift)) {
			return task;
		} else {
			return;
		}
	});
};

/**
 * @description - Finds unscheduled tasks scheduled for a given weekday. Checks both recurring options and task dates.
 * @param {Array} tasks  - An array of UI task records (ie 'ADLCareTask' & 'AssessmentUnscheduleTask' tasks).
 * @param {String} day - A string-form weekday (ie. 'Tuesday', 'Sunday' etc.)
 * - Updated 6/16/2020 1:12 PM
 */
const findUnscheduledByDay = (tasks, day = "Sunday") => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => {
		if (isScheduledTask(task)) return;
		if (isRecurring(task)) {
			return matchRecurringDay(task, day);
		} else {
			return matchNonRecurringDay(task, day);
		}
	});
};

const findUnscheduledByDayAndADL = (unscheduledTasks, day, adl) => {
	if (isEmptyArray(unscheduledTasks)) return [];
	const byDay = findUnscheduledByDay(unscheduledTasks, day);
	const byDayAndADL = findUnscheduledByADL(byDay, adl);
	return byDayAndADL;
};

const findUnscheduledByAdlDayAndShift = (tasks, adl, day, shift) => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => {
		if (
			matchesADLAndDayBoolean(task, adl, day) &&
			matchesShiftBoolean(task, shift)
		) {
			return task;
		} else {
			return;
		}
	});
};

/**
 * @description - Find a (modified) "Unscheduled" tasks matching "AssessmentUnscheduleTask" record.
 * @param {Object} activeTask - An "AssessmentUnscheduleTask" record (w/ property additions) used to find its matching 'Raw' record.
 * @param {Array} unscheduledRaw - An array of (unmodified) "AssessmentUnscheduleTask" records that match the corresponding table in the database.
 * @returns {Object} - Returns the matching 'AssessmentUnscheduleTask' record; otherwise an empty object is returned (ie {}).
 */
const findUnscheduledRecord = (activeTask, unscheduledRaw = []) => {
	return unscheduledRaw.reduce((match, current) => {
		if (activeTask[UNSCHEDULED_ID] === current[UNSCHEDULED_ID]) {
			match = { ...current };
			return match;
		}
		return isEmptyObj(match) ? activeTask : match;
	}, {});
};

// REQUEST HELPERS
export { saveUnscheduledUpdates, getUnscheduledTasks, getUnscheduledRecord };

// RECURRING TASKS & MODEL UPDATERS
export { initAndUpdateModel, mapRecurringSettingsToModel, updateNewTaskModel };

// ADL, DAY, SHIFT, RECURRING, NON-RECURRING MATCHERS
export {
	matchRecurringDay,
	matchesRecurringDayBoolean,
	matchesADLBoolean,
	matchesDayBoolean,
	matchesShiftBoolean,
	matchesADLAndDayBoolean,
	matchAllDates, // secondary usage
};

// FILTERING/SORTING TASKS
export {
	findUnscheduledRecord,
	findRecurringByDay,
	findUnscheduledByADL,
	findUnscheduledByDay,
	findUnscheduledByShift,
	findUnscheduledByDayAndADL,
	findUnscheduledByAdlDayAndShift,
};
