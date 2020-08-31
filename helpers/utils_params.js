import { isEmptyArray, isBase64 } from "./utils_types";

///////////////////////////////////////////////////////////////////////////
/////////////////////////// URL & PARAMS UTILS ///////////////////////////
///////////////////////////////////////////////////////////////////////////

/**
 * @description - Accepts a domain url & an object of params and encodes the params & merges into the url.
 * @param {URL} baseURL - A string url, that's used as the "base".
 * @param {Object} params - An object of custom URL query params via { key: "name" } pairs.
 * @returns {String} - Returns the encoded url string w/ domain, query string and query params attached.
 * @example
 * const urlWithParams = generateURL('https://example.com', {
 * 	token: btoa('some-token'),
 * 	facilityID: btoa('some facility-id')
 * })
 */
const generateURL = (baseURL, params = {}) => {
	let url = baseURL;
	url += "?" + new URLSearchParams({ ...params });

	return url;
};
/**
 * @description - Extracts a target list of query params from a url and decodes them, if needed. Supports (base64 decoding)
 * @param {URL} url - Complete URL string including query params.
 * @param {Array} list - An array of strings; each representing a param variable to be extracted from a URL.
 * @example
 * - extractParams(urlWithParams, ['token', 'facilityID', 'residentID'])
 */
const extractParams = (url, list = []) => {
	if (isEmptyArray(list)) return {};
	const urlParams = new URL(url).searchParams;

	return list.reduce((params, key) => {
		if (!params[key]) {
			params[key] = isBase64(urlParams.get(key))
				? atob(urlParams.get(key))
				: urlParams.get(key);
			return params;
		}
		return params;
	}, {});
};

///////////////////////////////////////////////////////////////////////////
///////////////////////// REQUEST PARAMS BY TYPE /////////////////////////
///////////////////////////////////////////////////////////////////////////

/**
 * Default 'ADVANTAGE' database name.
 * - Contains: assessment data, tasks, adls, shifts, facility data etc.
 */
const dbAdvantage = {
	"db-meta": "Advantage",
};
/**
 * 'ALADVSYSTEM' system database name.
 * - Contains: system settings, file registry, DMS data, security data etc.
 */
const dbAdvSystem = {
	"db-meta": "ALADVSYSTEM",
};
/**
 * 'ALAWAREHOUSE' system database name.
 * - Contains: log data, user activity log etc.
 */
const dbAdvWarehouse = {
	"db-meta": "ALADVWAREHOUSE",
};

/**
 * @description - Request params object categorized by entity type (ie 'scheduledTasks', 'shifts' etc)
 * @example requestParams.unscheduledTask
 */
const requestParams = {
	// SCHEDULED TASK-RELATED
	scheduledTask: {
		...dbAdvantage,
		source: "AssessmentTrackingTask",
	},
	scheduledSubtask: {
		...dbAdvantage,
		source: "AssessmentTrackingTaskShiftSubTask",
	},
	scheduledNote: {
		...dbAdvantage,
		source: "AssessmentTrackingTaskNote",
	},
	scheduledShift: {
		...dbAdvantage,
		source: "AssessmentTrackingTaskShift",
	},
	// UNSCHEDULED TASK-RELATED
	unscheduledTask: {
		...dbAdvantage,
		source: "AssessmentUnscheduleTask",
	},
	unscheduledSubtask: {
		...dbAdvantage,
		source: "AssessmentUnscheduleTaskShiftSubTask",
	},
	unscheduledNote: {
		...dbAdvantage,
		source: "AssessmentUnscheduleTaskNote",
	},
	unscheduledShift: {
		...dbAdvantage,
		source: "AssessmentUnscheduleTaskShift",
	},
	// RESIDENT SHIFT SCHEDULE (BY ADL)
	adlSchedule: {
		...dbAdvantage,
		source: "AssessmentResidentAdlShift",
	},
	// FACILITY-RELATED
	facility: {
		...dbAdvantage,
		source: "FACILITY",
	},
	// GENERIC APIS W/ CUSTOM PARAMS //
	// COUNTS
	genericCount: {
		residents: {
			...dbAdvantage,
			source: "Residents",
		},
		scheduledTasks: {
			...dbAdvantage,
			source: "AssessmentTrackingTask",
		},
		unscheduledTasks: {
			...dbAdvantage,
			source: "AssessmentUnscheduleTask",
		},
		adls: {
			...dbAdvantage,
			source: "AssessmentCategory",
		},
	},
	// GENERIC GET2'S
	genericGet: {
		resident: {
			...dbAdvantage,
			source: "RESIDENTS",
		},
		residentDetails: {
			loa: {
				...dbAdvantage,
				source: "LEAVE_OF_ABSENCE",
			},
			incidents: {
				...dbAdvantage,
				source: "INCIDENT",
			},
			meds: {
				...dbAdvantage,
				source: "MEDICATIONS",
			},
			plans: {
				...dbAdvantage,
				source: "PLAN",
			},
			planDetails: {
				...dbAdvantage,
				source: "PLAN_DETAILS",
			},
			summary: {
				...dbAdvantage,
				source: "SUMMARY",
			},
			weights: {
				...dbAdvantage,
				source: "RESIDENT_WEIGHT",
			},
			vitals: {
				...dbAdvantage,
				source: "PLAN",
			},
		},
	},
};
// SCHEDULED TASK - RELATED
const {
	scheduledTask,
	scheduledSubtask,
	scheduledNote,
	scheduledShift,
} = requestParams;

// UNSCHEDULED TASK - RELATED
const {
	unscheduledTask,
	unscheduledSubtask,
	unscheduledNote,
	unscheduledShift,
} = requestParams;

// FACILITY RELATED
const { facility, adlSchedule } = requestParams;

const { genericCount, genericGet } = requestParams;

// SCHEDULED TASK - RELATED
export { scheduledTask, scheduledSubtask, scheduledNote, scheduledShift };

// UNSCHEDULED TASK - RELATED
export {
	unscheduledTask,
	unscheduledSubtask,
	unscheduledNote,
	unscheduledShift,
};

// GENERIC APIS
export { genericCount, genericGet };

export { facility, adlSchedule };

export { requestParams };

// database source names
export { dbAdvantage, dbAdvSystem, dbAdvWarehouse };

// url & params utils
export { generateURL, extractParams };
