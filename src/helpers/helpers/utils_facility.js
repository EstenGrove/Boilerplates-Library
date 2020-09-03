import { test } from "./utils_env";
import { generic, facility, getFacilities } from "./utils_endpoints";
import { facility as facilityParams } from "./utils_params";
import { isEmptyVal, isEmptyArray } from "./utils_types";
import { formatResidentOnly } from "./utils_residents";

/**
 * @description - Fetches a list of facilities a user has access to based off the user's email.
 * @param {String} token - Base64 encoded auth token.
 * @param {String} userEmail - A string user email.
 * @returns {Array} - Returns an array of custom facility records containing:
 * - "CommunityName": facility's community name as a string.
 * - "FacilityId": uid for facility
 * - "ParentFacilityId": uid for parent facility, if applicable.
 * - "Shifts": a list of 'AssessmentFacilityShift' records, IF AVAILABLE; IF NOT AVAILABLE, then returns default 'AssessmentShift' records.
 * - "Address":
 * 		- "Address.Street"
 * 		- "Address.State"
 * 		- "Address.City"
 * 		- "Address.Zip"
 */
const getFacilitiesByUserEmail = async (token, userEmail) => {
	let url = test.base + getFacilities.byUserEmail;
	url += "?" + new URLSearchParams({ userEmail: userEmail });

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
 * @description - Fetches the current user's facility info; location/address, director's name, capacity & other info.
 * @param {String} token - Base64 encoded auth token.
 * @param {String} facilityID - A specific uid for the current user's facility.
 * @returns {Object} - Returns an object representing an entry in the "FACILITY" table in ALA Services.
 */
const getFacilityInfo = async (token, facilityID) => {
	let url = test.base + generic.get;
	url += "?" + new URLSearchParams({ ...facilityParams });
	url += "&" + new URLSearchParams({ guidFacility: facilityID });

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
		const { Data } = response; // array of objects
		const [entry] = Data; // object (ie 1st index)
		return entry;
	} catch (err) {
		return err.message;
	}
};
/**
 * @description - Fetches a facility's Assessment Category records w/ the category ID, name, IndicatorColor/Icon and meta data.
 * @param {String} token - A base64 encoded auth token.
 * @param {Number} index - Starting index in database to pull from.
 * @param {Number} rows - Number of rows in database to pull from.
 * @returns {Array} - Returns an array of "AssessmentCategory" records; NOT THE SAME AS "ADLCareLevel" records from the GetResident(Day|Week)*** APIs.
 */
const getFacilityCategories = async (token, index = 0, rows = 50) => {
	let url = test.base + facility.getCategories;
	url += "?" + new URLSearchParams({ index, rows });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			},
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return err.message;
	}
};
/**
 * @description - Fetches a facility's Assessment Shift records w/ start/end times, shift ID, name and relevant meta. NOT SAME AS "ResidentAdlShift" records.
 * @param {String} token - A base64 encoded auth token.
 * @param {Number} index - Starting index in database to pull from.
 * @param {Number} rows - Number of rows in database to pull from.
 * @returns {Array} - Returns an array with every relevant "AssessmentShift" record for the facility.
 */
const getShifts = async (token, index = 0, rows = 10) => {
	let url = test.base + facility.getShifts;
	url += "?" + new URLSearchParams({ index, rows });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			},
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		return err.message;
	}
};

//////////////////////////////////////////////////////////////////////
///////////// RESIDENT/FACILITY SELECTOR HELPERS & UTILS /////////////
//////////////////////////////////////////////////////////////////////

/**
 * @description - Finds a facility's shift records by matching facilityId's.
 * @param {String} facilityID - A selected facility's facility ID.
 * @param {Array} facilitiesByUser - An array of custom facility records to search.
 * @returns {Array} - Returns an array of 'AssessmentFacilityShift' records when given a facilityID.
 */
const getAdlShiftsByFacilityID = (facilityID, facilitiesByUser = []) => {
	if (isEmptyVal(facilityID)) return [];
	if (isEmptyArray(facilitiesByUser)) return [];
	return facilitiesByUser.reduce((shifts, current) => {
		if (facilityID === current.FacilityId) {
			shifts = [...current.Shifts];
			return shifts;
		}
		return shifts;
	}, []);
};

/**
 * @description - Helper that will sort facilities alphabetically by name and return a list of 'CommunityName' fields to use w/ the dropdown.
 * @param {Array} facilities - An array of facility records (ie 'AssessmentFacility' records).
 * @returns {Array of String} - Returns an array of strings containing ALL 'CommunityName' fields from facility records.
 */
const formatAndSortFacilities = (facilities = []) => {
	return facilities
		.sort((a, b) => {
			return a.CommunityName.localeCompare(b.CommunityName);
		})
		.map(({ CommunityName }) => CommunityName);
};

/**
 * @description - Finds the matching facility record based off a Community's 'CommunityName' field.
 * @param {String} selection - A user-selected string value representing a facility's 'CommunityName' field.
 * @param {Array} facilities - An array of facility records by current user (ie user has access to).
 * @returns {Object} - Returns an object; matching 'AssessmentFacility' record.
 */
const matchFacilityByName = (selection, facilities = []) => {
	return facilities.reduce((match, cur) => {
		if (cur?.CommunityName === selection) {
			match = { ...cur };
			return match;
		}
		return match;
	}, {});
};
/**
 * @description - Finds matching facility record from a 'facilityID'.
 * @param {String} id - String-form facility ID.
 * @param {Array} facilities - An array of facilities from the 'currentUser' object.
 * @returns {Object} - Returns the matching facility record (ie 'FACILITY' record).
 */
const matchFacilityByID = (id, facilities = []) => {
	return facilities.reduce((match, cur) => {
		if (cur?.FacilityId === id) {
			match = { ...cur };
			return match;
		}
		return match;
	}, {});
};
const getFacilityID = (selection, facilities = []) => {
	const { FacilityId } = matchFacilityByName(selection, facilities);
	return FacilityId;
};

//////////////////////////////////////////////////////////////////////
/////////////////////// ALASELECTOR UI HELPERS ///////////////////////
//////////////////////////////////////////////////////////////////////

// ALL UPDATED - 6/18/2020

// checks if user has selected a facility
const hasFacility = (selectedFacility) => {
	if (isEmptyVal(selectedFacility)) return false;
	return true;
};
const hasResident = (selectedResident) => {
	if (isEmptyVal(selectedResident)) return false;
	return true;
};
const getBtnText = (isAdmin = false, selectedFacility, selectedResident) => {
	if (!isAdmin && !hasResident(selectedResident)) {
		// not admin && no selection made
		return `Select Resident`;
	} else if (!isAdmin && hasResident(selectedResident)) {
		// not admin && has resident selection
		return `Change Resident`;
	} else if (!hasFacility(selectedFacility)) {
		// is admin && no facility selection
		return `Select Facility`;
	} else if (hasFacility(selectedFacility) && !hasResident(selectedResident)) {
		// is admin && has facility selection
		return `Change Facility`;
	} else {
		// is admin && has both resident/facility selections
		return `Change Facility/Resident`;
	}
};

// get the 'defaultResident' from the global store
const getCurrentResidentStr = (globalResident) => {
	if (isEmptyVal(globalResident?.ResidentID)) return "";
	return formatResidentOnly(globalResident);
};
// get the 'defaultFacility' from the global store
const getCurrentFacilityStr = (globalFacility) => {
	if (isEmptyVal(globalFacility?.facilityID)) return "";
	return globalFacility?.communityName;
};

export {
	getFacilityInfo,
	getFacilityCategories,
	getShifts,
	getFacilitiesByUserEmail,
};

// facility/resident selector utils
export {
	getFacilityID,
	matchFacilityByID,
	matchFacilityByName,
	formatAndSortFacilities,
	getAdlShiftsByFacilityID,
};

// ALASelector UI utils
export {
	getBtnText,
	hasResident,
	hasFacility,
	getCurrentFacilityStr,
	getCurrentResidentStr,
};
