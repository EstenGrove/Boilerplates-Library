import { test } from "./utils_env";
import { unscheduledTasks } from "./utils_endpoints";
import { requestParams } from "./utils_params";
// helpers
import { UnscheduledTaskModel } from "./utils_models";
import { isEmptyObj } from "./utils_types";
import { getCategoryID } from "./utils_categories";
import { replaceNullWithMsg } from "./utils_processing";
import { findPriorityID } from "./utils_priority";

/**
 * @description "CREATE" request to create and save one or more new task records
 * @param {string} token base64 encoded auth token
 * @param {object} params query params; includes DB and table name
 * @param {array} tasks array of AssessmentUnscheduleTask models with updated values to save to database
 */
const saveUnscheduledTasks = async (token, tasks) => {
	let url = test.base + unscheduledTasks.save.task;
	url += "?" + new URLSearchParams(requestParams.unscheduledTask);

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(tasks)
		});
		const response = await request.json();
		return response;
	} catch (err) {
		console.log("An error occurred", err);
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
				"Content-Type": "application/json"
			}
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("An error occurred", err);
		return err.message;
	}
};

// returns the AssessmentUnscheduleTaskId
const updateUnscheduledTask = async (token, tasks) => {
	let url = test.base + unscheduledTasks.update.task;
	url += "?" + new URLSearchParams(requestParams.unscheduledTask);

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(tasks)
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return err.message;
	}
};

const deleteUnscheduledTask = async (token, tasks) => {
	let url = test.base + unscheduledTasks.delete.task;
	url += "?" + new URLSearchParams(requestParams.unscheduledTask);

	try {
		const request = await fetch(url, {
			method: "DELETE",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(tasks)
		});

		const response = await request.json();
		return response;
	} catch (err) {
		console.log("An error occurred " + err.message);
		return err;
	}
};

// populate AssessmentUnscheduleTask model for new unscheduled task
const populateUnscheduledModel = (vals, model) => {
	if (isEmptyObj(vals)) return alert("Please complete form.");

	return {
		...model,
		AssessmentCategoryId: getCategoryID(vals.newTaskCategory),
		AssessmentReasonId: 9, // defaults to "FORGOTTEN"
		AssessmentResolutionId: 6, // defaults to "PENDING"
		AssessmentPriorityId: findPriorityID(vals.newTaskPriority),
		AssessmentTaskStatusId: 1, // defaults to "PENDING"
		FollowUpDate: replaceNullWithMsg(vals.newTaskFollowUpDate, ""),
		EntryDate: new Date().toUTCString(),
		SignedBy: vals.newTaskSignature,
		InitialBy: "",
		Notes: replaceNullWithMsg(vals.newTaskVoiceNote, ""),
		Description: replaceNullWithMsg(
			vals.newTaskName,
			"No Description was added"
		),
		CompletedDate: new Date().toUTCString(),
		IsCompleted: false,
		IsFinal: false,
		IsActive: true,
		CreatedDate: new Date().toUTCString(),
		CreatedBy: "7801CC7E-4462-4442-B214-BCDFF70B3F95"
	};
};

// handles:
// 1. Creates new task model instance
// 2. sets the resident and user ids
// 3. grabs the model
// 4. updates task model w/ form values and pertinent data
// 5. returns updated new task model (ie UnscheduledTaskModel)
const mapUpdatesToModel = (formVals, residentID, userID) => {
	// init model class instance...
	const initModel = new UnscheduledTaskModel();
	initModel.setProperty("ResidentId", residentID);
	initModel.setProperty("UserId", userID);
	// exposed task model
	const model = initModel.getModel();
	// update the model and return it
	const updatedModel = populateUnscheduledModel(
		formVals, // from CreateTaskForm
		model // unscheduled model
	);
	return updatedModel;
};

export {
	saveUnscheduledTasks,
	getUnscheduledTasks,
	updateUnscheduledTask,
	deleteUnscheduledTask
};

// new task creation (ie unscheduled tasks)
export { populateUnscheduledModel, mapUpdatesToModel };
