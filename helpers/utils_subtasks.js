import { test } from "./utils_env.js";
import { scheduledTasks } from "./utils_endpoints.js";
import { isEmptyObj, isEmptyVal, isEmptyArray } from "./utils_types";
import { findShiftID, findShiftName } from "./utils_shifts";
import { getReasonID } from "./utils_reasons";
import { getResolutionID } from "./utils_resolution";
import { findStatusID } from "./utils_status";
import { findPriorityID } from "./utils_priority";
import { format } from "date-fns";

// "id" utils for more readable code
const taskID = "AssessmentTrackingTaskId";
const subtaskID = "AssessmentTrackingTaskShiftSubTaskId";

// gets a count of the current ShiftSubTask records
const getSubtaskCount = async token => {
	let url = test.base + scheduledTasks.count.shiftSubTask;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			}
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("Oops. An error occurred " + err);
		return err.message;
	}
};

// ##TODO:
// 1. CONSIDER PASSING CALLBACK FOR ERROR HANDLING
const updateSubtask = async (token, subtask) => {
	let url = test.base + scheduledTasks.save.shiftSubTask;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(subtask)
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("Oops. An error occurred " + err);
		return err.message;
	}
};

const updateSubtaskMany = async (token, subtasks) => {
	let url = test.base + scheduledTasks.save.shiftSubTaskMany;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(subtasks)
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("Oops. An error occurred " + err);
		return err.message;
	}
};

const deleteSubtask = async (token, subtask) => {
	let url = test.base + scheduledTasks.delete.shiftSubTask;
	url +=
		"?" +
		new URLSearchParams({
			"db-meta": "Advantage",
			source: "AssessmentTrackingTaskShiftSubTask"
		});
	url +=
		"&AssessmentTrackingTaskShiftSubTaskId=" +
		subtask.AssessmentTrackingTaskShiftSubTaskId;

	try {
		const request = await fetch(url, {
			method: "DELETE",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(subtask)
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("Oops. An error occurred " + err);
		return err.message;
	}
};

/**
 * @description - Helper fn that formats, and joins a set of values into a URL query string.
 * @param {string} key - A string-based param key to join with each param value
 * @param {array} params - An array of param values to joined with a key.
 * @returns {string} - Returns "&key=param1&key=param2"
 *
 * @example
 *  // returns "id=1&id=2&id=3&id=4"
 * serializeIDs('id', [1, 2, 3, 4]);
 */
const serializeIDs = (key, params) => {
	return params.reduce((acc, cur) => acc.concat(`${key}=` + cur), []).join("");
};

/**
 * @description - A fetch helper that takes, an auth token and an array of ids to delete several subtasks at once.
 * @param {string} token - Base-64 encoded auth SecurityToken for the headers
 * @param {array} ids - An array of AssessmentTrackingTaskShiftSubTaskId(s) used to delete from the database
 * The query string that's created appears like so:
 * ASSESSMENTTRACKINGTASKSHIFTSUBTASKID=1238
 * &ASSESSMENTTRACKINGTASKSHIFTSUBTASKID=8398
 * &ASSESSMENTTRACKINGTASKSHIFTSUBTASKID=5467
 * Notice the first item DOES NOT contain the "&" since it's taken care of w/ a hard coded value.
 */

const deleteSubtaskMany = async (token, ids) => {
	let url = test.base + scheduledTasks.delete.shiftSubTaskMany;
	url +=
		"?" +
		new URLSearchParams({
			"db-meta": "Advantage",
			source: "AssessmentTrackingTaskShiftSubTask"
		});
	url += "&" + serializeIDs("ASSESSMENTTRACKINGTASKSHIFTSUBTASKID", ids);

	try {
		const request = await fetch(url, {
			method: "DELETE",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			}
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("Oops. An error occurred " + err);
		return err.message;
	}
};

// FIELDS TO UPDATE:
// 1. IsCheck
// 2. Notes
// 3. Description ????? - comes pre-populated already ???
// 4. AssessmentReasonId
// 5. AssessmentResolutionId
// 6. AssessmentTaskStatusId ?????
// 7. AssessmentPriorityId
// 8. CompletedDate
// 9. FollowUpDate
// 10. SignedBy
// 11. InitialBy
// 12. IsCompleted
// 13. IsFinal
// 14. IsActive

// returns empty object if no ShiftTasks,
// otherwise returns object with ShiftTaskIds as key and IsCheck value as the value.
// {3804: false, 3805: true, ...}
const createSubtaskVals = task => {
	if (isEmptyArray(task.ShiftTasks)) return {};
	const { ShiftTasks: subtasks } = task;
	return subtasks.reduce((acc, cur) => {
		const { AssessmentTrackingTaskShiftSubTaskId: id, IsCheck } = cur;
		const accClone = {
			...acc,
			[id]: IsCheck
		};
		acc = accClone;
		return acc;
	}, {});
};

// list: subtasks
// iteratee: prop to sort by within object
const groupByShift = (subtasks, iteratee) => {
	if (isEmptyArray(subtasks)) return {};
	return subtasks.reduce((shiftMap, item) => {
		const shiftID = findShiftName(iteratee(item));
		if (!shiftMap[shiftID]) {
			shiftMap[shiftID] = [];
		}
		shiftMap[shiftID].push(item);
		return shiftMap;
	}, {});
};

// accepts a string-form shift (ie "AM", "PM", "NOC")
const countSubtasksByShift = (subtasks, shift) => {
	if (isEmptyArray(subtasks)) return 0;
	return subtasks.filter(x => x.AssessmentShiftId === findShiftID(shift))
		.length;
};

// accepts a shiftID (ie 1, 2, 3)
const countSubtasksByShiftID = (subtasks, shiftID) => {
	if (isEmptyArray(subtasks)) return 0;
	return subtasks.filter(x => x.AssessmentShiftId === shiftID).length;
};

// filters by AssessmentShiftId
const getSubtaskByShiftID = (subtasks, shiftID) => {
	if (isEmptyArray(subtasks)) return [];
	return subtasks.filter(subtask => subtask.AssessmentShiftId === shiftID);
};
// active subtask and subtask records
const findSubtaskByID = (active, records) => {
	if (isEmptyObj(active)) return {};
	return records.reduce((all, item) => {
		if (
			item.AssessmentTrackingTaskShiftSubTaskId ===
			active.AssessmentTrackingTaskShiftSubTaskId
		) {
			all = item;
			return all;
		}
		return all;
	}, {});
};

const findSubtaskRecord = (activeID, records) => {
	if (isEmptyVal(activeID)) return {};
	return records.reduce((all, item) => {
		if (item.AssessmentTrackingTaskShiftSubTaskId === activeID) {
			all = item;
			return all;
		}
		return all;
	}, {});
};

const determineSubtaskResolutionID = vals => {
	if (!isEmptyVal(vals.followUpDate)) {
		return 3; // TBC-NEXT-SHIFT
	}
	if (vals.isChecked) {
		return 1; // COMPLETED
	}
	return 6; // NOT-COMPLETED
};

const updateSubtaskRecord = (vals, activeSubtask, records) => {
	const match = findSubtaskByID(activeSubtask, records);
	if (vals.isChecked) {
		return handleSubtaskCompletion(vals, match);
	}
	return handleSubtaskException(vals, match);
};

const handleSubtaskCompletion = (vals, record) => {
	return {
		...record,
		CompletedDate: new Date().toUTCString(),
		FollowUpDate: isEmptyVal(vals.followUpDate)
			? ""
			: format(vals.followUpDate, "MM/DD/YYY h:mm:ss"),
		SignedBy: vals.signature,
		Notes: vals.notes,
		Description: vals.description, // need to add for subtasks,
		IsChecked: true,
		IsCompleted: true,
		IsFinal: false,
		AssessmentReasonId: getReasonID(vals.reason),
		AssessmentResolutionId: getResolutionID(vals.resolution),
		AssessmentTaskStatusId: findStatusID(vals.status),
		AssessmentPriorityId: findPriorityID(vals.priority)
	};
};

const handleSubtaskException = (vals, record) => {
	return {
		...record,
		CompletedDate: "NA",
		FollowUpDate: isEmptyVal(vals.followUpDate)
			? ""
			: format(vals.followUpDate, "MM/DD/YYYY h:mm:ss"),
		SignedBy: vals.signature,
		Notes: vals.notes,
		Description: vals.description, // need to add for subtasks,
		IsChecked: false,
		IsCompleted: false,
		IsFinal: false,
		AssessmentReasonId: 7, // NOT-COMPLETED
		AssessmentResolutionId: 6, // PENDING
		AssessmentTaskStatusId: findStatusID(vals.status),
		AssessmentPriorityId: findPriorityID(vals.priority)
	};
};

// updating subtasks in state
// 1. UPDATE ADLCARETASK LOCALLY (LOCAL STATE)
// 2. DISPATCH ACTION AND PASS UPDATED ADLCARETASK RECORD (WITH SUBTASKRECORD)
// 3. FILTER STATE TASKS AND REMOVE EXISTING ADLCARETASK
// 4. MERGE UPDATED ADLCARETASK INTO PLACE

const removeItemByProp = (id, records, prop) => {
	return records.filter(item => item[prop] !== id);
};

/**
 * @description - Subtask filter function that will map thru the subtasks and return an array WITHOUT the subtask matching the passed id.
 * @param {array} subtasks - An array of subtask records (ie. AssessmentTrackingTaskShiftSubTask records)
 * @param {number} id - A unique id to use to filter for. Typically an "AssessmentTrackingTaskShiftSubTask"
 */
const removeStaleSubtask = (subtasks, id) => {
	return subtasks.filter(x => x.AssessmentTrackingTaskShiftSubTaskId !== id);
};

/**
 * @description - Takes an updated subtask record and an array of tasks(ADLCareTask(s)) and
 * finds the matching subtask record and replaces it with the updated record (ie newSubtask)
 * @param {object} newSubtask - An updated subtask record
 * @param {array} tasks - An array of ADLCareTasks used in the UI
 */
const subtaskUpdater = (newSubtask, tasks) => {
	return tasks.map((task, i) => {
		if (task[taskID] === newSubtask[taskID]) {
			const newTask = {
				...task,
				ShiftTasks: [
					...removeStaleSubtask(task.ShiftTasks, newSubtask[subtaskID]),
					newSubtask
				]
			};
			return newTask;
		}
		return task;
	});
};

export {
	createSubtaskVals,
	groupByShift,
	countSubtasksByShift,
	countSubtasksByShiftID,
	getSubtaskByShiftID,
	findSubtaskByID,
	findSubtaskRecord,
	removeItemByProp
};

// SHIFTTASK RECORD UPDATE UTILS
export {
	updateSubtaskRecord,
	handleSubtaskCompletion,
	handleSubtaskException,
	determineSubtaskResolutionID,
	subtaskUpdater // used in the state updater in GlobalStateContext
};

// UPDATE FETCH UTILS
export {
	getSubtaskCount,
	updateSubtask, // 1
	updateSubtaskMany, // 1 or more
	deleteSubtask, // 1
	deleteSubtaskMany // 1 or more
};
