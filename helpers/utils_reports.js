import { test } from "./utils_env";
import { reports } from "./utils_endpoints";
import { isEmptyVal, isEmptyObj } from "./utils_types";
import {
	trimResidentID,
	trimResidentName,
	getResidentID,
} from "./utils_residents";
import { getStartAndEndDates } from "./utils_dates";
import { isFileReady, getPDFSource } from "./utils_files";
import { ReportsModel } from "./utils_models";
import { getCategoryID } from "./utils_categories";
import { getFacilityID } from "./utils_facility";
import { format } from "date-fns";

/////////////////////////////////////////////
/////////// REPORT REQUEST HELPERS ///////////
/////////////////////////////////////////////

const getReportInfo = async (token, facilityID = null) => {
	let url = test.base + reports.getInfo;

	if (facilityID) url += "?facilityId=" + facilityID;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			}),
		});
		const response = await request.json();
		const reportData = response.Data;
		console.log(reportData);
		return reportData;
	} catch (err) {
		return console.log("An error occured: " + err);
	}
};

/**
 * @description - Fetches task created records.
 * @param {String} token - Auth token
 * @param {String} idType - A string-form id type (ie 'residentId', 'facilityId').
 * @param {String|Number} idVal - Corresponding value for 'idType'.
 * @param {Date} startDate - Starting date of range. Defaults to today.
 * @param {Date} endDate - Ending date of range. Defaults to today.
 */

const getPastDueReport = async (
	token,
	startDate = format(new Date(), "MM/DD/YYYY"),
	endDate = format(new Date(), "MM/DD/YYYY"),
	idType = "residentId",
	id
) => {
	let url = test.base + reports.getPastDueReport;
	url += "?" + new URLSearchParams({ startDate, endDate });
	url += "&" + new URLSearchParams({ [idType]: id });

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
		console.log("❌ Oops. Your 'getPastDueReport' failed:", err);
		return err.message;
	}
};
const getReassessReport = async (
	token,
	startDate = format(new Date(), "MM/DD/YYYY"),
	endDate = format(new Date(), "MM/DD/YYYY"),
	idType = "residentId",
	id
) => {
	let url = test.base + reports.getReassessReport;
	url += "?" + new URLSearchParams({ startDate, endDate });
	url += "&" + new URLSearchParams({ [idType]: id });

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
		console.log("❌ Oops. Your 'getReassessReport' failed:", err);
		return err.message;
	}
};
const getServicePlanReport = async (
	token,
	startDate = format(new Date(), "MM/DD/YYYY"),
	endDate = format(new Date(), "MM/DD/YYYY"),
	idType = "residentId",
	id
) => {
	let url = test.base + reports.getServicePlanReport;
	url += "?" + new URLSearchParams({ startDate, endDate });
	url += "&" + new URLSearchParams({ [idType]: id });

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
		console.log("❌ Oops. Your 'getServicePlanReport' failed:", err);
		return err.message;
	}
};
const executeReport = async (
	token,
	reportName,
	reportModel,
	reportType = "PDF"
) => {
	let url = test.base + reports.executeReport;

	if (!reportName)
		return console.log("executeReport - Error: No reportName provided");

	url += "?reportCode=" + reportName;
	url += "&reportType=" + reportType;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			}),
			body: JSON.stringify(reportModel),
		});
		const response = await request.json();
		console.log(response);

		return response.Data?.[0];
	} catch (err) {
		return console.log("An error occured: " + err);
	}
};
/**
 * @description A helper for requesting the needed url for mirroring a server-run report.
 * @param {string} token - A base64 encoded auth token.
 * @param {string} reportName - A custom report name (ie ExceptionReport, CompletionReport etc.)
 * @param {object} reportModel - A custom report object model.
 * @param {string} reportType - The "type" of file (ie PDF, EXCEL etc.)
 * @returns {Object} - Returns an HTTP custom response w/ a data URI to be used for report mirroring along w/ the file's registry record.
 */
const executeReportAsync = async (
	token,
	reportName,
	reportModel,
	reportType = "PDF"
) => {
	let url = test.base + reports.executeReportAsync;
	url += "?reportCode=" + reportName;
	url += "&reportType=" + reportType;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reportModel),
		});
		const response = await request.json();
		console.log("response", response);
		return response.Data;
	} catch (err) {
		return console.log("An error occured: " + err);
	}
};
/**
 * @description - Conditional request helper that determines the "type of request" based on selections.
 * @param {Object} settings - User-selected values object. (ie form values)
 * @param {Object} user - Current user object, includes token, username etc.
 * @param {Object} facility - Current facility data object.
 * @param {Function} fetchReport - The request function that fetches a report' data.
 */
const executeReportByType = async (settings, user, facility, fetchReport) => {
	const { token, userID } = user;
	switch (settings.reportType) {
		case "byResident": {
			const { reportTypeValue } = settings;
			const { startDate, endDate } = getStartAndEndDates(settings);
			const residentID = trimResidentID(reportTypeValue);
			return await fetchReport(
				token,
				startDate,
				endDate,
				"residentId",
				residentID
			);
		}
		case "byUser": {
			const { startDate, endDate } = getStartAndEndDates(settings);
			return await fetchReport(token, startDate, endDate, "userId", userID);
		}
		case "byFacility": {
			const { facilityID } = facility;
			const { startDate, endDate } = getStartAndEndDates(settings);
			return await fetchReport(
				token,
				startDate,
				endDate,
				"facilityId",
				facilityID
			);
		}
		default:
			return {
				Data: "PLEASE TRY AGAIN",
			};
	}
};

///////////////////////////////////////////////////////////////////////////
////////// ✅ NEW DAILY REPORT APIs - Updated 7/9/2020 @ 8:00 AM /////////
///////////////////////////////////////////////////////////////////////////

/**
 * @description - Fetches a day's completed tasks for a facility.
 * @param {String} token - Auth token (base64)
 * @param {String} facilityId - Facility uid, as a string.
 * @param {Date} startDate - Starting date of range.
 * @param {Date} endDate - Ending date of range
 * @param {Array} shiftIDs - An array of 'AssessmentShiftId's.
 * @param {Number} index - Starting row in database to request.
 * @param {Number} rows - Number of rows from database to request.
 * @returns {Array} - Returns an array of records, separated by resident, that need to be merged & processed/massaged.
 */
const getDailyCompletions = async (
	token,
	facilityId,
	shiftIDs = [],
	startDate = new Date(),
	endDate = new Date(),
	index = 0,
	rows = 25
) => {
	let url = test.base + reports.getDailyCompletions;
	url += "?" + new URLSearchParams({ facilityId });
	url +=
		"&" +
		new URLSearchParams({
			startDate: format(startDate, "MM/DD/YYYY"),
			endDate: format(endDate, "MM/DD/YYYY"),
		});
	url += "&" + new URLSearchParams({ index, rows });

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(shiftIDs),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("An error happened", err);
		return err.message;
	}
};
/**
 * @description - Fetches a day's exceptions for a facility.
 * @param {String} token - Auth token (base64)
 * @param {String} facilityId - Facility uid, as a string.
 * @param {Date} startDate - Starting date of range.
 * @param {Date} endDate - Ending date of range
 * @param {Array} shiftIDs - An array of 'AssessmentShiftId's.
 * @param {Number} index - Starting row in database to request.
 * @param {Number} rows - Number of rows from database to request.
 * @returns {Array} - Returns an array of records, separated by resident, that need to be merged & processed/massaged.
 */
const getDailyExceptions = async (
	token,
	facilityId,
	shiftIDs = [],
	startDate = new Date(),
	endDate = new Date(),
	index = 0,
	rows = 100
) => {
	let url = test.base + reports.getDailyExceptions;
	url += "?" + new URLSearchParams({ facilityId });
	url +=
		"&" +
		new URLSearchParams({
			startDate: format(startDate, "MM/DD/YYYY"),
			endDate: format(endDate, "MM/DD/YYYY"),
		});
	url += "&" + new URLSearchParams({ index, rows });

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(shiftIDs),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("An error happened", err);
		return err.message;
	}
};
/**
 * @description - Fetches a day's created tasks (ie unscheduled) for a facility.
 * @param {String} token - Auth token (base64)
 * @param {String} facilityId - Facility uid, as a string.
 * @param {Date} startDate - Starting date of range.
 * @param {Date} endDate - Ending date of range
 * @param {Array} shiftIDs - An array of 'AssessmentShiftId's.
 * @param {Number} index - Starting row in database to request.
 * @param {Number} rows - Number of rows from database to request.
 * @returns {Array} - Returns an array of records, separated by resident, that need to be merged & processed/massaged.
 */
const getDailyTaskCreated = async (
	token,
	facilityId,
	// shiftIDs = [],
	startDate = new Date(),
	endDate = new Date(),
	index = 0,
	rows = 25
) => {
	let url = test.base + reports.getDailyTaskCreatedReport;
	url += "?" + new URLSearchParams({ facilityId });
	url += "&" + new URLSearchParams({ startDate, endDate });
	url += "&" + new URLSearchParams({ index, rows });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			// body: JSON.stringify(shiftIDs), // NOT ADDED YET???
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("An error happened", err);
		return err.message;
	}
};
/**
 * @description - Fetches a day's tasks that were marked for 'reassessment', for a given facility.
 * @param {String} token - Auth token (base64)
 * @param {String} facilityId - Facility uid, as a string.
 * @param {Date} startDate - Starting date of range.
 * @param {Date} endDate - Ending date of range
 * @param {Array} shiftIDs - An array of 'AssessmentShiftId's.
 * @param {Number} index - Starting row in database to request.
 * @param {Number} rows - Number of rows from database to request.
 * @returns {Array} - Returns an array of records, separated by resident, that need to be merged & processed/massaged.
 */
const getDailyReassess = async (
	token,
	idVal,
	idType = `facilityId`,
	startDate = new Date(),
	endDate = new Date(),
	index = 0,
	rows = 25
) => {
	let url = test.base + reports.getDailyReassessReport;
	url += "?" + new URLSearchParams({ [idType]: idVal });
	url +=
		"&" +
		new URLSearchParams({
			startDate: format(startDate, "MM/DD/YYYY"),
			endDate: format(endDate, "MM/DD/YYYY"),
		});
	url += "&" + new URLSearchParams({ index, rows });

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
		console.log("An error happened", err);
		return err.message;
	}
};
/**
 * @description - Fetches a day's service plan for a given resident.
 * @param {String} token - Auth token (base64)
 * @param {String} facilityId - Facility uid, as a string.
 * @param {Date} startDate - Starting date of range.
 * @param {Date} endDate - Ending date of range
 * @param {Array} shiftIDs - An array of 'AssessmentShiftId's.
 * @param {Number} index - Starting row in database to request.
 * @param {Number} rows - Number of rows from database to request.
 * @returns {Array} - Returns an array of records, separated by resident, that need to be merged & processed/massaged.
 */
const getDailyServicePlan = async (
	token,
	facilityId,
	startDate = new Date(),
	endDate = new Date(),
	index = 0,
	rows = 25
) => {
	let url = test.base + reports.getDailyServicePlanReport;
	url += "?" + new URLSearchParams({ facilityId });
	url +=
		"&" +
		new URLSearchParams({
			startDate: format(startDate, "MM/DD/YYYY"),
			endDate: format(endDate, "MM/DD/YYYY"),
		});
	url += "&" + new URLSearchParams({ index, rows });

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
		console.log("An error happened", err);
		return err.message;
	}
};
/**
 * @description - Fetches the past due tasks for a given range for a resident.
 * @param {String} token - Auth token.
 * @param {Number} residentId - Number uid for a resident.
 * @param {Date} startDate - Starting date of range.
 * @param {Date} endDate - Ending date of range.
 * @param {Number} index - Starting row in database's table.
 * @param {Number} rows - Number of rows to grab from database's table.
 * @returns {Array} - Returns an array of custom data structures including: "Resident", "PastDueScheduleTask", "PastDueUnscheduleTask"
 */
const getDailyPastDueByResident = async (
	token,
	residentId,
	startDate = new Date(),
	endDate = new Date(),
	index = 0,
	rows = 25
) => {
	let url = test.base + reports.getPastDueReportByResident;
	url += "?" + new URLSearchParams({ residentId });
	url +=
		"&" +
		new URLSearchParams({
			startDate: format(startDate, "MM/DD/YYYY"),
			endDate: format(endDate, "MM/DD/YYYY"),
		});
	url += "&" + new URLSearchParams({ index, rows });

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
		console.log("An error happened", err);
		return err.message;
	}
};
/**
 * @description - Fetches the past due tasks for a given range for a facility.
 * @param {String} token - Auth token.
 * @param {String} facilityId - String uid for a resident.
 * @param {Date} startDate - Starting date of range.
 * @param {Date} endDate - Ending date of range.
 * @param {Number} index - Starting row in database's table.
 * @param {Number} rows - Number of rows to grab from database's table.
 * @returns {Array} - Returns an array of custom data structures including: "Resident", "PastDueScheduleTask", "PastDueUnscheduleTask"
 */
const getDailyPastDueByFacility = async (
	token,
	facilityId,
	startDate = new Date(),
	endDate = new Date(),
	index = 0,
	rows = 25
) => {
	let url = test.base + reports.getPastDueReportByFacility;
	url += "?" + new URLSearchParams({ facilityId });
	url +=
		"&" +
		new URLSearchParams({
			startDate: format(startDate, "MM/DD/YYYY"),
			endDate: format(endDate, "MM/DD/YYYY"),
		});
	url += "&" + new URLSearchParams({ index, rows });

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
		console.log("An error happened", err);
		return err.message;
	}
};

///////////////////////////////////////////////////////////////////////////
/////// ✅ NEW HISTORICAL REPORT APIs - Updated 7/9/2020 @ 8:00 AM ///////
///////////////////////////////////////////////////////////////////////////

const getHistoricalCompletions = async (token, reportModel) => {
	const reportFile = await executeReport(
		token,
		"HistoricalCompletionReport",
		reportModel,
		"PDF"
	);
	console.log(`File:\n\n`, reportFile);
	if (isFileReady(reportFile)) {
		return reportFile;
	} else {
		console.log(`❌ Ooops! Report failed:`, reportFile);
		return reportFile;
	}
};
const getHistoricalExceptions = async (token, reportModel) => {
	const reportFile = await executeReport(
		token,
		"HistoricalExceptionReport",
		reportModel,
		"PDF"
	);
	console.log(`File:\n\n`, reportFile);
	if (isFileReady(reportFile)) {
		return reportFile;
	} else {
		console.log(`❌ Ooops! Report failed:`, reportFile);
		return reportFile;
	}
};
/**
 * @description - Request helper for fetching 'TaskCreatedReport' of historical range.
 * @param {String} token - Auth token.
 * @param {Object} params - Query params object.
 * - "params.facilityId": selected facilityId (optional)
 * - "params.residentId": selected residentId (optional)
 * - "params.userId": selected userId (optional). Not supported by ALA team.
 * - "params.startDate": formatted start date of range ('MM/DD/YYYY') (required)
 * - "params.endDate": formatted end date of range ('MM/DD/YYYY') (required)
 * - "params.index": starting row in table
 * - "params.rows": number of rows from table to fetch.
 * @returns {Array} - Returns array in a custom formatted data structure, or returns 'false', if empty data.
 */
const getHistoricalTaskCreated = async (token, params = {}) => {
	let url = test.base + reports.getHistoricalTaskCreated;
	url += "?" + new URLSearchParams({ ...params });

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
		console.log("An error happened", err);
		return err.message;
	}
};
const getHistoricalReassess = async (token, params = {}) => {
	let url = test.base + reports.getHistoricalReassess;
	url += "?" + new URLSearchParams({ ...params });

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
		console.log(`✅ Success! Report data found.`);
		return response.Data;
	} catch (err) {
		console.log(`❌ Oops!An error happened:`, err);
		return err.message;
	}
};
const getHistoricalPastDue = async (token, reportModel) => {
	let url = test.base + reports;
	url += "?" + new URLSearchParams({});

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reportModel),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("An error happened", err);
		return err.message;
	}
};
// returns PDF dataURL
const getHistoricalTaskStatus = async (token, reportModel) => {
	const reportFile = await executeReport(
		token,
		"HistoricalTaskStatusReport",
		reportModel,
		"PDF"
	);

	if (isFileReady(reportFile)) {
		const { FileRegistryID } = reportFile;
		console.log(`✅ Success! Fetching PDF...`);
		return getPDFSource(token, FileRegistryID);
	} else {
		console.log(`❌ Ooops! Report failed:`, reportFile);
		return reportFile;
	}
};
// just a wrapper
const getHistoricalServicePlan = async (
	token,
	idType = "residentId",
	idVal,
	startDate = new Date(),
	endDate = new Date()
) => {
	let url = test.base + reports.getDailyServicePlanReport;
	url += "?" + new URLSearchParams({ [idType]: idVal });
	url +=
		"&" +
		new URLSearchParams({
			startDate: format(startDate, "MM/DD/YYYY"),
			endDate: format(endDate, "MM/DD/YYYY"),
		});

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
		console.log("An error happened", err);
		return err.message;
	}
};
// 'byType' = 'residentId', 'facilityId'
const getServicePlanByType = async (token, settings, facilities = []) => {
	const { startDate, endDate } = getStartAndEndDates(settings);

	switch (settings?.filterBy) {
		case "Resident": {
			const { filterByResident } = settings;
			const residentId = getResidentID(filterByResident);

			return await getHistoricalServicePlan(
				token,
				"residentId",
				residentId,
				startDate,
				endDate
			);
		}
		case "Facility": {
			const { filterByFacility } = settings;
			const facilityID = getFacilityID(filterByFacility, facilities);

			return await getHistoricalServicePlan(
				token,
				"facilityId",
				facilityID,
				startDate,
				endDate
			);
		}
		default:
			return alert(`Invalid Report Type!`);
	}
};

/////////////////////////////////////////////////////////////////////////
//////////////////////////// REPORT HELPERS ////////////////////////////
/////////////////////////////////////////////////////////////////////////

// MISC REPORT HELPERS //

// "sanitizes" a object, by removing ALL empty values
// "empty" === (undefined|null|"")
const getNonEmptyValues = (values) => {
	const keys = Object.keys(values);
	const vals = Object.values(values);
	return vals.reduce((all, val, idx) => {
		if (!isEmptyVal(val)) {
			return {
				...all,
				[keys[idx]]: val,
			};
		}
		return all;
	});
};

// handles formatting the "dateRangeType" value
const getRangeDescription = (vals) => {
	switch (vals.reportRangeType) {
		case "Last 30 days": {
			return ` for the last 30 days `;
		}
		case "By Month": {
			return ` for ${vals.byMonth} `;
		}
		case "By Quarter": {
			return ` for ${vals.byQuarter} `;
		}
		case "By Year": {
			return ` for the year of ${vals.byYear}`;
		}
		case "By Date": {
			return ` for ${vals.byDate} `;
		}
		case "Custom Range": {
			return ` for ${vals.startDate} to ${vals.endDate} `;
		}
		case "Last year": {
			return ` for ${vals.lastYear}`;
		}
		case "Last quarter": {
			return ` for ${vals.lastQuarter}`;
		}
		case "Today": {
			return ` for today (${format(new Date(), "MM/DD/YYYY")})`;
		}
		default:
			throw new Error("❌ Oops. Invalid 'reportRangeType' value.");
	}
};
//////////////////////////////////////////////////////////////////////
//////////////////// NEW REPORT SETTINGS HELPERS ////////////////////
//////////////////////////////////////////////////////////////////////

// removes whitespace from reportType (ie "Exception Report" => "ExceptionReport")
// 'reportType' is required for "executeReport"
const getReportType = (vals) => {
	if (isEmptyObj(vals)) return;
	if (isEmptyVal(vals.reportType)) return;
	return vals.reportType.replace(" ", "");
};

// extracts user-selected shifts from the settings object and formats into an array for the POST body
const getShiftIDsFromSettings = (settings) => {
	const { shiftAM, shiftPM, shiftNOC } = settings;
	const am = shiftAM ? 1 : null;
	const pm = shiftPM ? 2 : null;
	const noc = shiftNOC ? 3 : null;

	const ids = [am, pm, noc];
	return ids.filter((id) => Boolean(id));
};

// translates the string form order ('Ascending', 'Descending' or 'None') into
// it's corresponding numeric id (ie 1, 2, 0)
const getSortOrder = (sortType) => {
	switch (sortType) {
		case "Ascending":
			return 1;
		case "Descending":
			return 2;
		case "None":
			return 0;
		default:
			return 0;
	}
};

const createReportModel = (settings, facilityID, facilities = []) => {
	const { startDate, endDate } = getStartAndEndDates(settings);
	const shifts = getShiftParams(settings);

	const base = new ReportsModel();
	base.setStartAndEndDate(startDate, endDate);
	base.setParam(createFilterByParams(settings, facilities));
	base.setParam(createReportSortParams(settings));
	base.setParamsMany(shifts);
	base.setFacilityID(facilityID); // if a 'facilityID' exists (like 'Filter By Facility'), it won't overwrite it.

	return base.getModel();
};

// handles the options for the main dataset
const createFilterByParams = (settings, facilities = []) => {
	switch (settings.filterBy) {
		case "Resident": {
			const { filterByResident } = settings;
			const id = getResidentID(filterByResident);
			return { Name: "ResidentID", Value: id };
		}
		case "Facility": {
			const { filterByFacility } = settings;
			const facilityID = getFacilityID(filterByFacility, facilities);
			return { Name: "FacilityID", Value: facilityID };
		}
		case "ADL": {
			const { filterByADL } = settings;
			return {
				Name: "AssessmentCategoryId",
				Value: getCategoryID(filterByADL),
			};
		}
		default:
			throw new Error(`❌ Oops! Invalid 'filterBy' value:`, settings.filterBy);
	}
};

const createReportSortParams = (settings) => {
	switch (settings.sortBy) {
		case "By Resident": {
			const { sortByResident } = settings;
			return { Name: "SortByResident", Value: getSortOrder(sortByResident) };
		}
		case "By Completed Date": {
			const { sortCompletedDate } = settings;
			return {
				Name: "SortByCompletedDate",
				Value: getSortOrder(sortCompletedDate),
			};
		}
		case "By Completed Shift": {
			const { sortByCompletedShift } = settings;
			return {
				Name: "SortByCompletedShift",
				Value: getSortOrder(sortByCompletedShift),
			};
		}
		case "By Exception Type":
		case "By Exception": {
			const { sortByException } = settings;
			return {
				Name: "SortByException",
				Value: getSortOrder(sortByException),
			};
		}
		case "By Notes": {
			const { sortByNotes } = settings;
			return { Name: "SortByNotes", Value: getSortOrder(sortByNotes) };
		}
		case "By Room #": {
			const { sortByRoomNum } = settings;
			return { Name: "SortByRoomNumber", Value: getSortOrder(sortByRoomNum) };
		}
		case "By Staff": {
			const { sortByStaff } = settings;
			return { Name: "SortByStaff", Value: getSortOrder(sortByStaff) };
		}
		case "By Task Description": {
			const { sortByTaskDescription } = settings;
			return {
				Name: "SortByTaskDescription",
				Value: getSortOrder(sortByTaskDescription),
			};
		}
		case "By Floor Unit":
		case "By Unit Type": {
			const { sortByUnitType } = settings;
			return { Name: "SortByUnitType", Value: getSortOrder(sortByUnitType) };
		}
		case "By ADL": {
			const { sortByADL } = settings;
			return { Name: "SortByAdl", Value: getSortOrder(sortByADL) };
		}
		case "By Shift": {
			return { Name: "SortByShift", Value: 1 };
		}
		default:
			throw new Error(`❌ Invalid 'sortBy' value:`, settings.sortBy);
	}
};
// creates shift model params: {Name: 'ShiftXX', Value: true|false}
const getShiftParams = (settings) => {
	const { shiftAM, shiftPM, shiftNOC } = settings;
	const am = { Name: "ShiftAM", Value: shiftAM };
	const pm = { Name: "ShiftPM", Value: shiftPM };
	const noc = { Name: "ShiftNOC", Value: shiftNOC };
	return [am, pm, noc];
};

// CLIENT-SIDE REPORT HELPERS //
const getClientSideReport = async (
	token,
	settings,
	facilities = [],
	fetchReport
) => {
	if (isEmptyVal(settings.filterBy)) return [];
	switch (settings.filterBy) {
		case "Resident": {
			const { filterByResident } = settings;
			const residentId = getResidentID(filterByResident);
			const { startDate, endDate } = getStartAndEndDates(settings);

			return await fetchReport(token, {
				residentId,
				startDate,
				endDate,
			});
		}
		case "Facility": {
			const { filterByFacility } = settings;
			const facilityId = getFacilityID(filterByFacility, facilities);
			const { startDate, endDate } = getStartAndEndDates(settings);
			return await fetchReport(token, {
				facilityId,
				startDate,
				endDate,
			});
		}
		case "ADL": {
			const { filterByADL } = settings;
			const AssessmentCategoryId = getCategoryID(filterByADL);
			const { startDate, endDate } = getStartAndEndDates(settings);
			return await fetchReport(token, {
				AssessmentCategoryId,
				startDate,
				endDate,
			});
		}
		// DEPRECATED FILTER TYPE
		case "User": {
			return;
		}

		default:
			throw new Error(`❌ Oops! Invalid 'filterBy' type:`, settings.filterBy);
	}
};

///////////////////////////////////////////////////////////////////////////////////
///////////////////////// DEPRECATED REPORT MODEL HELPERS /////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// REPORT REQUESTS //
export {
	executeReport,
	executeReportAsync,
	executeReportByType,
	getPastDueReport,
	getReassessReport,
	getReportInfo,
	getServicePlanReport,
	// NEW DAILY REPORT APIs
	getDailyCompletions,
	getDailyExceptions,
	getDailyTaskCreated,
	getDailyReassess,
	getDailyServicePlan,
	getDailyPastDueByFacility,
	getDailyPastDueByResident,
	// NEW HISTORICAL REPORT APIs
	getHistoricalCompletions,
	getHistoricalExceptions,
	getHistoricalPastDue,
	getHistoricalReassess,
	getHistoricalServicePlan,
	getHistoricalTaskStatus,
	// HISTORICAL CLIENT-SIDE REPORTS
	getHistoricalTaskCreated,
	getClientSideReport,
	getServicePlanByType,
};

// REPORT DESCRIPTIONS //
export { getRangeDescription, getReportType, getShiftIDsFromSettings };

// REPORT PROCESSING HELPERS //
export { getNonEmptyValues, trimResidentID, trimResidentName };

// REPORTS SELECTION HELPERS //
export { getShiftParams, createReportModel };
