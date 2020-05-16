import { test } from "./utils_env";
import { format } from "date-fns";
import { reports } from "./utils_endpoints";
import { isEmptyVal, isEmptyObj } from "./utils_types";
import { trimResidentID, trimResidentName } from "./utils_residents";
import { getStatusID } from "./utils_status";
import { getShiftID } from "./utils_shifts";
import { getResolutionID } from "./utils_resolution";
import { getStartAndEndDates } from "./utils_dates";
import { ReportsCompletionModel, ReportsExceptionModel } from "./utils_models";

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
const getTaskCreatedReport = async (
	token,
	startDate = format(new Date(), "MM/DD/YYYY"),
	endDate = format(new Date(), "MM/DD/YYYY"),
	idType = "residentId",
	id
) => {
	let url = test.base + reports.getTaskCreatedReport;
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
		console.log("❌ Oops. Your 'getTaskCreatedReport' failed:", err);
		return err.message;
	}
};
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

		return response.Data;
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

/////////////////////////////////////
////////// REPORT HELPERS //////////
/////////////////////////////////////

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
			const residentID = trimResidentID(reportTypeValue);
			const { startDate, endDate } = getStartAndEndDates(settings);
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

// COMPLETION/EXCEPTION REPORT HELPERS //
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

/////////////////////////////////////////////
/////////// REPORT MODEL HELPERS ///////////
////////////////////////////////////////////

// creates the required report params, beyond, the "facilityID", and "date range(s)"
const createReportParams = (settings) => {
	switch (settings.filterBy) {
		// by shiftID - completion, exception
		case "By Shift": {
			const { filterByShift } = settings;
			return [{ Name: "ShiftID", Value: getShiftID(filterByShift) }];
		}
		// single roomNum value - completion, exception
		case "By Room #": {
			const { filterByRoomNumber } = settings;
			return [{ Name: "RoomNumber", Value: filterByRoomNumber }];
		}
		// by resolutionID - exception only
		case "By Resolution": {
			const { filterByResolution } = settings;
			return [
				{ Name: "ResolutionID", Value: getResolutionID(filterByResolution) },
			];
		}
		default:
			return;
	}
};

// generates the report sorting options for the reports model
const createReportSorts = (settings) => {
	switch (settings.sortBy) {
		case "By Shift": {
			const { sortByShift } = settings;
			const shiftID = getShiftID(sortByShift);
			return [{ Name: "ShiftID", Value: shiftID }];
		}
		case "By Resolution": {
			const { sortByResolution } = settings;
			const resolutionID = getResolutionID(sortByResolution);
			return [{ Name: "ResolutionID", Value: resolutionID }];
		}
		case "By Room #": {
			const { sortByRoomNum } = settings;
			return [{ Name: "RoomNumber", Value: sortByRoomNum }];
		}
		case "By Status": {
			const { sortByStatus } = settings;
			const statusID = getStatusID(sortByStatus);
			return [{ Name: "Status", Value: statusID }];
		}
		case "By Resident": {
			const { sortByResident } = settings;
			return [
				{ Name: "SortByResident", Value: true },
				{ Name: `Is${sortByResident}`, Value: true },
			];
		}
		case "By Staff": {
			const { sortByStaff } = settings;
			return [
				{ Name: "SortByStaff", Value: true },
				{ Name: `Is${sortByStaff}`, Value: true },
			];
		}
		case "By Reason": {
			return [{ Name: "SortByReason", Value: true }];
		}
		default:
			return [];
	}
};

// determines which model updater fn to invoke
const updateReportModel = (settings, facilityID, type = "CompletionReport") => {
	if (type === "CompletionReport") {
		// completion report
		return updateCompletionModel(settings, facilityID);
	} else {
		// exception report
		return updateExceptionModel(settings, facilityID);
	}
};

// ✅ COMPLETION MODEL - UPDATER FN
const updateCompletionModel = (settings, facilityID) => {
	const base = new ReportsCompletionModel();
	const { startDate, endDate } = getStartAndEndDates(settings);
	const params = createReportParams(settings);
	const sorts = createReportSorts(settings);
	// apply facilityID and date-range
	base.setFacilityID(facilityID);
	base.setStartAndEndDate(startDate, endDate);
	base.setParamsMany(params);
	base.setSortsMany(sorts);

	return base.getModel();
};
// ❌ EXCEPTION MODEL - UPDATER FN
const updateExceptionModel = (settings, facilityID) => {
	const base = new ReportsExceptionModel();
	const { startDate, endDate } = getStartAndEndDates(settings);
	const params = createReportParams(settings);
	const sorts = createReportSorts(settings);
	// apply facilityID and date-range
	base.setFacilityID(facilityID);
	base.setStartAndEndDate(startDate, endDate);
	base.setSortsMany(sorts);
	base.setParamsMany(params);

	return base.getModel();
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

const getReportType = (vals) => {
	if (isEmptyObj(vals)) return;
	if (isEmptyVal(vals.reportType)) return;
	return vals.reportType.replace(" ", "");
};

// REPORT REQUESTS //
export {
	executeReport,
	executeReportAsync,
	executeReportByType,
	getPastDueReport,
	getReassessReport,
	getReportInfo,
	getServicePlanReport,
	getTaskCreatedReport,
};

// REPORT DESCRIPTIONS //
export { getRangeDescription, getReportType };

// REPORT PROCESSING HELPERS //
export { getNonEmptyValues, trimResidentID, trimResidentName };

// REPORTS SELECTION HELPERS //
export { createReportParams, createReportSorts };

export { updateCompletionModel, updateExceptionModel, updateReportModel };
