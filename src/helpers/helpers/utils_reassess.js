import { test } from "./utils_env";
import { reassess } from "./utils_endpoints";
import { ReassessModel } from "./utils_models";
import { isUITask, isScheduledTask } from "./utils_tasks";
import { isEmptyVal } from "./utils_types";

import { getResolutionID, getResolutionNameFromID } from "./utils_resolution";
import { getReasonID, getReasonFromID } from "./utils_reasons";

/**
 * @description - Saves 'Task Reassess' record to ALA Services for one or more task records.
 * @param {String} token - Base64 encoded auth token.
 * @param {Object|Array} reassessRecords - One or more 'AssessmentTrackingReassess' records. Objects will be merged in an array for the request.
 * @returns {Array} - Returns an array of 'AssessmentTrackingReassess' IDs that were updated.
 */
const saveReassessMany = async (token, reassessRecords) => {
	let url = test.base + reassess.saveReassessMany;

	let records;
	if (!Array.isArray(reassessRecords)) {
		records = [reassessRecords];
	}

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(records),
		});
		const response = await request.json();

		return response.Data;
	} catch (err) {
		return err.message;
	}
};

// REASSESS MODEL UPDATER(S)
const updateReassessModel = (vals, userID, task) => {
	if (!isScheduledTask(task)) return;
	if (!vals.reassess) return;

	const base = new ReassessModel();
	base.setUserID(userID);
	base.setProp("CreatedBy", userID);
	base.setTaskID(task?.AssessmentTaskId);
	base.setTrackingID(task?.AssessmentTrackingId);
	base.setNotes(vals?.reassessNotes ?? `No reassess notes`);
	base.setProp(`IsActive`, true);

	return base.getModel();
};

// updates model, fires off request
const applyReassessToTracking = async (token, vals, userID, task) => {
	if (!vals.reassess) return;

	const updatedModel = updateReassessModel(vals, userID, task);
	const success = await saveReassessMany(token, updatedModel);

	if (success) {
		return success;
	} else {
		return success;
	}
};

// REASSESS TYPE HELPERS
// ##TODOS:
// - Add better checks for reassess
// - Add task type support (ie 'scheduled'/'unscheduled' & 'tracking' record support)
const hasReassess = (task) => {
	if (isUITask(task)) {
		const hasEntry =
			!isEmptyVal(task?.ReasonForReassess) ||
			!isEmptyVal(task?.Reason) ||
			task?.AssessmentResolutionId === 2;
		return hasEntry;
	} else {
		return task?.AssessmentResolutionId === 2;
	}
};

// extracts the 'reassess notes' from a task's 'TaskNotes' field
const getReassessFromTaskNotes = (task) => {
	const reassess = /(Reassess:)(.{1,})/gm;
	const timestamp = /([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{1,4})( at )([0-9]{1,2})(:)([0-9]{1,2})\s(AM|PM)/gm;
	const rawNotes = task?.TaskNotes;

	const notes = rawNotes.match(reassess)?.[0];
	const timeStamp = rawNotes.match(timestamp)?.[0];
	return {
		notes,
		timeStamp,
	};
};

// request helpers
export { saveReassessMany, applyReassessToTracking };

export { hasReassess };

export { getReassessFromTaskNotes };

// model updaters
export { updateReassessModel };
