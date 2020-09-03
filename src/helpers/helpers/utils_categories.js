import { test } from "./utils_env";
import { isEmptyObj, isEmptyArray } from "./utils_types";
import { facility } from "./utils_endpoints";

// REQUEST HELPERS

/**
 * @description - Fetches a facility's ADL Categories, if NOT available from the 'Global Store'.
 * @param {String} token - An auth token.
 * @param {Number} index - Staring index in database table.
 * @param {Number} rows - Number of rows to return from table in database.
 * @returns {Array} - Returns an array of AssessmentCategory records.
 */
const getAdlCategories = async (token, index = 0, rows = 20) => {
	let url = test.base + facility.getCategories;
	url += "?" + new URLSearchParams({ index, rows });

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
		// const adls = response?.Data?.filter((x) => x.Name !== "All");
		console.log(`✓ Success! Fetched Adl categories:`, response);
		return response.Data;
	} catch (err) {
		console.log(`❌ Oops! 'getAdlCategories()' request has failed:`, err);
		return err.message;
	}
};

// returns matching category name from legacy
const checkCategoryNaming = (category) => {
	const lowerCaseADL = category.toLowerCase();
	if (!lowerCaseADL || lowerCaseADL === undefined || lowerCaseADL === "")
		return;

	if (lowerCaseADL === ("medassist" || "meds" || "medication")) {
		return "Meds";
	}

	if (lowerCaseADL === ("statuschecks" || "health")) {
		return "Health";
	}
	if (lowerCaseADL === ("ambulation" || "ambulate")) {
		return "Ambulate";
	}
	if (lowerCaseADL === ("groom" || "grooming")) {
		return "Grooming";
	}
	if (lowerCaseADL === ("toilet" || "toileting")) {
		return "Toileting";
	}
	if (lowerCaseADL === ("transfer" || "transfers")) {
		return "Transfers";
	}
	if (lowerCaseADL === ("care" || "specialcare")) {
		return "Care";
	}
	// *addition*
	if (lowerCaseADL === ("health" || "statuschecks")) {
		return "Health";
	}
	if (lowerCaseADL === "psychosocial" || lowerCaseADL === "mental") {
		return "Mental";
	}
	if (lowerCaseADL === ("bath" || "bathing")) {
		return "Bathing";
	}
	return category;
};

const checkAdlNaming = (category) => {
	const lowerAdl = category.toLowerCase();
	switch (lowerAdl) {
		case "ambulation":
			return `Ambulation`;
		case "bathing":
			return `Bathing`;
		case "dressing":
			return `Dressing`;
		case "grooming":
			return `Grooming`;
		case "laundry":
			return `Laundry`;
		case "meals":
			return `Meals`;
		case "meds":
		case "medassist":
			return `MedAssist`;
		case "other":
			return `Other`;
		case "mental":
		case "psychosocial":
			return `Mental`;
		case "care":
		case "specialcare":
			return `SpecialCare`;
		case "health":
		case "statuschecks":
			return `Health`;
		case "toilet":
		case "toileting":
			return `Toileting`;
		case "transfer":
		case "transfers":
			return `Transfers`;
		case "all":
			return `All`;
		default:
			return category;
	}
};

// accepts a ADL("Dressing", "Bathing" etc) & returns the id
const getCategoryID = (category) => {
	// const name = checkCategoryNaming(category);
	switch (category) {
		case "ALL":
		case "All":
			return 1;
		case "Ambulation":
		case "Ambulate":
			return 2;
		case "Bathing":
			return 3;
		case "Dressing":
			return 4;
		case "Grooming":
			return 5;
		case "Laundry":
			return 6;
		case "Meals":
			return 7;
		case "Meds":
		case "MedAssist":
			return 8;
		case "Mental":
		case "Psychosocial":
			return 9;
		case "SpecialCare":
			return 10;
		case "Health":
		case "StatusChecks":
			return 11;
		case "Toileting":
			return 12;
		case "Transfers":
			return 13;
		case "Other":
			return 14;
		default:
			return 14;
	}
};

// returns name from id
const getCategoryNameFromID = (name) => {
	switch (name) {
		case 1:
			return "All";
		case 2:
			return "Ambulation";
		case 3:
			return "Bathing";
		case 4:
			return "Dressing";
		case 5:
			return "Grooming";
		case 6:
			return "Laundry";
		case 7:
			return "Meals";
		case 8:
			return "MedAssist";
		case 9:
			return "Psychosocial"; // Health
		case 10:
			return "SpecialCare";
		case 11:
			return "StatusChecks"; // Health
		case 12:
			return "Toileting";
		case 13:
			return "Transfers";
		case 14:
			return "Other";
		default:
			return 14;
	}
};

// checks consistent naming and returns array of strings
const formatAdlName = (adls) => {
	if (isEmptyArray(adls)) return [];

	return adls.map((x) => {
		const val = x?.AdlCategoryType ?? x.Name;
		return checkAdlNaming(val);
	});
};
const getAdlName = (adl) => {
	return adl?.AdlCategoryType ?? adl?.Name;
};
// sort Adls alphabetically (A-Z)
const sortAdlsByName = (adls = []) => {
	if (isEmptyArray(adls)) return [];
	return adls.sort((a, b) => {
		return checkAdlNaming(a?.AdlCategoryType ?? a?.Name).localeCompare(
			checkAdlNaming(b?.AdlCategoryType ?? b?.Name)
		);
	});
};

/**
 * @description - Organizes & sorts the ADL categories by name from A-Z.
 * @param {Object} adls - Either an 'AssessmentCategory' record or 'AssessmentFacilityCategory' record.
 * @returns {Array} - Returns an array of string-form ADL Category names alphabetically.
 */
const sortAndFormatAdls = (adls = []) => {
	if (isEmptyArray(adls)) return [];
	const sorted = sortAdlsByName(adls);
	return sorted.map((adl) => {
		const val = adl?.AdlCategoryType ?? adl?.Name;

		return val;
	});
};

// removes 'ALL' Adl Category
const removeAdlByName = (adlToRemove, allAdls = []) => {
	if (isEmptyArray(allAdls)) return [];
	return [...allAdls].filter((adl) => adl !== adlToRemove);
};

// maps thru ADL categories & returns ID from category name (ie "Dressing", "Bathing)
const findCategoryID = (category, levels) => {
	return levels.reduce((acc, cur) => {
		if (cur.AdlCategoryType === category) {
			acc = cur.AdlCategoryId;
			return cur.AdlCategoryId;
		}
		return acc;
	}, {});
};

// accepts an adl care level???
const getIndependentStatus = (adl) => {
	if (isEmptyObj(adl)) return "Unknown";
	if (adl.AdlIndependent) return "Yes";
	return "No";
};
const getDailyADLStatus = (adl) => {
	if (isEmptyObj(adl)) return "";
	if (adl.EnableDaily) return "Yes";
	return "No";
};

// get adl filters from ADLCareLevel array
// used for <FloatingFiltersPanel/> values
const generateADLFilters = (adls) => {
	if (isEmptyArray(adls)) return {};
	return adls.reduce((filters, adl) => {
		const name = getAdlName(adl);
		if (!filters[name]) {
			filters[name] = true;
			return filters;
		}
		return { ...filters };
	}, {});
};

// requests
export { getAdlCategories, getIndependentStatus, getDailyADLStatus };

// ADL CATEGORY TRANSFORMS
export {
	sortAndFormatAdls,
	removeAdlByName,
	checkAdlNaming,
	sortAdlsByName,
	generateADLFilters,
	getAdlName,
	formatAdlName,
	checkCategoryNaming,
	findCategoryID, // filter carelevels array for match
	getCategoryID, // get id from name
	getCategoryNameFromID, // get name from id
};
