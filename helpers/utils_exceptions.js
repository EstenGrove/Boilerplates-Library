import { isEmptyVal, isEmptyArray } from "./utils_types";

/**
 * @description - Checks if a task was marked w/ an exception.
 * @param {Object} task - A scheduled/unscheduled task record.
 * @returns {Boolean} - Returns true|false.
 */
const hasException = (task) => {
	if (isEmptyVal(task.AssessmentExceptionId)) return false;
	return true;
};

// checks if an exception already exists, & if so, prevents overwriting it.
// checks if 'ExceptionDate' already exists, or is 'AssessmentExceptionid' already exists.
const denyExceptionChange = (task) => {
	const { AssessmentExceptionId: currentID, ExceptionDate } = task;

	const hasExistingDate = !isEmptyVal(ExceptionDate);
	const hasExistingException = !isEmptyVal(currentID);
	const deny = hasExistingDate || hasExistingException;

	if (deny) {
		return true;
	} else {
		return false;
	}
};

/**
 * @description - Extracts the text descriptions from each record.
 * @param {Array} exceptionsList - An array of 'AssessmentFacilityException' records.
 */
const getExceptionDescs = (exceptionsList = []) => {
	if (isEmptyArray(exceptionsList)) return [];
	return exceptionsList.map(({ Description }) => Description);
};

////////////////////////////////////////////////////////////////////////////////
///////////////////////////// EXCEPTION MATCHER(S) /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// extracts the exception 'Description's from the records
const findExceptionTypeFromID = (exceptionID, exceptionTypes) => {
	if (isEmptyArray(exceptionTypes)) return "Exception";
	return exceptionTypes.reduce((desc, current) => {
		if (current.AssessmentExceptionId === exceptionID) {
			desc = current.Description;
			return desc;
		}
		return desc;
	}, "");
};

const getExceptionsFromRecords = (facilityExceptions) => {
	if (isEmptyArray(facilityExceptions)) return [];
	return facilityExceptions.map(({ BaseDescription, Description }) =>
		isEmptyVal(Description) ? BaseDescription : Description
	);
};

const matchExceptionDescFromTask = (task, facilityExceptions = []) => {
	const { AssessmentExceptionId: id } = task;
	return getExceptionTypeFromID(id, facilityExceptions);
};

/**
 * @description - Provides spaces between an exception description's words via the capital letters.
 * @param {String} desc - An exception description in need of formatting (ie 'NotInRoom', 'RefusedCare')
 * @returns {String} - Returns an evenly spaced exception description. (ie 'Not In Room', 'Refused Care')
 */
const formatExceptionDesc = (desc) => {
	if (isEmptyVal(desc)) return ``;
	const caps = /([A-Z])/g;
	return desc.replace(caps, " $1");
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////// EXCEPTION NAME & ID UTILS //////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * @description - Finds the matching 'AssessmentExceptionId' from a text exception description.
 * @param {String} exceptionStr - An exception description in string-form. Typically from a user selection.
 * @param {Array} facilityExceptions - An array of 'AssessmentFacilityException' records to search.
 * @returns {Number} - Returns a number-form uid. Otherwise returns null, if no match is found.
 */
const getExceptionID = (exceptionStr, facilityExceptions = []) => {
	if (isEmptyVal(exceptionStr) || isEmptyArray(facilityExceptions)) return null;
	return facilityExceptions.reduce((matchingID, record) => {
		const recordDesc = isEmptyVal(record.Description)
			? record.BaseDescription
			: record.Description;
		if (recordDesc === exceptionStr) {
			matchingID = record.AssessmentExceptionId;
			return matchingID;
		}
		return matchingID;
	}, null);
};
/**
 * @description - Finds the ExceptionRecord that matches the task's 'AssesmentExceptionId', then returns the text description.
 * @param {Object} task - A task record w/ a valid exception.
 * @param {Array} facilityExceptions - An array of 'AssessmentFacilityException's.
 * - Used for the <DailySummaryListItem/>'s Exception Indicator
 */
const getExceptionTypeFromID = (id, facilityExceptions = []) => {
	if (isEmptyArray(facilityExceptions) || isEmptyVal(id)) return "";
	return facilityExceptions.reduce((exceptionDesc, record) => {
		const { AssessmentExceptionId: recordID } = record;
		const desc = record?.Description ?? record?.BaseDescription;

		if (id === recordID) {
			exceptionDesc = desc;
			return exceptionDesc;
		}
		return exceptionDesc;
	}, "Exception");
};

// not in use!!
export { findExceptionTypeFromID, formatExceptionDesc };

// exception task helpers
export {
	denyExceptionChange,
	hasException,
	getExceptionDescs,
	getExceptionID,
	getExceptionTypeFromID,
	getExceptionsFromRecords,
	matchExceptionDescFromTask,
};
