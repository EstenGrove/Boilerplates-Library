import { test } from "./utils_env";
import { adlSchedule } from "./utils_endpoints";
import { isEmptyArray } from "./utils_types";
import { getCategoryID } from "./utils_categories";
import { getShiftID } from "./utils_shifts";

////////////////////////////////////////////////////////////////////////
////////////////////// ADL SHIFT SCHEDULE HELPERS //////////////////////
////////////////////////////////////////////////////////////////////////

// saves a resident's shift schedule per ADL
const saveResidentAdlSchedule = async (token, residentID, scheduleModel) => {
	let url = test.base + adlSchedule.saveSchedule;
	url += "&" + new URLSearchParams({ residentId: residentID });

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(scheduleModel),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("❌ Oops. Your 'saveResidentAdlSchedule' failed", err);
		return err.message;
	}
};

// NOTE: primary usage, simply pass 1 or more updated AdlShiftScheduleModel records, with an array or 1 or more residentIDs to update.
/**
 * @description - Utililty that saves/updates several (1 or more) ResidentAdlSchedule records for shifts (single resident, multiple adl schedules)
 * @param {String} token - base64 encoded auth token.
 * @param {Array} listOfResidentIDs - A list of resident uids to apply the shift model updates towards.
 * @param {Array} adlShiftModels - An array of 1 or more updated AdlShiftScheduleModel(s) (ie "AssessmentResidentAdlShift" records) to be applied.
 * @description - Description of the POST body:
 * @property {Array} ResidentIds - "listOfResidentIDs" - FIELD: An array of residents ids for residents whose records should be updated.
 * @property {Array} ResidentAdlShifts - "adlShiftModels" - FIELD: An array of Adl Shift Records (ie AssessmentResidentAdlShift records) with updated values.
 */
const saveResidentAdlScheduleMany = async (
	token,
	listOfResidentIDs = [],
	adlShiftModels = []
) => {
	let url = test.base + adlSchedule.saveScheduleMany;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ResidentIds: listOfResidentIDs,
				ResidentAdlShifts: adlShiftModels,
			}),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("❌ Oops. Your 'saveResidentAdlSchedule' failed", err);
		return err.message;
	}
};

/**
 * @description - Fetches ALL Adl Shift Schedules for a given resident.
 * @param {String} token - Base64 encoded auth token.
 * @param {Number} residentID - A numeric uid for a given resident.
 * @returns {Array} - Returns an array of Adl Shift Schedule records.
 */
const getResidentAdlSchedule = async (token, residentID) => {
	let url = test.base + adlSchedule.getSchedule;
	url += "?" + new URLSearchParams({ residentId: residentID });

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
		console.log("❌ Oops. Your 'getResidentAdlSchedule' failed", err);
		return err.message;
	}
};

/**
 * @description - Fetches a facility's Adl Shift settings for a SINGLE ADL, for ALL RESIDENTS.
 * @param {String} token - A base64 encoded auth token.
 * @param {String} facilityID - A string-form facility uid.
 * @param {NUmber} categoryID - A numeric-form category id (ie "AssessmentCategoryId").
 * @returns {Array} - Returns an array of AdlShiftSchedule records.
 */
const getAdlShiftChanges = async (token, facilityID, categoryID) => {
	let url = test.base + adlSchedule.getAdlShiftChanges;
	url += "?" + new URLSearchParams({ facilityId: facilityID });
	url += "&" + new URLSearchParams({ assessmentCategoryId: categoryID });

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
		console.log("❌ Oops. The 'getAdlShiftChanges' request failed: ", err);
		return err.message;
	}
};

////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// FILTERING/SORTING ADL SHIFT RECORDS /////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description - Finds all adl shift records that match a given ADL category.
 * @param {String} adl - An "AssessmentCategory" as a string (ie "Ambulation", "Grooming" etc).
 * @param {Array} shiftRecords - An array of "AssessmentResidentAdlShift" records to be sorted/filtered.
 * @returns {Array} - Returns an array of matching ADL Shift records. (ie "AssessmentResidentAdlShift" records).
 */
const findShiftRecordsByADL = (adl, shiftRecords) => {
	if (isEmptyArray(shiftRecords)) return [];
	return shiftRecords.filter(
		(record) => record.AssessmentCategoryId === getCategoryID(adl)
	);
};

/**
 * @description - Filters/finds Adl Shift records by ADL shift.
 * @param {String} shift - A string Assessment Shift (ie "AM", "PM", "NOC").
 * @param {Array} shiftRecords - An array of AssessmentResidentAdlShift records for a given resident.
 * @returns {Object} - Returns a single matching ADL Shift record. (ie "AssessmentResidentAdlShift" record).
 */
const findShiftRecordsByShift = (shift, shiftRecords) => {
	if (isEmptyArray(shiftRecords)) return [];
	return shiftRecords.reduce((matchingRecord, record) => {
		if (record.AssessmentShiftId === getShiftID(shift)) {
			matchingRecord = record;
			return matchingRecord;
		} else {
			return matchingRecord;
		}
	}, {});
};

// SCHEDULE UPDATE REQUESTS
export {
	saveResidentAdlSchedule,
	saveResidentAdlScheduleMany,
	getResidentAdlSchedule,
	getAdlShiftChanges,
};

// FILTERING/SORTING ADL SHIFT RECORDS
export { findShiftRecordsByADL, findShiftRecordsByShift };
