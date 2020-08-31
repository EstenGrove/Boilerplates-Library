import { test } from "./utils_env";
import { scheduledTasks, reassess } from "./utils_endpoints";
import { format } from "date-fns";
import { isEmptyArray, isEmptyVal, hasProp } from "./utils_types";

/**
 * @description "READ" request to fetch active tasks
 * @param {string} token base64 encoded auth token
 * @param {object} params query params; includes DB and table name
 */
const getTrackingTasks = async (token, params) => {
	let url = test.base + scheduledTasks.get.task;
	url += "?" + new URLSearchParams(params);

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			}
		});
		const response = await request.json();
		return response;
	} catch (err) {
		return console.log("An error occurred ", err.message);
	}
};

/**
 * @description "UPDATE" request to update one or more AssessmentTrackingTask records
 * @param {string} token base64 encode auth token
 * @param {object} params query params; includes DB and table name
 * @param {array} taskToSave AssessmentTrackingTask model with updated values to submit to server
 */
const updateTrackingTasks = async (token, tasksToUpdate) => {
	let url = test.base + scheduledTasks.save.taskMany;
	url +=
		"?" +
		new URLSearchParams({
			"db-meta": "Advantage",
			source: "AssessmentTrackingTask"
		});

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(tasksToUpdate)
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return console.log("An error occurred ", err.message);
	}
};

// updates a reassessment record associated w/ a task record
// ONLY handles a single record
// WHERE TO GET AssessmentTrackingReassessmentId???
const updateReassessRecord = async (token, reassessRecord) => {
	let url = test.base + reassess.updateSingle;
	url +=
		"?" +
		new URLSearchParams({
			"db-meta": "Advantage",
			source: "AssessmentTrackingReassess"
		});

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(reassessRecord)
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return console.log("An error occurred ", err.message);
	}
};

/**
 * @description "DELETE" request to delete one or more AssessmentTrackingTasks from the database.
 * @param {string} token base64 encoded auth token
 * @param {object} params query params; includes DB and table name
 * @param {array} tasksToDelete task models to delete from DB.
 */
const deleteTrackingTasks = async (token, params, tasksToDelete) => {
	let url = test.base + scheduledTasks.delete.taskMany;
	url += "?" + new URLSearchParams(params);

	try {
		const request = await fetch(url, {
			method: "DELETE",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(tasksToDelete)
		});
		const response = await request.json();
		return response;
	} catch (err) {
		console.log("An error occurred", err);
		return err.message;
	}
};

// REQUIREMENTS:
// 1. CASES TO HANDLE: (make calles to "handleResolutions()" function based off of status)
//  1a. RESIDENT UNAVAILABLE
//  2a. MISSED-EVENT STATUS
//  3a. NOT-COMPLETE STATUS
//  4a. IN-PROGRESS STATUS

const isScheduledTask = task => {
	if (hasProp(task, "AssessmentUnscheduleTaskId")) {
		return false;
	}
	return true;
};

const findTasksByShift = (tasks, shift) => {
	if (isEmptyArray(tasks)) return;
	if (isEmptyVal(shift)) return;
	return tasks.filter(task => task.Shift === shift);
};

// by day (ie "Monday", "Wednesday")
const findTasksByDay = (tasks, day) => {
	if (isEmptyArray(tasks)) return;
	if (isEmptyVal(day)) return;
	return tasks.filter((task, index) => {
		if (task.DayOfWeek === day) {
			return task;
		}
		return null;
	});
};

// find todays tasks (ie "Wednesday")
const findTodaysTasks = tasks => {
	if (isEmptyArray(tasks)) return;
	return tasks.filter(task => task.DayOfWeek === format(new Date(), "dddd"));
};

// find by category (ie "Dressing")
const findTasksByADL = (tasks, adl) => {
	if (isEmptyArray(tasks)) return;
	return tasks.filter(task => task.ADLCategory === adl);
};

// find by today and adl (ie "Wednesday" & "Dressing")
const findTodaysTasksByADL = (tasks, adl) => {
	if (isEmptyArray(tasks)) return;
	if (isEmptyVal(adl)) return "No ADL was provided.";
	return findTasksByADL(findTodaysTasks(tasks), adl);
};

const findTasksByDayAndADL = (tasks, day, adl) => {
	if (isEmptyArray(tasks)) return;
	if (isEmptyVal(day) || isEmptyVal(adl)) return;
	return findTasksByADL(findTasksByDay(tasks, day), adl);
};

// TASK UPDATE UTILITIES
export {
	isScheduledTask,
	findTasksByShift,
	findTasksByDay,
	findTodaysTasks,
	findTasksByADL,
	findTodaysTasksByADL,
	findTasksByDayAndADL
};

// HTTP REQUESTS
export {
	getTrackingTasks,
	updateTrackingTasks,
	deleteTrackingTasks,
	updateReassessRecord
};
