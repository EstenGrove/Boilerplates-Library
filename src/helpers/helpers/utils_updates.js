import { test } from "./utils_env";
import { scheduledTasks, unscheduledTasks } from "./utils_endpoints";
import { isEmptyArray, isEmptyVal, isEmptyObj, hasProp } from "./utils_types";
import { replaceNullWithMsg } from "./utils_processing";
import { getShiftID } from "./utils_shifts";
import { getResolutionID } from "./utils_resolution";
import {
	saveUnscheduledUpdates,
	getUnscheduledRecord,
} from "./utils_unscheduled";
import {
	saveScheduledUpdates,
	isScheduledTask,
	toggleComplete,
	toggleCompleteByADL,
	getTaskID,
	findTasksByADL,
	isUITask,
	getScheduledRecord,
	checkForPastDue,
	getTaskIdType,
	getTaskType,
	isException,
} from "./utils_tasks";
import { getExceptionID, hasException } from "./utils_exceptions";
import { getRecurringTypeID } from "./utils_repeatingTasks";
import { denyPastDueChange } from "./utils_pastdue";
import { format, startOfWeek, endOfWeek, eachDay } from "date-fns";
import * as Sentry from "@sentry/react";
import { getCategoryNameFromID } from "./utils_categories";

// TASK IDS BY TYPE
const SCHEDULED_ID = "AssessmentTrackingTaskId";
const UNSCHEDULED_ID = "AssessmentUnscheduleTaskId";

/////////////////////////////////////////////////////////////////
///////////// TASK RECORD UPDATE HELPERS (PAST-DUE) /////////////
/////////////////////////////////////////////////////////////////

// updates a single 'scheduled' tracking record
const saveScheduledRecord = async (token, record) => {
	let url = test.base + scheduledTasks.save.task;
	url +=
		"?" +
		new URLSearchParams({
			AssessmentTrackingTaskId: record?.AssessmentTrackingTaskId,
		});

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(record),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return err.message;
	}
};
// updates a single 'unscheduled' tracking record
const saveUnscheduledRecord = async (token, record) => {
	let url = test.base + unscheduledTasks.save.task;
	url +=
		"?" +
		new URLSearchParams({
			AssessmentUnscheduleTaskId: record?.AssessmentUnscheduleTaskId,
		});

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(record),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return err.message;
	}
};

// checks task type, fires off 'SAVE' request
const savePastDueTracking = async (token, record) => {
	if (isScheduledTask(record)) {
		return await saveScheduledRecord(token, record);
	} else {
		return await saveUnscheduledRecord(token, record);
	}
};
const getPastDueTracking = async (token, task) => {
	if (isScheduledTask(task)) {
		const { AssessmentTrackingTaskId: id } = task;
		const [tracking] = await getScheduledRecord(token, id);
		return tracking;
	} else {
		const { AssessmentUnscheduleTaskId: id } = task;
		const [tracking] = await getUnscheduledRecord(token, id);
		return tracking;
	}
};

const markCompleteTracking = (record, currentShiftID) => {
	return {
		...record,
		IsCompleted: true,
		CompletedDate: new Date().toUTCString(),
		CompletedAssessmentShiftId: currentShiftID,
		AssessmentTaskStatusId: 2,
	};
};

/////////////////////////////////////////////////////////////////
//////////////// TASK RECORD UPDATE MINI-HELPERS ////////////////
/////////////////////////////////////////////////////////////////

/**
 * @description - Creates 'timestamp' message w/ the date & time something was changed/edited.
 * @param {Date} date - A date instance used as the base for the formatted timestamp.
 * @returns {String} - Returns formatted string w/ the data & time. Format: '- Updated MM/DD/YYYY at hh:mm AM|PM'
 */
const addTimeStamp = (date = new Date()) => {
	const newDate = format(date, "MM/DD/YYYY");
	const msg = `- Updated ${newDate} at ${format(date, "hh:mm A")}`;
	return msg;
};

/**
 * @description - Merges & formats existing task notes with newly entered notes.
 * Details:
 * Will check for new & existing notes (including 'reassess notes')
 * ...and merge them together in the 'Notes' field and add a timestamp.
 * @param {Object} vals - An object of "user-selected" values.
 * @param {String} prevNotes - The existing notes for the current active task being updated.
 */
const mergeTaskNotes = (vals, prevNotes) => {
	let newNotes = `${replaceNullWithMsg(prevNotes, "")}`;
	newNotes += ` \n\n`;
	if (vals.reassess) {
		// only 'reassessNotes' applied
		if (isEmptyVal(vals.taskNotes)) {
			newNotes += `Reassess: ${vals.reassessNotes} \n\n `;
			newNotes += `${addTimeStamp()}`;
			return newNotes;
		}
		// 'reassessNotes' & 'taskNotes' applied
		newNotes += `Updated: ${vals.taskNotes} \n\n`;
		newNotes += `Reassess: ${vals.reassessNotes} \n\n`;
		newNotes += ` ${addTimeStamp()}`;
		return newNotes;
	} else {
		// no new notes applied; returns original notes
		if (isEmptyVal(vals.taskNotes)) {
			return newNotes;
		}
		// only 'taskNotes' applied
		newNotes += `Updated: ${vals.taskNotes} \n\n`;
		newNotes += ` ${addTimeStamp()}`;
		return newNotes;
	}
};

/////////////////////////////////////////////////////////////////
////////////// SCHEDULED|UNSCHEDULED TASK UPDATES //////////////
/////////////////////////////////////////////////////////////////

/**
 * @description - Find an "ADLCareTask"s matching tracking record.
 * @param {Object} activeTask - An "ADLCareTask" used to find its matching 'Tracking' record.
 * @param {Array} trackingTasks - An array of "AssessmentTrackingTask" records, to search for a match in.
 * @returns {Object} - Returns the matching "AssessmentTrackingTask" record; otherwise an empty object is returned (ie {}).
 */
const findTrackingRecord = (activeTask, trackingTasks = []) => {
	return trackingTasks.reduce((match, current) => {
		if (activeTask[SCHEDULED_ID] === current[SCHEDULED_ID]) {
			match = { ...current };
			return match;
		}
		return match;
	}, {});
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

/**
 * @description - Returns an active task's matching record to be updated and saved to ALA Services. (Supports 'scheduled'/'unscheduled')
 * @param {Object} activeTask - An active task: "ADLCareTask" or a modified "AssessmentUnscheduleTask" record.
 * @param {Array} trackingTasks - An array of "AssessmentTrackingTask" records to check for matches.
 * @param {Array} unscheduledTasksRaw - An array of "AssessmentUnscheduleTask" records to check for matches.
 * @returns {Object} - Returns the matching record, or an empty object (ie {}) if not match is found.
 */
const findMatchingRecord = (
	activeTask,
	trackingTasks = [],
	unscheduledTasksRaw = []
) => {
	if (isScheduledTask(activeTask)) {
		const matchingRecord = findTrackingRecord(activeTask, trackingTasks);
		return matchingRecord;
	} else {
		const matchingRecord = findUnscheduledRecord(
			activeTask,
			unscheduledTasksRaw
		);
		return matchingRecord;
	}
};

/**
 * @description - Applies "user-selected" values to an "ADLCareTask" record.
 * @param {Object} vals - An object of 'user-selected' values to be applied.
 * @param {Object} recordToUpdate - A task record (ie "ADLCareTask") to be updated.
 * @return {Object} - Returns the updated task record w/ the applied form values.
 */
const applyScheduledUpdates = (vals, recordToUpdate) => {
	const { shift, signature, reassess } = vals;
	if (reassess) {
		return {
			...recordToUpdate,
			AssessmentTaskStatusId: 2,
			CompletedAssessmentShiftId: getShiftID(shift),
			AssessmentShiftId: getShiftID(shift),
			AssessmentResolutionId: getResolutionID("COMPLETED-REASSESSMENT-NEEDED"),
			AssessmentReasonId: 6,
			IsCompleted: true,
			Notes: mergeTaskNotes(vals, recordToUpdate.Notes),
			SignedBy: signature,
			CompletedDate: new Date().toUTCString(),
		};
	} else {
		return {
			...recordToUpdate,
			AssessmentTaskStatusId: 2,
			CompletedAssessmentShiftId: getShiftID(shift),
			AssessmentShiftId: getShiftID(shift),
			AssessmentResolutionId: getResolutionID("COMPLETED"),
			AssessmentReasonId: 6,
			IsCompleted: true,
			Notes: mergeTaskNotes(vals, recordToUpdate.Notes),
			SignedBy: signature,
			CompletedDate: new Date().toUTCString(),
		};
	}
};

/**
 * @description - Applies 'user-selected' values to an unscheduled task record, prior to sending to ALA Services.
 * @param {Object} vals - An object of 'user-selected' values from the "Advanced Options" modal.
 * @param {Object} recordToUpdate - An "AssessmentUnscheduleTask" record, to be updated w/ user values.
 * @returns {Object} - Returns the updated "AssessmentUnscheduleTask" record, w/ the applied user values.
 */
const applyUnscheduledUpdates = (vals, recordToUpdate) => {
	const { shift, signature, reassess } = vals;

	if (reassess) {
		return {
			...recordToUpdate,
			AssessmentTaskStatusId: 2,
			CompletedAssessmentShiftId: getShiftID(shift),
			AssessmentShiftId: getShiftID(shift),
			AssessmentResolutionId: getResolutionID("COMPLETED-REASSESSMENT-NEEDED"),
			AssessmentReasonId: 6,
			IsCompleted: true,
			Notes: mergeTaskNotes(vals, recordToUpdate.Notes),
			SignedBy: signature,
			CompletedDate: new Date().toUTCString(),
		};
	} else {
		return {
			...recordToUpdate,
			AssessmentTaskStatusId: 2,
			CompletedAssessmentShiftId: getShiftID(shift),
			AssessmentShiftId: getShiftID(shift),
			AssessmentResolutionId: getResolutionID("COMPLETED"),
			AssessmentReasonId: 6,
			IsCompleted: true,
			Notes: mergeTaskNotes(vals, recordToUpdate.Notes),
			SignedBy: signature,
			CompletedDate: new Date().toUTCString(),
		};
	}
};

/**
 * @description - Finds the matching task record, applies user-selected values & submits/saves to the server (ALA Services)
 * Supports: Scheduled("ADLCareTask") & Unscheduled("AssessmentUnscheduleTask") record.
 * @param {String} token - A base64 encoded auth token.
 * @param {Object} vals - An object of "user-selected" form values (from the <TaskUpdateForm/>).
 * @param {Object} activeTask - An active task record to apply updates for. (ie "Scheduled"/"Unscheduled" task).
 * @param {Array} trackingTasks - An array of AssessmentTrackingTask records used server-side in the database.
 * @param {Array} unscheduledTasksRaw - An array of unmodified AssessmentUnscheduleTask records, used for updates.
 */
const findAndApplyTaskUpdates = async (
	token,
	vals,
	activeTask,
	trackingTasks = [],
	unscheduledTasksRaw = []
) => {
	if (isScheduledTask(activeTask)) {
		// find trackingRecord, apply updates, send request
		const matchingRecord = findMatchingRecord(activeTask, trackingTasks);
		const updatedRecord = applyScheduledUpdates(vals, matchingRecord);
		return await saveScheduledUpdates(token, updatedRecord);
	} else {
		// find unscheduledRaw record, apply updates, send request
		const matchingRecord = findUnscheduledRecord(
			activeTask,
			unscheduledTasksRaw
		);
		const updatedRecord = applyUnscheduledUpdates(vals, matchingRecord);
		return await saveUnscheduledUpdates(token, updatedRecord);
	}
};

// custom resolver/wrapper around updater fn
const taskResolver = async (
	token,
	vals,
	activeTask,
	trackingTasks,
	unscheduledTasksRaw
) => {
	const taskID =
		activeTask?.AssessmentTrackingTaskId ??
		activeTask.AssessmentUnscheduleTaskId;
	const response = await findAndApplyTaskUpdates(
		token,
		vals,
		activeTask,
		trackingTasks,
		unscheduledTasksRaw
	);
	if (response) {
		return response.includes(taskID);
	}
	return response;
};

// pure request fn - only handles server updates
const applyTaskChanges = async (token, updatedTask) => {
	if (isScheduledTask(updatedTask)) {
		const response = await saveScheduledUpdates(token, updatedTask);
		return response;
	} else {
		const response = await saveUnscheduledUpdates(token, updatedTask);
		return response;
	}
};

// applies server-side updates from the "quick-complete" actions
const applyQuickComplete = async (token, task, trackingTasks) => {
	if (isScheduledTask(task)) {
		// handle scheduled task request here...
		const matchingRecord = findMatchingRecord(task, trackingTasks);
		const response = await saveScheduledUpdates(token, matchingRecord);
		return response;
	} else {
		// handle unscheduled task request here...
		const response = await saveUnscheduledUpdates(token, task);
		return response;
	}
};

// finds matching record, toggles it complete/not-complete, sends requet
const recordQuickComplete = async (
	token,
	activeTask,
	trackingTasks,
	unscheduledTasksRaw
) => {
	const matchingRecord = findMatchingRecord(
		activeTask,
		trackingTasks,
		unscheduledTasksRaw
	);

	const completedRecord = toggleComplete(matchingRecord);
	const response = await applyTaskChanges(token, completedRecord);

	if (response) {
		Sentry.captureMessage(`
		RecordQuickComplete: toggleCompleteHandler() (<DailySummaryListItem/>:174)
		CompletedTracking: ${getTaskID(completedRecord)}
		CompletedDate: ${completedRecord?.CompletedDate}
		RequestStatus: SUCCESS
		`);

		return response;
	} else {
		Sentry.captureMessage(`
		RecordQuickComplete: toggleCompleteHandler() (<DailySummaryListItem/>:174)
		CompletedTracking: ${getTaskID(completedRecord)}
		CompletedDate: ${completedRecord?.CompletedDate}
		RequestStatus: FAILED
		`);

		return response;
	}
};

///////////////////////////////////////////////////////////////////////
///////////////// MARK ALL COMPLETE HELPERS/HANDLERS /////////////////
///////////////////////////////////////////////////////////////////////

/**
 * @description - Finds the matching records (multiple) given a list of tasks.
 * @param {Array} activeTasks - An array of active task records (supports 'scheduled'|'unscheduled' tasks).
 * @param {Array} scheduledRecords - An array of 'AssessmentTrackingTask' records.
 * @param {Array} unscheduledRecords - An array of 'UnscheduleRaw' task records.
 * @return {Array} - Returns an array of matching records to be updated.
 */
const findAllMatchingRecords = (
	activeTasks,
	scheduledRecords = [],
	unscheduledRecords = []
) => {
	const matchingRecords = activeTasks.map((active, idx) => {
		const match = findMatchingRecord(
			active,
			scheduledRecords,
			unscheduledRecords
		);
		return match;
	});
	return [...matchingRecords];
};

/**
 * @description - Returns an object w/ the provided tracking records grouped by type: 'Scheduled' & 'Unscheduled'.
 * - Will initialize a tracking type w/ an empty [], if there's no records for that type.
 * - Used w/ the "markAllComplete" feature. This separates the record types for sending requests.
 * @param {Array} allPendingRecords - List of pending tracking records needing to be sent server-side to be updated.
 * @returns {Object} - Returns an object w/ 'Scheduled' & 'Unscheduled' properties w/ their respective records in an array.
 */
const groupTrackingByType = (allPendingRecords) => {
	// sets keys in object by task
	const iteratee = (task) =>
		isScheduledTask(task) ? "Scheduled" : "Unscheduled";
	return allPendingRecords.reduce((acc, item) => {
		const keyToSortBy = iteratee(item);
		if (!acc[keyToSortBy]) {
			acc[keyToSortBy] = [];
		}
		acc[keyToSortBy].push(item);
		return {
			Scheduled: acc?.Scheduled ?? [],
			Unscheduled: acc?.Unscheduled ?? [],
		};
	}, {});
};

/**
 * @description - 'Mark All Complete' handler. Toggles UI tasks by ADL, finds/updates tracking records, returns tracking grouped by task type.
 * @param {Array} allTasks - An array of UI task records (ie 'ADLCareTask', 'AssessmentUnscheduleTask').
 * @param {String} adl - An 'AssessmentCategory' string for the active 'card' being updated.
 * @param {Array} scheduledRecords - An array of ALL 'AssessmentTrackingTask' records; used for tracking.
 * @param {Array} unscheduledRecords - An array of ALL 'AssessmentUnscheduleTaskRaw' records; used for tracking.
 * @returns {Object} - Returns an object w/ 'Scheduled' & 'Unscheduled' as properties to access each updated record by type.
 * - "updated.Scheduled": updated 'AssessmentTrackingTask' records, ready to be sent to ALA Services.
 * - "updated.Unscheduled": updated 'AssessmentUnscheduleTaskRaw' records, ready to be sent to ALA Services.
 */
const markCompleteTasksAndRecords = (
	allTasks,
	adl,
	scheduledRecords = [],
	unscheduledRecords = []
) => {
	const updatedAllTasks = toggleCompleteByADL(allTasks, adl);
	const activeUpdateTasks = findTasksByADL(updatedAllTasks, adl);
	// find matching records, & apply updates at same time
	const updatedTracking = copyTaskUpdatesToRecords(
		activeUpdateTasks,
		scheduledRecords,
		unscheduledRecords
	);
	return groupTrackingByType(updatedTracking);

	// send requests to server
};

/**
 * @description - Finds matching tracking records for tasks, then copies each task's status/state over to its tracking record.
 * @param {Array} updatedActiveTasks - An array of already updated UI tasks (may include scheduled & unscheduled tasks).
 * @param {Array} scheduledRecords - An array 'Scheduled' tracking records ('AssessmentTrackingTask' records).
 * @param {Array} unscheduledRecords - An array of 'Unscheduled' tracking records ('AssessmentUnscheduleTaskRaw' records).
 * @returns {Array} - Returns an array of ALL current & updated tracking records; now matches their UI task's state.
 */
const copyTaskUpdatesToRecords = (
	updatedActiveTasks,
	scheduledRecords = [],
	unscheduledRecords = []
) => {
	// find matching records
	// copy changes/updates from UI tasks to tracking records
	const matchingRecords = findAllMatchingRecords(
		updatedActiveTasks,
		scheduledRecords,
		unscheduledRecords
	);
	return matchingRecords.reduce((updatedTracking, curTracking, idx) => {
		const currentTask = updatedActiveTasks[idx];
		// apply updated task status to tracking record
		if (getTaskID(curTracking) === getTaskID(currentTask)) {
			const {
				AssessmentTaskStatusId,
				IsCompleted,
				CompletedAssessmentShiftId,
				CompletedDate,
			} = currentTask;
			const updatedMatch = {
				...curTracking,
				IsCompleted: IsCompleted,
				AssessmentTaskStatusId: AssessmentTaskStatusId,
				CompletedAssessmentShiftId: CompletedAssessmentShiftId,
				CompletedDate: CompletedDate,
			};
			updatedTracking.push(updatedMatch);
			return updatedTracking;
		}
		return updatedTracking;
	}, []);
};

/**
 * @description - Determines which records require updating and which request(s) to send. Then makes the required request(s).
 * @param {String} token - Base64 encoded auth/security token.
 * @param {Array} pendingScheduled - An array of pending 'AssessmentTrackingTask' records to be sent to ALA Services.
 * @param {Array} pendingUnscheduled - An array of pending 'AssessmentUnscheduleTaskRaw' records to be sent to ALA Services.
 * @returns {Array} - Returns 1 of 3 responses:
 * - An array w/ two nested arrays containing ALL task IDs that were updated.
 * - An array ONLY containing the scheduled IDs that were updated
 * - An array ONLY containing the unscheduled IDs that were updated.
 */
const savePendingRecords = async (
	token,
	pendingScheduled,
	pendingUnscheduled
) => {
	let isPendingScheduled = !isEmptyArray(pendingScheduled);
	let isPendingUnscheduled = !isEmptyArray(pendingUnscheduled);
	let bothPending = isPendingScheduled && isPendingUnscheduled;

	// fire-off BOTH 'scheduled' & 'unscheduled' updates
	if (bothPending) {
		return await Promise.all([
			saveScheduledUpdates(token, pendingScheduled),
			saveUnscheduledUpdates(token, pendingUnscheduled),
		]);
	}

	// ONLY fire-off 'scheduled' updates
	if (isPendingScheduled) {
		return await saveScheduledUpdates(token, pendingScheduled);
	}
	// ONLY fire-off 'unscheduled' updates
	if (isPendingUnscheduled) {
		return await saveUnscheduledUpdates(token, pendingUnscheduled);
	}
};

////////////////////////////////////////////////////////////////////
//////////// NEW 'SINGLE-RESPONSIBILITY' UPDATE HELPERS ////////////
////////////////////////////////////////////////////////////////////

const getWeekDays = () => {
	const start = startOfWeek(new Date());
	const end = endOfWeek(new Date());
	return eachDay(start, end).map((day) => format(day, "ddd"));
};

const getChangedDays = (vals) => {
	const base = `isRecurring`;
	const days = getWeekDays();

	return days.filter((day) => {
		const prop = [`${base}${day}`];
		if (vals[prop]) {
			return day;
		}
		return;
	});
};
const getChangedShifts = (vals) => {
	const { isRecurringAM, isRecurringPM, isRecurringNOC } = vals;
	const hasAM = isRecurringAM ? "AM" : null;
	const hasPM = isRecurringPM ? "PM" : null;
	const hasNOC = isRecurringNOC ? "NOC" : null;
	const newShifts = [hasAM, hasPM, hasNOC].filter((x) => Boolean(x));

	return newShifts;
};

const exceptionHandler = (vals, task, facilityExceptions = []) => {
	// if (denyExceptionChange(task)) return { ...task };
	exceptionLogger(vals, task);

	if (!isEmptyVal(vals.exceptionType)) {
		exceptionLogger(vals, task);

		if (isUITask(task)) {
			exceptionLogger(vals, task);
			return {
				...task,
				AssessmentExceptionId: getExceptionID(
					vals.exceptionType,
					facilityExceptions
				),
				ExceptionDate: new Date().toUTCString(),
				Exception: vals.exceptionType,
			};
		} else {
			exceptionLogger(vals, task);
			return {
				...task,
				AssessmentExceptionId: getExceptionID(
					vals.exceptionType,
					facilityExceptions
				),
				ExceptionDate: new Date().toUTCString(),
			};
		}
	} else {
		exceptionLogger(vals, task);
		return { ...task };
	}
};
// ##TODOS:
// - Add handling for 'ReasonForReassess' field in UI tasks
// - Add request handler for 'saveReassess' to fire off
const reassessHandler = (vals, task) => {
	const { reassess, reassessNotes } = vals;
	if (!reassess || !isScheduledTask(task)) return task;

	if (isUITask(task)) {
		return {
			...task,
			ReasonForReassess: reassessNotes,
			AssessmentResolutionId: getResolutionID("COMPLETED-REASSESSMENT-NEEDED"),
			AssessmentReasonId: 6,
		};
	} else {
		return {
			...task,
			AssessmentResolutionId: getResolutionID("COMPLETED-REASSESSMENT-NEEDED"),
			AssessmentReasonId: 6,
		};
	}
};
const notesHandler = (vals, task) => {
	/**
	 * Determine 'notes' field name,
	 * merge prev. notes & new notes
	 * apply to task record
	 */
	const notesField = !hasProp(task, "Notes") ? "TaskNotes" : "Notes";
	const mergedNotes = mergeTaskNotes(vals, task[notesField]);
	return {
		...task,
		[notesField]: mergedNotes,
		SignedBy: vals.signature,
	};
};

// ##TODOS:
// - Fix 'isPastDue' w/ new updates
const pastDueHandler = (task, shiftTimes = []) => {
	if (denyPastDueChange(task)) return { ...task };

	if (checkForPastDue(task, new Date(), shiftTimes)) {
		return {
			...task,
			IsPastDue: true,
			PastDueDate: new Date().toUTCString(),
		};
	} else {
		return { ...task };
	}
};
// ##TODOS:
// - Fix 'RecurringStartDate' & 'RecurringEndDate' formats
// - Updated 'RecurringStartDate' & 'RecurringEndDate' to be wrapped in a new date instance & converted to ISO/UTC
const repeatSettingsHandler = (vals, task) => {
	if (!vals.changedSettings || isScheduledTask(task)) return { ...task };

	if (isUITask(task)) {
		// recurring shifts
		const hasAM = vals.isRecurringAM ? "AM" : null;
		const hasPM = vals.isRecurringPM ? "PM" : null;
		const hasNOC = vals.isRecurringNOC ? "NOC" : null;
		const newShifts = [hasAM, hasPM, hasNOC].filter((x) => Boolean(x));
		// recurring days
		const newDays = getChangedDays(vals);

		return {
			...task,
			RecurringDescription: "",
			AssessmentRecurringId: getRecurringTypeID(vals?.recurringType),
			RecurringType: vals?.recurringType,
			RecurringStartDate: new Date(vals.startDate).toUTCString(),
			RecurringEndDate: new Date(vals.endDate).toUTCString(),
			RecurringDays: [...newDays],
			RecurringShifts: newShifts,
		};
	} else {
		return {
			...task,
			AssessmentRecurringId: getRecurringTypeID(vals.recurringType),
			RecurringDescription: "",
			RecurringStartDate: vals.startDate,
			RecurringEndDate: vals.endDate,
			RecurringMon: vals.isRecurringMon,
			RecurringTue: vals.isRecurringTue,
			RecurringWed: vals.isRecurringWed,
			RecurringThu: vals.isRecurringThu,
			RecurringFri: vals.isRecurringFri,
			RecurringSat: vals.isRecurringSat,
			RecurringSun: vals.isRecurringSun,
			RecurringAMShiftId: vals.isRecurringAM ? 1 : 0,
			RecurringPMShiftId: vals.isRecurringPM ? 1 : 0,
			RecurringNOCShiftId: vals.isRecurringNOC ? 1 : 0,
		};
	}
};
const shiftHandler = (vals, task) => {
	if (isEmptyVal(vals.shift)) return { ...task };
	return {
		...task,
		CompletedAssessmentShiftId: getShiftID(vals.shift),
	};
};
const statusHandler = (vals, task) => {
	if (isUITask(task)) {
		const { AssessmentTaskStatusId, TaskStatus } = task;
		return {
			...task,
			TaskStatus: vals.markComplete ? "COMPLETE" : TaskStatus,
			IsCompleted: vals.markComplete,
			AssessmentTaskStatusId: vals.markComplete ? 2 : AssessmentTaskStatusId,
			CompletedAssessmentShiftId: getShiftID(vals.shift),
			CompletedDate: vals.markComplete ? new Date().toUTCString() : null,
			CompletedShift: vals.shift,
		};
	} else {
		const { AssessmentTaskStatusId } = task;
		return {
			...task,
			IsCompleted: vals.markComplete,
			AssessmentTaskStatusId: vals.markComplete ? 2 : AssessmentTaskStatusId,
			CompletedDate: vals.markComplete ? new Date().toUTCString() : null,
		};
	}
};
const resolutionHandler = (vals, task) => {
	if (!vals.reassess) {
		return {
			...task,
			AssessmentResolutionId: vals.markComplete
				? getResolutionID("COMPLETED")
				: null,
		};
	} else {
		return {
			...task,
			AssessmentResolutionId: vals.markComplete
				? getResolutionID("COMPLETED-REASSESSMENT-NEEDED")
				: null,
		};
	}
};

/**
 * @description - Wrapper around ALL task-related update handlers used for applying updates to UI tasks.
 * @param {Object} vals - User-selected values from local state (ie 'Advanced Options' modal).
 * @param {Object} task - Any UI task type (ie 'Scheduled' and/or 'Unscheduled').
 * @param {Array} facilityExceptions - An array of facility exception types.
 * @param {Array} shiftTimes - An array of facility shift times.
 * @returns {Object} - Returns the updated UI task record, w/ applied changes.
 * - Updated 8/11/2020 @ 4:28 PM
 * - Tracked down 'pastDueHandler' bug, was an error w/ the 'saveAppliedTaskUpdates' NOT receiving the 'shiftTimes' array
 */
const applyUpdatesToTask = (
	vals,
	task,
	facilityExceptions = [],
	shiftTimes = []
) => {
	const pendingTask = { ...task };
	const withException = exceptionHandler(vals, pendingTask, facilityExceptions);
	const withReassess = reassessHandler(vals, withException);
	const withNotes = notesHandler(vals, withReassess);
	const withRepeat = repeatSettingsHandler(vals, withNotes);
	const withShift = shiftHandler(vals, withRepeat);
	const withStatus = statusHandler(vals, withShift);
	const withPastDue = pastDueHandler(withStatus, shiftTimes);

	return withPastDue;
};

/**
 * Applies task updates (from 'Advanced Options' modal) to matching tracking record.
 * Prepares tracking to be submitted to server.
 */
const applyUpdatesToTracking = (
	vals,
	task,
	allTracking = [],
	facilityExceptions = [],
	shiftTimes = []
) => {
	const matchingRecord = findTrackingRecord(task, allTracking);
	const updatedRecord = applyUpdatesToTask(
		vals,
		matchingRecord,
		facilityExceptions,
		shiftTimes
	);
	return { ...updatedRecord };
};

// handles one or more scheduled/unscheduled
// this should replace 'taskResolver' in <DailySummaryListItem/>
const saveAppliedTaskUpdates = async (
	token,
	vals,
	activeTask,
	scheduledTracking = [],
	unscheduledTracking = [],
	facilityExceptions = [],
	shiftTimes = []
) => {
	const matchingRecord = findMatchingRecord(
		activeTask,
		scheduledTracking,
		unscheduledTracking
	);
	if (isScheduledTask(activeTask)) {
		const updatedRecord = applyUpdatesToTracking(
			vals,
			matchingRecord,
			scheduledTracking,
			facilityExceptions,
			shiftTimes
		);
		return await saveScheduledUpdates(token, updatedRecord);
	} else {
		const updatedRecord = applyUpdatesToTracking(
			vals,
			matchingRecord,
			unscheduledTracking,
			facilityExceptions,
			shiftTimes
		);
		return await saveUnscheduledUpdates(token, updatedRecord);
	}
};

// LOGGER UTILS
const exceptionLogger = (vals, task) => {
	const taskID = getTaskID(task);
	const taskType = getTaskType(task);
	if (vals?.exceptionType) {
		return Sentry.captureMessage(
			`✓ Exception Logging\n\n
			✓ TaskType: ${taskType}\n\n
			✓ TaskID: ${taskID}\n\n
			✓ TaskHasException? ${hasException(task)}\n\n
			✓ UserException: ${vals.exceptionType}\n\n
			✓ ADL: ${getCategoryNameFromID(task?.AssessmentCategoryId)}
			`
		);
	} else {
		return Sentry.captureMessage(
			`✓ Exception Logging (no exception)\n\n
			✓ TaskType: ${taskType}\n\n
			✓ TaskID: ${taskID}\n\n
			✓ TaskHasException? ${hasException(task)}\n\n
			✓ UserException: ${vals?.exceptionType}\n\n
			✓ ADL: ${getCategoryNameFromID(task?.AssessmentCategoryId)}
			`
		);
	}
};

// LOGGING HELP
export { exceptionLogger };

// MINI-UPDATE HELPERS
export {
	mergeTaskNotes,
	addTimeStamp,
	getWeekDays,
	getChangedDays,
	getChangedShifts,
};
export {
	exceptionHandler,
	reassessHandler,
	notesHandler,
	pastDueHandler,
	repeatSettingsHandler,
	shiftHandler,
	statusHandler,
	resolutionHandler,
	// wrappers for ALL task handlers
	applyUpdatesToTask,
	applyUpdatesToTracking,
};

// TASK RECORD UPDATE HELPERS
export {
	// record helpers
	getPastDueTracking,
	markCompleteTracking,
	// request helpers
	saveScheduledRecord,
	saveUnscheduledRecord,
	savePastDueTracking,
	// NEW ASYNC REQUEST HELPER (FOR TRACKING RECORDS)
	applyScheduledUpdates,
	applyUnscheduledUpdates,
	saveAppliedTaskUpdates,
};

// RECORD FINDING HELPERS
export { findTrackingRecord, findUnscheduledRecord, findMatchingRecord };

// TASK UPDATE REQUEST HELPERS
export {
	findAndApplyTaskUpdates,
	taskResolver,
	applyTaskChanges,
	applyQuickComplete,
	recordQuickComplete,
};

// 'MARK ALL COMPLETE' HELPERS
export {
	groupTrackingByType,
	findAllMatchingRecords,
	copyTaskUpdatesToRecords,
	// main helper to be exposed; use in <DailySummaryCard/> for 'mark all complete' feature
	savePendingRecords,
	markCompleteTasksAndRecords,
};
