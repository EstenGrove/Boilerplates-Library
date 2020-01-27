import { isEmptyVal } from "./utils_types";
import { findStatusID } from "./utils_status";
import { findPriorityID } from "./utils_priority";
import { findShiftID } from "./utils_shifts";
import { findTaskRecordByProp } from "./utils_tasks";
import { getReasonID } from "./utils_reasons";
import { getResolutionID } from "./utils_resolution";

/**
 * @description - First finds the AssessmentTrackingTask record by ID, then updates it's values with the user input from the edit form.
 * @param {object} vals - form values from user input (ie Edit/Create task form)
 * @param {object} activeTask - current ADLCareTask record being updated
 * @param {array} taskRecords - array of AssessmentTrackingTask records for a resident.
 * @returns {function} Returns a callback which is invoked that updates the task record prior to submission.
 */
const findRecordAndUpdate = (vals, activeTask, taskRecords) => {
	const matchingRecord = findTaskRecordByProp(
		activeTask,
		taskRecords,
		"AssessmentTrackingTaskId"
	);
	return updateTaskRecord(vals, matchingRecord);
};

/**
 * @description - Takes form values from user and and the task record and applies the new values to the task record before being saved server-side.
 * @param {object} vals - form values from user input.
 * @param {object} record - AssessmentTrackingTask record
 * @returns {object} - Returns the updated AssessmentTrackingTask record for submission.
 */
const updateTaskRecord = (vals, record) => {
	switch (vals.status) {
		case "COMPLETE": {
			return handleCompletion(vals, record);
		}
		case "NOT-COMPLETE": {
			return handleException(vals, record);
		}
		case "PENDING": {
			return handlePending(vals, record);
		}
		case "MISSED-EVENT": {
			return handleException(vals, record);
		}
		case "IN-PROGRESS": {
			return handlePending(vals, record);
		}
		default:
			return handlePending(vals, record);
	}
};

/**
 * @description - Handles the "TaskNotes" field in a task record. Appends "ReassessNotes" if applicable.
 * @param {object} vals - form values from user input
 * @returns {string} - Returns a string with the formatted task notes, including Reassess notes, if applicable.
 */
const handleTaskNotes = vals => {
	if (isEmptyVal(vals.reassessNotes)) return vals.taskNotes;
	return `${vals.taskNotes} <br/> Reassess Notes: ${vals.reassessNotes}`;
};

/**
 * @description - Determines the AssessmentResolutionId based off the user's selected values in the form.
 * @param {object} vals - form values from user input
 * @returns {string} - Returns the string-form of the task resolution, based on user inputs.
 */
const determineResolution = vals => {
	if (vals.residentUnavailable) {
		return "RESIDENT-DENIED";
	}
	if (isEmptyVal(vals.followUpDate) && !vals.residentUnavailable) {
		return "TBC-NEXT-SHIFT";
	}
	if (vals.requiresMedCheck && !vals.residentUnavailable) {
		return "TBC-NEXT-SHIFT-NEEDS";
	}
	if (vals.reassess) {
		return "COMPLETED-REASSESSMENT-NEEDED";
	}
	return "PENDING";
};

/**
 * @description - Handles statusing and updating a task record marked as "NOT-COMPLETE" and/or "MISSED-EVENT". Accounts for "RESIDENT UNAVAILABLE" and a scheduled "FOLLOWUP DATE"
 * @param {object} vals - form values
 * @param {object} record - task record to be updated
 * @returns {object} - Returns the updated task record with the user's inputs applied.
 */
const handleException = (vals, record) => {
	return {
		...record,
		CompletedDate: "",
		SignedBy: vals.signature,
		Notes: handleTaskNotes(vals),
		IsCompleted: false,
		IsFinal: false,
		IsActive: true,
		AssessmentTaskStatusId: findStatusID(vals.status),
		AssessmentReasonId: getReasonID(vals.reason),
		AssessmentResolutionId: getResolutionID(determineResolution(vals)),
		AssessmentPriorityId: findPriorityID(vals.priority),
		CompletedAssessmentShiftId: 4,
		FollowUpDate: isEmptyVal(vals.followUpDate) ? "" : vals.followUpDate
	};
};

// handles completed task updates
const handleCompletion = (vals, record) => {
	return {
		...record,
		CompletedDate: new Date().toUTCString(),
		SignedBy: vals.signature,
		Notes: handleTaskNotes(vals),
		IsCompleted: true,
		IsFinal: true,
		IsActive: true,
		AssessmentReasonId: getReasonID("COMPLETED-AS-SCHEDULED"),
		CompletedAssessmentShiftId: findShiftID(vals.shift),
		AssessmentResolutionId: getResolutionID(
			determineResolution(getResolutionID(vals))
		),
		AssessmentTaskStatusId: findStatusID(vals.status),
		AssessmentPriorityId: findPriorityID(vals.priority)
	};
};

// handles pending task updates
const handlePending = (vals, record) => {
	return {
		...record,
		CompletedDate: "",
		SignedBy: vals.signature,
		Notes: handleTaskNotes(vals),
		IsCompleted: false,
		IsFinal: false,
		IsActive: true,
		AssessmentReasonId: isEmptyVal(vals.reason) ? 6 : getReasonID(vals.reason),
		CompletedAssessmentShiftId: findShiftID(vals.shift),
		AssessmentResolutionId: getResolutionID("PENDING"),
		AssessmentTaskStatusId: findStatusID(vals.status),
		AssessmentPriorityId: findPriorityID(vals.priority)
	};
};

// takes 2 items of any type and stringifies them then compares
// if the same (does NOT check referential equality) then returns true
// if not the same returns false
// ONLY TESTS THE VALUES, NOT THE REFERENCE!!!
const deepDiff = (item1, item2) => {
	const string1 = JSON.stringify(item1);
	const string2 = JSON.stringify(item2);
	if (string1 !== string2) return false;
	if (typeof string1 !== typeof string2) return false;
	return true;
};

export {
	determineResolution,
	handleTaskNotes,
	handleException,
	handleCompletion,
	handlePending,
	deepDiff
};

export { updateTaskRecord, findRecordAndUpdate };
