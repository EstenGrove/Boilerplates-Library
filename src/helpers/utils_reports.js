import { test } from "./utils_env";
import { reports } from "./utils_endpoints";

/////////////////////////////////////////////
////////// REPORTS REQUEST HELPERS //////////
/////////////////////////////////////////////

const getReportInfo = async (token, facilityID = null) => {
	let url = test.base + reports.getInfo;

	if (facilityID) url += "?facilityId=" + facilityID;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token
			})
		});
		const response = await request.json();
		const reportData = response.Data;
		console.log(reportData);
		return reportData;
	} catch (err) {
		return console.log("An error occured: " + err);
	}
};

// execute a report server side - THIS DOES NOT DOWNLOAD OR MIRROR THE REPORT - IT ONLY RUNS THE REPORT
/**
 * @description - Requests a report be run server-side while providing a series of criteria such as report type, date range, facilityID (if applicable) and any sorting criteria, like "by resident", "by status" etc. NOTE: THIS DOES NOT DOWNLOAD A REPORT FILE, ONLY TRIGGER RUNNING A REPORT ON THE SERVER.
 * @param {string} token - A base64 encode auth token.
 * @param {string} reportName - The report name(ie reportCode) (returned from fetching data from the getReportInfo API)
 * @param {object} reportModel - A "params-like" object containing params, and sorting criteria for running a report. (USE THE "ReportsModel" FOUND IN THE "utils_models.js" file)
 * @param {string} reportType - The report form (ie SSRS, PDF, etc) as a string.
 */
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
				"Content-Type": "application/json"
			}),
			body: JSON.stringify(reportModel)
		});
		const response = await request.json();
		return response;
	} catch (err) {
		console.log(`❌ Oops. Your executeReport request failed: ` + err.message);
		return err.message;
	}
};

/**
 * @description A helper for requesting the needed url for mirroring a server-run report.
 * @param {string} token - A base64 encoded auth token.
 * @param {string} reportName - A custom report name (ie ExceptionReport, CompletionReport etc.)
 * @param {object} reportModel - A custom report object model.
 * @param {string} reportType - The "type" of file (ie PDF, EXCEL etc.)
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
				"Content-Type": "application/json"
			},
			body: JSON.stringify(reportModel)
		});
		const response = await request.json();
		console.log("response", response);
		return response.Data;
	} catch (err) {
		return console.log("An error occured: " + err);
	}
};

/////////////////////////////////////////////
/////////// MISC REPORTS HELPERS ///////////
/////////////////////////////////////////////

const constructReportURL = (token, urlPath) => {
	let url = test.base + urlPath;
	url += "?securityToken=" + token;
	return url;
};
