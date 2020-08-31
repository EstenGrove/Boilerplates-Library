import { test } from "./utils_env";
import { scheduledTasks } from "./utils_endpoints";
import {
	isEmptyVal,
	isEmptyArray,
	isEmptyObj,
	hasProp,
	isArray,
} from "./utils_types";
import { getStatusNameFromID } from "./utils_status";
import { replaceNullWithMsg, addEllipsis } from "./utils_processing";
import { getCategoryNameFromID, getCategoryID } from "./utils_categories";
import {
	getShiftName,
	matchShiftByName,
	processShiftTimes,
	matchShiftTimeByID,
	convertTimeToDate,
	convertShiftTimesToDate,
} from "./utils_shifts";
import { formatPastDate, formatDateInWords } from "./utils_dates";
import { isRecurring } from "./utils_repeatingTasks";
import { formatResidentOnly } from "./utils_residents";
import { format, isAfter, addDays, distanceInWordsToNow } from "date-fns";

const SCHEDULED_ID = "AssessmentTrackingTaskId";
const UNSCHEDULED_ID = "AssessmentUnscheduleTaskId";

///////////////////////////////////////////////////////////////////////////
/////////////////////////// TASK REQUEST HELPERS ///////////////////////////
///////////////////////////////////////////////////////////////////////////

/**
 * @description - "UPDATE" request to update 1 or more AssessmentTrackingTask records.
 * @param {String} token - base64 encode auth token
 * @param {Array} updatedTasks - AssessmentTrackingTask model with updated values to submit to server
 * @returns {Array|Boolean} - Returns an array of task ids (ie "AssessmentTrackingTask") that were updated successfully. Otherwise returns false, if the request failed.
 */
const saveScheduledUpdates = async (token, updatedTasks) => {
	let url = test.base + scheduledTasks.save.taskMany;

	const body = isArray(updatedTasks)
		? JSON.stringify(updatedTasks)
		: JSON.stringify([updatedTasks]);

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: body,
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return console.log("An error occurred ", err.message);
	}
};
/**
 * @description - Fetches a single 'AssessmentTrackingTask' record by ID.
 * @param {String} token - An auth security token.
 * @param {Number} AssessmentTrackingTaskId - An 'AssessmentTrackingTaskId' for the desired task.
 */
const getScheduledRecord = async (token, AssessmentTrackingTaskId) => {
	let url = test.base + scheduledTasks.get.task;
	url += "?" + new URLSearchParams({ AssessmentTrackingTaskId });

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
		console.log(`✓ Success! Task was found.`, response.Data);
		return response.Data;
	} catch (err) {
		console.log(`❌ Oops! Task was NOT found.`, err);
		return err.message;
	}
};

///////////////////////////////////////////////
///////////// TASK TYPE HELPERS /////////////
///////////////////////////////////////////////

const isScheduledTask = (task) => {
	if (hasProp(task, UNSCHEDULED_ID)) {
		return false;
	}
	return true;
};
// checks if UI task type: supports 'scheduled' & 'unscheduled' types
const isUITask = (task) => {
	if (hasProp(task, "TaskStatus")) return true;
	return false;
};

/////////////////////////////////////////////////////////////////////////
////////////////////////// TASK STATUS HELPERS //////////////////////////
/////////////////////////////////////////////////////////////////////////

/**
 * @description - Status util that checks if a task is 'COMPLETE' status.
 * @param {Object} task - A task record.
 * @returns {Boolean} - Returns 'true' if the 'task.IsCompleted' field is true.
 */
const isCompleted = (task) => {
	return task.IsCompleted;
};

const checkForPastDue = (task, dueDate = new Date(), shiftTimes = []) => {
	const shift = task?.Shift ?? getShiftName(task?.AssessmentShiftId);
	const shiftRecord = matchShiftByName(shift, shiftTimes);
	const { endTime } = processShiftTimes(shiftRecord, dueDate);

	// accounts for NOC tasks that 'roll-over' into tmrw

	return isAfter(Date.now(), endTime);
};
/**
 * @description - Check is a task is past the 'endTime' of it's scheduled shift.
 * @param {Object} task - A task record ('ADLCareTask' or 'AssessmentUnscheduleTask' record).
 * @param {Date} dueDate - Date instance used to set a shift's end time for a the date that it's scheduled, "anchoring" the time to a day.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' records, including the start & end times for each shift.
 * @returns {Boolean} - Returns true if 'PAST-DUE'.
 * - Updated 8/7/2020 @ 6:44 AM
 */
const isPastDue = (task, dueDate = new Date(), shiftTimes = []) => {
	const shift = task?.Shift ?? getShiftName(task?.AssessmentShiftId);
	const shiftRecord = matchShiftByName(shift, shiftTimes);
	let { endTime } = processShiftTimes(shiftRecord, dueDate);

	return isAfter(Date.now(), endTime) && !isCompleted(task);
};
/**
 * @description - Status util that checks is a task is an 'EXCEPTION', excludes tasks that have received an additional status like 'COMPLETE'.
 * @param {Object} task - A task record ( supports 'scheduled' & 'unscheduled' task types).
 * @returns {Boolean} - Returns 'true' if task has an exception and has NOT been updated since the 'EXCEPTION' was added.
 */
const isException = (task) => {
	// if (hasException(task)) return true;
	// return false;
	return !isEmptyVal(task.AssessmentExceptionId);
};
/**
 * @description - Status util that returns tasks that are: 'NOT-COMPLETE' (excludes 'PAST-DUE' & 'EXCEPTIONS')
 * @param {Object} task - A task record (supports 'scheduled' & 'unscheduled' task types).
 * @param {Date} dueDate - A date instance indicating the day the task is scheduled for.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' records, w/ shift start & end times.
 * @returns {Boolean} - Returns 'true' if task is 'NOT-COMPLETE' and *not* 'PAST-DUE' or an 'EXCEPTION'.
 */
const isNotComplete = (task, dueDate = new Date(), shiftTimes) => {
	const isMatch =
		!isCompleted(task) &&
		!isPastDue(task, dueDate, shiftTimes) &&
		!isException(task);
	return isMatch;
};
/**
 * @description - Status util that checks if a task was 'locked' by and admin user.
 * @param {Object} task - A task record ('scheduled' or 'unscheduled')
 * @returns {Boolean} - Returns 'true' if task is 'locked'.
 */
const isLocked = (task) => {
	return task?.IsLocked;
};

/**
 * @description - Status util that check if a task was marked as a 'MISSED-EVENT'.
 * @param {Object} task - A task record (supports 'scheduled' & 'unscheduled' task types).
 * @returns {Boolean} - Returns 'true' if task is 'NOT-COMPLETE' and *not* 'PAST-DUE' or an 'EXCEPTION'.
 * ❌ DEPRECATED UTIL: This util is NO LONGER in use, and the 'MISSED-EVENT' status has been deprecated, as well.
 */
const isMissedEvent = (task) => {
	const isMatch = !isCompleted(task) && task?.AssessmentTaskStatusId === 3;
	return isMatch;
};

// used for status filters
// returns a string-form status type
const getStatusDesc = (task, dueDate = new Date()) => {
	if (isNotComplete(task, dueDate)) {
		return `NOT-COMPLETE`;
	} else if (isException(task)) {
		return `EXCEPTIONS`;
	} else if (isPastDue(task, dueDate)) {
		return `PAST-DUE`;
	} else {
		return `COMPLETE`;
	}
};

////////////////////////////////////////////
///////// FINDING/FILTERING TASKS /////////
//////////////////////////////////////////

// returns tasks that match the adl provided

// INCLUDES "past due" tasks - returns any task that is NOT marked complete
const getAllNotComplete = (tasks) => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => !isCompleted(task));
};

/**
 * @description - Helper that parses/formats an 'ADLCategory' so as to attempt to match a task's relevant 'ADLCategory' field.
 * @param {Object} task - A task record; 'ADLCareTask' or 'AssessmentUnscheduleTask' record.
 * @param {String} adl - An 'ADLCategory'(AssessmentCategory) string to match a task to.
 * @returns {Object|Null} - Returns the matching task record, or null if not match is found by adl category.
 */
const matchTaskADL = (task, adl) => {
	if (isScheduledTask(task)) {
		return task.ADLCategory === adl ? task : null;
	}
	return getCategoryNameFromID(task.AssessmentCategoryId) === adl ? task : null;
};

/**
 * @description - Finds all tasks for a specific ADL category.
 * @param {Array} tasks - An array of ALL tasks scheduled & unscheduled.
 * @param {String} adl - An Assessment Category string. (ie. "SpecialCare", "Bathing")
 * @returns {Array} - Returns an array of tasks for an ADL.
 */
const findTasksByADL = (tasks, adl) => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => matchTaskADL(task, adl));
};

const findTasksByShift = (tasks, shift) => {
	return tasks.filter((task) => getShiftName(task.AssessmentShiftId) === shift);
};

/**
 * @description - Finds ALL tasks scheduled for a certain day. (supports both 'scheduled' & 'unscheduled' task types)
 * @param {Array} tasks - An array of tasks (supports both 'scheduled' & 'unscheduled' task types)
 * @param {String} day - A string-form weekday (ie 'Monday', 'Friday' etc)
 * @returns {Array} - Returns an array of matching task records or an empty [] if no matches found.
 */
const findTasksByDay = (tasks, day) => {
	return tasks.filter(
		(task) => task?.DayOfWeek === day || format(task?.TaskDate, "dddd") === day
	);
};

// PRIMARY USAGE - REMOVE ALTERNATIVE LATER!!!
const findTasksByDayAndADL = (tasks, day, adl) => {
	if (isEmptyArray(tasks)) return;
	if (isEmptyVal(day) || isEmptyVal(adl)) return;
	return findTasksByADL(findTasksByDay(tasks, day), adl);
};

const findTasksByADLAndDay = (tasks, adl, day) => {
	if (isEmptyArray(tasks)) return [];
	return findTasksByADL(findTasksByDay(tasks, day), adl);
};

// finds all tasks that match, adl, day and shift
const findTasksByAdlDayAndShift = (tasks, adl, day, shift) => {
	if (isEmptyArray(tasks)) return;
	if (isEmptyVal(day) || isEmptyVal(adl)) return;
	return findTasksByShift(
		findTasksByADL(findTasksByDay(tasks, day), adl),
		shift
	);
};

/**
 * Initial 'status' object w/ tasks grouped by status'
 */
const initialTasks = {
	pastDue: [],
	exceptions: [],
	notComplete: [],
	complete: [],
};
/**
 * @description - Sorts & groups all tasks by their respective status (ie 'NOT-COMPLETE', 'PAST-DUE', 'EXCEPTION', 'COMPLETE').
 * @default initialTasks - The default count values, and return object.
 * @param {Array} allTasks - An array of ALL current tasks (includes 'scheduled' & 'unscheduled').
 * @param {Date} dueDate - A date used to compare if a task is 'PAST-DUE' comparable to the current time & its due date.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' records including the facility's shift times.
 * @returns {Object} - Returns an object with each status count as a field.
 * - "byStatus.pastDue": all 'PAST-DUE' tasks.
 * - "byStatus.exceptions": all 'EXCEPTION' tasks
 * - "byStatus.notComplete": all 'NOT-COMPLETE' tasks; excludes 'PAST-DUE' & 'EXCEPTION' types
 * - "byStatus.complete": all 'COMPLETE' tasks; excludes 'PAST-DUE' & 'EXCEPTION' types
 *
 * - Updated 8/17/2020 @ 7:38 AM
 */
const getTasksByStatus = (
	allTasks = [],
	dueDate = new Date(),
	shiftTimes = []
) => {
	return allTasks.reduce(
		(byStatus, task) => {
			if (isException(task) && !isCompleted(task)) {
				return {
					...byStatus,
					exceptions: [...byStatus.exceptions, task],
				};
			} else if (isPastDue(task, dueDate, shiftTimes)) {
				return {
					...byStatus,
					pastDue: [...byStatus.pastDue, task],
				};
			} else if (isNotComplete(task, dueDate, shiftTimes)) {
				return {
					...byStatus,
					notComplete: [...byStatus.notComplete, task],
				};
			} else {
				return {
					...byStatus,
					complete: [...byStatus.complete, task],
				};
			}
		},
		{ ...initialTasks }
	);
};

////////////////////////////////////////////////////////////
///////// FIND ALL TASKS - SCHEDULED & UNSCHEDULED /////////
////////////////////////////////////////////////////////////

const convertToWeekdays = (days) => {
	if (isEmptyArray(days)) return [];
	return days.map((x) => format(x, "dddd"));
};

const matchesDay = (day, task) => {
	if (isRecurring(task)) {
		const { RecurringDays } = task;
		const isMatch =
			task?.DayOfWeek === day || RecurringDays.includes(day.slice(0, 3));
		return isMatch;
	} else {
		const isMatch = task?.DayOfWeek || format(task?.TaskDate, "dddd") === day;
		return isMatch;
	}
};
const matchesADL = (adl, task) => {
	const { AssessmentCategoryId } = task;
	const isMatch = AssessmentCategoryId === getCategoryID(adl);
	return isMatch;
};
const matchesShift = (shift, task) => {
	if (isRecurring(task)) {
		const { Shift, RecurringShifts } = task;
		const isMatch = Shift === shift || RecurringShifts.includes(shift);
		return isMatch;
	} else {
		const { Shift } = task;
		const isMatch = Shift === shift;
		return isMatch;
	}
};

/**
 * @description - Finds ALL tasks that are scheduled for a certain day.
 * @param {Array} tasks - An array of ALL tasks (ie 'scheduled' & 'unscheduled')
 * @param {Date} day - A date string to match tasks to.
 */
const findAllTasksByDay = (day, allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.filter((task) => matchesDay(day, task));
};
/**
 * @description - Finds all tasks that match a specific ADL category.
 * @param {String} adl - A string-form AssessmentCategory (ie 'Ambulation', 'Dressing' etc).
 * @param {Array} allTasks - An array of task records (including 'scheduled' & 'unscheduled' task records).
 * @returns {Array} - Returns an array of matching task records.
 */
const findAllTasksByAdl = (adl, allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.reduce((matches, task) => {
		const isMatch = matchesADL(adl, task);
		if (isMatch) {
			matches.push({ ...task });
			return matches;
		}
		return matches;
	}, []);
};
/**
 * @description - Finds all tasks that match a specific shift.
 * @param {String} shift - A string-form AssessmentCategory (ie 'AM', 'PM', 'NOC' etc).
 * @param {Array} allTasks - An array of task records (including 'scheduled' & 'unscheduled' task records).
 * @returns {Array} - Returns an array of matching task records.
 */
const findAllTasksByShift = (shift, allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.reduce((matches, task) => {
		const isMatch = matchesShift(shift, task);
		if (isMatch) {
			matches.push({ ...task });
			return matches;
		}
		return matches;
	}, []);
};
/**
 * @description - Helper for find ALL tasks(scheduled|unscheduled) for a specific ADL and day.
 * @param {String} adl - A string-form ADL Category (ie 'Ambulation', 'Bathing' etc).
 * @param {String} day - A string-form weekday (ie 'Sunday', 'Tuesday' etc).
 * @param {Array} allTasks - An array of ALL tasks including 'ADLCareTask'(scheduled) & 'AssessmentUnscheduleTask'(unscheduled) records.
 * @returns {Array} - Returns an array of all task matching the day and adl given.
 */
const findAllTasksByAdlAndDay = (adl, day, allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.reduce((matches, current) => {
		const isMatch = matchesADL(adl, current) && matchesDay(day, current);
		if (isMatch) {
			matches.push({ ...current });
			return matches;
		}
		return matches;
	}, []);
};
const findAllTasksByDayAndShift = (day, shift, allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.reduce((matches, task) => {
		const isMatch = matchesDay(day, task) && matchesShift(shift, task);
		if (isMatch) {
			matches.push({ ...task });
			return matches;
		}
		return matches;
	}, []);
};
/**
 * @description - Helper for find ALL tasks(scheduled|unscheduled) for a specific ADL and day.
 * @param {String} adl - A string-form ADL Category (ie 'Ambulation', 'Bathing' etc).
 * @param {String} shift - A string-form AssessmentCategory (ie 'AM', 'PM', 'NOC' etc).
 * @param {Array} allTasks - An array of ALL tasks including 'ADLCareTask'(scheduled) & 'AssessmentUnscheduleTask'(unscheduled) records.
 * @returns {Array} - Returns an array of all task matching the day and adl given.
 */
const findAllTasksByAdlAndShift = (adl, shift, allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.reduce((matches, task) => {
		const isMatch = matchesADL(adl, task) && matchesShift(shift, task);
		if (isMatch) {
			matches.push({ ...task });
			return matches;
		}
		return matches;
	}, []);
};
/**
 * @description - Finds all tasks that match a specific shift.
 * @param {String} adl - A string-form AssessmentCategory (ie 'Ambulation', 'Dressing' etc).
 * @param {Date} day - A date string to match tasks to.
 * @param {String} shift - A string-form AssessmentCategory (ie 'AM', 'PM', 'NOC' etc).
 * @param {Array} allTasks - An array of task records (including 'scheduled' & 'unscheduled' task records).
 * @returns {Array} - Returns an array of matching task records.
 */
const findAllTasksByAdlDayAndShift = (adl, day, shift, allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.reduce((matches, task) => {
		const isMatch =
			matchesADL(adl, task) &&
			matchesDay(day, task) &&
			matchesShift(shift, task);

		if (isMatch) {
			matches.push({ ...task });
			return matches;
		}
		return matches;
	}, []);
};

/**
 * @description - Groups the tasks by shift into an object where each property is the available shifts.
 * @param {Array} allTasks - An array of ALL tasks including 'ADLCareTask'(scheduled) & 'AssessmentUnscheduleTask'(unscheduled) to group.
 * @returns {Object} - Returns an object shaped with 'AM', 'PM' and 'NOC' as properties and tasks grouped accordingly.
 * - Function defaults to an object with each shift as a field, intialized to an empty array.
 * - Done for performance reasons. Only runs a single time thru all records.
 */
const groupTasksByShift = (allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.reduce(
		(grouped, current) => {
			if (!grouped[current?.Shift]) {
				grouped[current?.Shift] = [];
				return grouped;
			}
			grouped[current.Shift].push({ ...current });
			return grouped;
		},
		{
			AM: [],
			PM: [],
			NOC: [],
		}
	);
};

/**
 * Default return object for 'groupTasksByStatus()'.
 * - "complete": completed tasks, including updated exceptions.
 * - "notComplete": not completed tasks, excluding past due tasks.
 * - "pastDue": past due tasks.
 * - "exceptions": all active/current exceptions.
 */
const statusBase = {
	complete: [],
	notComplete: [],
	pastDue: [],
	exceptions: [],
};

/**
 * @description - Groups ALL tasks by their status.
 * @param {Array} allTasks - An array of ALL tasks (including 'scheduled' & 'unscheduled').
 * @param {Date} day - A date of the scheduled task.
 * @param {Array} shiftTimes - Array of facility shift times.
 * @returns {Object} - Returns an object w/ tasks grouped by task status.
 */
const groupTasksByStatus = (allTasks, day, shiftTimes = []) => {
	console.group("Group By Status");
	console.log("allTasks", allTasks);
	console.log("day", day);
	console.log("shiftTimes", shiftTimes);
	console.groupEnd();
	return allTasks.reduce(
		(byStatus, task) => {
			if (isException(task) && !isCompleted(task)) {
				return {
					...byStatus,
					exceptions: [...byStatus.exceptions, task],
				};
			} else if (isPastDue(task, day, shiftTimes)) {
				return {
					...byStatus,
					pastDue: [...byStatus.pastDue, task],
				};
			} else if (isNotComplete(task, day, shiftTimes)) {
				return {
					...byStatus,
					notComplete: [...byStatus.notComplete, task],
				};
			} else {
				return {
					...byStatus,
					complete: [...byStatus.complete, task],
				};
			}
		},
		{ ...statusBase }
	);
};

////////////////////////////////////////////////////////////
//////////////////// FIND TASKS BY STATUS /////////////////
///////////////////////////////////////////////////////////

/**
 * @description - Finds all 'NOT-COMPLETE' tasks, excluding 'PAST-DUE' & 'EXCEPTION' tasks.
 * @param {Array} allTasks - An array of ALL tasks including 'scheduled' & 'unscheduled' task types.
 * @param {Date} pastDueDate - The base date for the task's scheduled due date.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' time records w/ start & end times.
 */
const findNotCompleteTasks = (
	allTasks = [],
	pastDueDate = new Date(),
	shiftTimes = []
) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.filter((task) =>
		isNotComplete(task, pastDueDate, shiftTimes)
	);
};
/**
 * @description - Finds all tasks that are 'EXCEPTION', excluding 'PAST-DUE' tasks.
 * @param {Array} allTasks - An array of ALL tasks including 'scheduled' & 'unscheduled' tasks.
 */
const findExceptionTasks = (allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.filter((task) => isException(task));
};
/**
 * @description - Finds all tasks that are 'PAST-DUE', excluding exceptions.
 * @param {Array} allTasks - An array of ALL tasks including 'scheduled' & 'unscheduled' tasks.
 */
const findCompletedTasks = (allTasks = []) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.filter((task) => isCompleted(task));
};
/**
 * @description - Finds all tasks that are 'PAST-DUE', excluding exceptions.
 * @param {Array} allTasks - An array of ALL tasks including 'scheduled' & 'unscheduled' tasks.
 * @param {Date} pastDueDate - A date instance of the scheduled task's date.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' records with shift start & end times.
 */
const findPastDueTasks = (
	allTasks = [],
	pastDueDate = new Date(),
	shiftTimes = []
) => {
	if (isEmptyArray(allTasks)) return [];
	return allTasks.filter((task) => isPastDue(task, pastDueDate, shiftTimes));
};
/**
 * @description - Finds all 'MISSED-EVENT' tasks.
 * @param {Array} tasks - An array of task records.
 * @deprecated 'findMissedEvents'
 */
const findMissedEvents = (tasks) => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => {
		if (isScheduledTask(task)) {
			return task.TaskStatus === "MISSED-EVENT" && !isCompleted(task);
		} else {
			return task.AssessmentTaskStatusId === 3 && !isCompleted(task);
		}
	});
};

/////////////////////////////////////////////////////
////////// GETTING TASK RECORD ATTRIBUTES //////////
///////////////////////////////////////////////////

// checks for notes in unscheduled tasks
const checkForNotes = (task, msg) => {
	if (isEmptyVal(task.Notes) && isEmptyVal(task.Description)) {
		return msg;
	}
	if (isEmptyVal(task.Notes)) {
		return replaceNullWithMsg(addEllipsis(task.Description, 30), msg);
	}
	return addEllipsis(task.Notes, 30);
};

const getTaskNotes = (task, msg = `Enter task notes or comments...`) => {
	if (isScheduledTask(task)) {
		return replaceNullWithMsg(task.TaskNotes, msg);
	} else {
		return replaceNullWithMsg(task.TaskNotes, msg);
	}
};

/**
 * @description - Find a task's scheduled shift record, process the 'endTime', format the 'due' message.
 * @param {Object} task - A task record, either 'scheduled' or 'unscheduled' task UI record.
 * @param {Date} dueDate - An "anchor" date used to process the shift times & anchor them to a date.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' time records w/ start/end times.
 * @returns {String} - Returns a text description of the due date: 'Due by hh:mm today|tomorrow'
 */
const getTaskDate = (task, dueDate = new Date(), shiftTimes = []) => {
	const { AssessmentShiftId: id } = task;
	const shiftRecord = matchShiftTimeByID(id, shiftTimes);
	const { IsRollOver } = shiftRecord;

	let { endTime } = processShiftTimes(shiftRecord, dueDate);
	let dueMsg = ``;
	let dueDay = `today`;

	if (IsRollOver) {
		dueDay = `tomorrow.`;
	}

	dueMsg += `Due by `;
	dueMsg += `${format(endTime, "h:mm A")} `;
	dueMsg += dueDay;

	return dueMsg;
};
/**
 * @description - Find a task's scheduled shift record, process the 'endTime', format the 'due' message.
 * @param {Object} task - A task record, either 'scheduled' or 'unscheduled' task UI record.
 * @param {Date} dueDate - An "anchor" date used to process the shift times & anchor them to a date.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' time records w/ start/end times.
 * @returns {String} - Returns a text description of the due date: 'Due by hh:mm MM/DD/YYYY'
 */
const getTaskDueTime = (task, dueDate = new Date(), shiftTimes = []) => {
	const { AssessmentShiftId: id } = task;
	const shiftRecord = matchShiftTimeByID(id, shiftTimes);
	const { IsRollOver } = shiftRecord;

	let { endTime } = processShiftTimes(shiftRecord, dueDate);
	let dueMsg = ``;
	let dueDay = endTime;

	if (IsRollOver) {
		dueDay = addDays(endTime, 1);
	}

	dueMsg += `Due by `;
	dueMsg += `${format(endTime, "h:mm A")} `;
	dueMsg += format(dueDay, "M/D/YYYY");

	return dueMsg;
};
// returns time in words:
// past time: 'about 3 hours ago'
// future time: 'about 3 hours from now'
const getTaskDateInWords = (task, dueDate = new Date(), shiftTimes = []) => {
	// - have access to 'day' (ie a date)
	// - have access to 'shift'
	const shift = task?.Shift ?? getShiftName(task?.AssessmentShiftId);
	const shiftRecord = matchShiftByName(shift, shiftTimes);
	let { endTime } = processShiftTimes(shiftRecord, dueDate);

	// accounts for NOC tasks that 'roll-over' into tmrw
	if (shiftRecord.IsRollOver) {
		endTime = addDays(endTime, 1);
	}
	return formatDateInWords(endTime);
};

/**
 * @description - Finds the facility shift record from a shift ID, then finds and converts its' end time.
 * @param {Number} shiftID - An 'AssessmentShiftId'.
 * @param {Array} shiftTimes - An array of facility shift times.
 */
const getDueTime = (shiftID, shiftTimes = []) => {
	const shiftMatch = matchShiftByName(shiftID, shiftTimes);
	const { endTime } = convertShiftTimesToDate(shiftMatch, new Date());
	return endTime;
};

// returns "hh:mm AM|PM M/D/YYYY"
/**
 * @description - Determines an entry's end time & date, converts it to localtime, then describes the difference in words to now.
 * @param {Object} task - A 'PastDue' task entry.
 * @param {Array} shiftTimes - An array of facility shift time records.
 * @returns {String} - Returns a text description describing how far in the past/future, from now, the due date is/was.
 */
const getPastDueTime = (task, shiftTimes = []) => {
	const { TaskShift, TaskDate } = task;
	const dueTime = getDueTime(TaskShift, shiftTimes);
	const endTime = convertTimeToDate(dueTime, TaskDate);
	const diffToNow = distanceInWordsToNow(endTime);

	let msg = ` about ${diffToNow} ago`;

	// is in past
	if (!isAfter(Date.now(), endTime)) {
		msg = ` about ${diffToNow} from now`;
	}

	return msg;
};

// returns notes/description from scheduled\unscheduled tasks
const getTaskName = (task, maxLength = 30) => {
	if (isScheduledTask(task)) {
		const name = isEmptyVal(task?.Description)
			? task?.TaskDescription
			: task?.Description;
		return addEllipsis(name, maxLength);
	} else {
		const name = isEmptyVal(task?.Description)
			? task?.TaskDescription
			: task?.Description;
		return addEllipsis(name, maxLength);
	}
};
const getTaskNameExtended = (task) => {
	if (isScheduledTask(task)) {
		const name = isEmptyVal(task?.Description)
			? task?.TaskDescription
			: task?.Description;
		return addEllipsis(name, 70);
	} else {
		const name = isEmptyVal(task?.Description)
			? task?.TaskDescription
			: task?.Description;
		return addEllipsis(name, 70);
	}
};

// determines if a task is "scheduled" or "unscheduled"
// and returns the appropriate task id.
const getTaskIdType = (task) => {
	return isScheduledTask(task) ? SCHEDULED_ID : UNSCHEDULED_ID;
};
const getTaskType = (task) => {
	if (isScheduledTask(task)) {
		return `Scheduled`;
	} else {
		return `Unscheduled`;
	}
};

// returns the task ID regardless of task type.
const getTaskID = (task) => {
	return task[getTaskIdType(task)];
};

// get task status from scheduled|unscheduled records
// updated - 5/31 5:50 PM
const getTaskStatus = (task) => {
	return getStatusNameFromID(task.AssessmentTaskStatusId);
};

const getTaskCategory = (task) => {
	const { AssessmentCategoryId: id } = task;
	return getCategoryNameFromID(id);
};

const getTaskDueDate = (task) => {
	if (isEmptyObj(task)) return "No date";
	if (isScheduledTask(task)) {
		const date = isEmptyVal(task?.TaskDate) ? task?.TrackDate : task?.TaskDate;
		return formatPastDate(date);
	} else {
		const date = task?.TaskDate ?? task?.FollowUpDate;
		return formatPastDate(date);
	}
};

const getTaskEndTime = (task) => {
	const { endTime } = processShiftTimes(task);
	return formatPastDate(endTime);
};

const getTaskDesc = (task, maxLength = 30) => {
	const desc = task?.TaskDescription ?? task?.Description;
	return isEmptyVal(desc) ? `No description` : addEllipsis(desc, maxLength);
};

const getTaskTypeDesc = (task) => {
	if (isScheduledTask(task)) {
		return "Scheduled Assessment Task";
	} else {
		return "Created Task";
	}
};

// return task description from scheduled|unscheduled records
const getTaskDescription = (task) => {
	if (!isScheduledTask(task)) {
		return checkForNotes(task, "No description");
	}
	return replaceNullWithMsg(
		addEllipsis(task.TaskDescription, 30),
		"No description"
	);
};
// checks if task has a scheduled shift
const checkForShift = (task) => {
	if (isEmptyObj(task)) return "";
	const makeEmpty = "ALL" || "" || "ANY";
	if (isScheduledTask(task)) {
		return task.Shift === makeEmpty ? "" : task.Shift;
	}
	return "";
};

const getTaskShift = (task) => {
	if (isScheduledTask(task)) {
		return task.Shift;
	} else {
		return getShiftName(task.AssessmentShiftId);
	}
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// TASK STATUS HELPERS /////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// checks if ALL tasks are complete (supports scheduled|unscheduled)
const isAllComplete = (allTasks = []) => {
	if (isEmptyArray(allTasks)) return false;
	return allTasks.reduce((all, task) => {
		if (isCompleted(task)) {
			all = true;
			return all;
		} else {
			all = false;
			return all;
		}
	}, false);
};

// toggle a single task between complete/pending status
// UPDATED AS OF 5/24/2020 - added 'isCurrentlyCompleted'
const toggleComplete = (task) => {
	const isCurrentlyCompleted = task.IsCompleted;

	if (isScheduledTask(task)) {
		return (task = {
			...task,
			IsCompleted: !task.IsCompleted,
			TaskStatus: !isCurrentlyCompleted ? "COMPLETE" : "NOT-COMPLETE",
			AssessmentTaskStatusId: !isCurrentlyCompleted ? 2 : 4,
			CompletedDate: new Date().toUTCString(),
		});
		// send request here...
	} else {
		return (task = {
			...task,
			IsCompleted: !task.IsCompleted,
			TaskStatus: !isCurrentlyCompleted ? "COMPLETE" : "NOT-COMPLETE",
			AssessmentTaskStatusId: !isCurrentlyCompleted ? 2 : 4,
			CompletedDate: new Date().toUTCString(),
		});
		// send request here...
	}
};

// toggle ALL tasks between complete/pending status
const toggleAllComplete = (tasks) => {
	return tasks.map((task) => toggleComplete(task));
};

// finds ONLY tasks matching 'adl' and toggles complete
// will return ALL tasks; including non-matching/not-updated tasks
const toggleCompleteByADL = (tasks, adl) => {
	return tasks.map((task) => {
		if (isScheduledTask(task)) {
			if (task.ADLCategory === adl) {
				return {
					...task,
					IsCompleted: !task.IsCompleted,
					TaskStatus: task.TaskStatus !== "COMPLETE" ? "COMPLETE" : "PENDING",
					AssessmentTaskStatusId: task.AssessmentTaskStatusId !== 2 ? 2 : 1,
				};
			} else {
				return task;
			}
		} else {
			if (getCategoryNameFromID(task.AssessmentCategoryId) === adl) {
				return {
					...task,
					IsCompleted: !task.IsCompleted,
					AssessmentTaskStatusId: task.AssessmentTaskStatusId !== 2 ? 2 : 1,
				};
			}
		}
		return task;
	});
};

// marks a task complete, regardless of current status
const markComplete = (task) => {
	if (isScheduledTask(task)) {
		return {
			...task,
			IsCompleted: true,
			TaskStatus: "COMPLETE",
			AssessmentTaskStatusId: 2,
		};
	} else {
		return {
			...task,
			IsCompleted: true,
			AssessmentTaskStatusId: 2,
		};
	}
};

// marks ALL tasks complete (supports scheduled|unscheduled)
const markAllComplete = (tasks) => {
	return tasks.map((task) => markComplete(task));
};

const markCompleteByADL = (tasks, adl) => {
	return tasks.map((task) => {
		if (isScheduledTask(task)) {
			if (task.ADLCategory === adl) {
				return {
					...task,
					TaskStatus: "COMPLETE",
					IsCompleted: true,
					AssessmentTaskStatusId: 2,
				};
			} else {
				return { ...task };
			}
		} else {
			if (getCategoryNameFromID(task.AssessmentCategoryId) === adl) {
				return {
					...task,
					IsCompleted: true,
					AssessmentTaskStatusId: 2,
				};
			} else {
				return { ...task };
			}
		}
	});
};

/**
 * @description - Locates a task's index in a given array of task records.
 * @param {Object} activeTask - An active task record; either ADLCareTask or AssessmentUnscheduleTask
 * @param {Array} allTasks - An array of task records; either a merged array: scheduled|unscheduled OR either scheduled or unscheduled.
 */
const getTaskIndex = (activeTask, allTasks) => {
	if (isScheduledTask(activeTask)) {
		return allTasks.reduce((all, task, index) => {
			if (task?.[SCHEDULED_ID] === activeTask[SCHEDULED_ID]) {
				all = index;
				return all;
			}
			return all;
		});
	} else {
		return allTasks.reduce((all, task, index) => {
			if (task?.[UNSCHEDULED_ID] === activeTask[UNSCHEDULED_ID]) {
				all = index;
				return all;
			}
			return all;
		});
	}
};

// returns the date a task was created (for unscheduled tasks)
const getCreatedDate = (task) => {
	const createdDate = task?.EntryDate ?? task.TaskDate;
	return format(createdDate, "MM/DD/YYYY");
};

/**
 * @description - Utility to replace a "stale" (ie not-updated) task record in an array of records with the updated record.
 * @param {Object} activeTask - An active task record; ie. ADLCareTask or AssessmentUnscheduleTask
 * @param {Array} allTasks - An array of task records; either ALL tasks or scheduled|unscheduled array.
 * @param {Number} idx:null - An optional index of the active task in the array; if null, find index, else use the index passed as an arguemnt.
 * @returns {Array} - Returns the updated array of task records w/ the updated active task.
 */
const findAndReplaceStale = (activeTask, tasks, idx = null) => {
	if (!idx) {
		const index = getTaskIndex(activeTask, tasks);
		tasks.splice(index, 1, activeTask);
		return [...tasks];
	} else {
		tasks.splice(idx, 1, activeTask);
		return [...tasks];
	}
};

/**
 * @description - Finds the matching "AssessmentTrackingTask" record from an ADLCareTask. Will return the active task is no match is found.
 * Supports: "Scheduled" & "Unscheduled" task types.
 * @param {Object} activeTask - An active task (ie "AssessmentUnscheduleTask" or "ADLCareTask") record.
 * @param {Array} trackingTasks - An array of "AssessmentTrackingTask" records.
 * @returns {Object} - Returns the matching record; if no match, then returns the original record. Esp, when provided an unscheduled tasks.
 */
const findMatchingRecord = (activeTask, trackingTasks) => {
	if (isScheduledTask(activeTask)) {
		return trackingTasks.reduce((match, current) => {
			if (current[SCHEDULED_ID] === activeTask[SCHEDULED_ID]) {
				match = { ...current };
				return match;
			}
			return match;
		}, {});
	} else {
		// for unscheduled tasks just return the task
		return { ...activeTask };
	}
};

// checks if task has repeating cycle
const hasRepeat = (task) => {
	if (!isEmptyVal(task?.AssessmentRecurringId)) return true;
	return false;
};

//////////////////////////////////////////////////////////////
//////////////////// ALA SELECTOR HELPERS ////////////////////
//////////////////////////////////////////////////////////////

// gets the 'defaultResident' for the ALASelector
// based off 'currentResident' from global state
const getDefaultResident = (residentFromState) => {
	if (isEmptyVal(residentFromState?.ResidentID)) return "";
	return formatResidentOnly(residentFromState);
};
// gets the 'defaultFacility' for the ALASelector
// based off 'currentFacility' from global state
const getDefaultFacility = (facilityFromState) => {
	if (isEmptyVal(facilityFromState.facilityID)) return "";
	return facilityFromState?.communityName;
};

// DEBUGGING HELPERS
const debugTask = (id, tasks = []) => {
	if (isEmptyArray(tasks)) return null;
	const scheduled = `AssessmentTrackingTaskId`;
	const unscheduled = `AssessmentUnscheduleTaskId`;

	return tasks.reduce((match, task) => {
		if (isScheduledTask(task)) {
			match = task[scheduled] === id ? task : null;
			return match;
		} else {
			match = task[unscheduled] === id ? task : null;
			return match;
		}
	}, {});
};
const debugLogger = (label, counts) => {
	const { pastDue, notComplete, total } = counts;
	if (pastDue !== 0) {
		console.group(`Counts: ${label}`);
		console.log("total", total);
		console.log("pastDue", pastDue);
		console.log("notComplete", notComplete);
		return console.groupEnd();
	} else {
		return console.log(`No Past Due`);
	}
};
const pastDueLogger = (task, day, shiftTimes = []) => {
	if (isPastDue(task, day, shiftTimes)) {
		console.group("Past Due Task:");
		console.log("task:", task);
		console.log("day:", day);
		console.log(`date:`, format(day, "MM/DD/YYYY"));
		console.groupEnd();
		return;
	} else {
		return;
	}
};

export { debugTask, debugLogger, pastDueLogger };

// ALA SELECTOR
export { getDefaultFacility, getDefaultResident };

// TASK IDS
export { SCHEDULED_ID, UNSCHEDULED_ID };

// TASK UPDATE REQUEST HELPERS
export { getScheduledRecord, saveScheduledUpdates };

// TASK TYPE HELPERS
export { isScheduledTask, isUITask };

// SORTING/FILTERING ARRAYS OF TASKS //
export {
	findNotCompleteTasks,
	findCompletedTasks,
	findPastDueTasks,
	findExceptionTasks,
	findMissedEvents,
};

// FIND TASKS BY *
export {
	matchTaskADL,
	findTasksByADL,
	findTasksByDay,
	findTasksByShift,
	findTasksByDayAndADL,
	findTasksByADLAndDay, // NOT-IN-USE!!!! - CONSIDER REMOVING
	findTasksByAdlDayAndShift,
	findMatchingRecord,
};

// FIND ALL TASKS BY XXXX
export { matchesShift, matchesADL, matchesDay };
export {
	groupTasksByStatus,
	groupTasksByShift,
	findAllTasksByAdlAndDay,
	findAllTasksByAdl,
	findAllTasksByAdlAndShift,
	findAllTasksByAdlDayAndShift,
	findAllTasksByDay,
	findAllTasksByDayAndShift,
	findAllTasksByShift,
};

// GET TASK RECORD ATTRIBUTES //
export {
	hasRepeat,
	checkForShift,
	checkForNotes,
	getTaskNotes,
	getTaskIndex,
	getTaskIdType,
	getTaskType,
	getTaskID,
	getTaskDate,
	getTaskName,
	getTaskNameExtended,
	getTaskShift,
	getTaskStatus,
	getTaskCategory,
	getTaskDueDate,
	getTaskTypeDesc,
	getTaskDesc, // newer version???
	getTaskDescription,
	getCreatedDate,
	getTaskEndTime,
	getPastDueTime,
	getTaskDueTime,
	getTaskDateInWords,
};

export { convertToWeekdays };

// CHECKING TASK STATUS //
export {
	isLocked,
	isPastDue,
	isCompleted,
	isNotComplete,
	isMissedEvent,
	isException,
	getStatusDesc,
	checkForPastDue,
	getTasksByStatus,
};

// TASK STATUS HELPERS //
export {
	getAllNotComplete,
	isAllComplete,
	toggleComplete,
	toggleAllComplete,
	toggleCompleteByADL,
	markComplete,
	markAllComplete,
	markCompleteByADL,
	findAndReplaceStale,
};
