import { isEmptyVal } from "./utils_types";
import { trimResidentName } from "./utils_residents";
import { getShiftIDsFromSettings } from "./utils_reports";
import { getShiftName } from "./utils_shifts";
import { format, startOfYear, endOfYear, getYear, subYears } from "date-fns";
import {
	getRangeFromMonth,
	getRangeFromQuarter,
	getRangeFromDate,
	getRangeFromLast30Days,
	getRangeFromLastQuarter,
} from "./utils_dates";

// getDateRange description - based off user selections
const getDateRangeDesc = (settings) => {
	switch (settings.dateRangeType) {
		case "Custom Range": {
			return `from ${settings.startDate} thru ${settings.endDate} `;
		}
		case "By Month": {
			return `for the month of ${settings.byMonth} `;
		}
		case "By Quarter": {
			return `for ${settings.byQuarter} `;
		}
		case "By Year": {
			return `for the ${settings.byYear} year, `;
		}
		case "By Date": {
			return `for ${settings.byDate} `;
		}
		case "Last 30 days": {
			return `for the last 30 days `;
		}
		case "Last year": {
			return `for the last year `;
		}
		case "Last quarter": {
			return `for the last quarter `;
		}
		case null:
		case "":
		case "Today": {
			return `for today `;
		}
		default:
			throw new Error("❌ Oops. Invalid 'dateRangeType' value.");
	}
};

// handles description of "report type"(ie report by resident, staff, etc.)
const getFilterByDesc = (settings) => {
	if (settings.reportType === `Daily`) return ``;
	switch (settings.filterBy) {
		case "Resident": {
			const { filterByResident } = settings;
			const name = trimResidentName(filterByResident);
			return `for ${name} `;
		}
		case "Facility": {
			const { filterByFacility } = settings;
			return `for ${filterByFacility}, `;
		}
		case "ADL": {
			const { filterByADL } = settings;
			return `for the ${filterByADL} category, `;
		}

		default:
			return;
	}
};

// handles formatting the "filterBy" value
const getSortByDesc = (vals) => {
	if (isEmptyVal(vals.sortBy)) return "";
	switch (vals.sortBy) {
		case "By Resident": {
			return `that's sorted by resident (${vals.sortByResident}).`;
		}
		case "By Room #": {
			return `that's filtered from room #${vals.filterByRoomNumStart} to room #${vals.filterByRoomNumEnd}.`;
		}
		case "By Staff": {
			return `that's sorted by staff/employee name (${vals.sortByStaff}).`;
		}
		case "By Unit Type":
		case "By Floor Unit": {
			const { sortByFloorUnit } = vals;
			return `that's sorted by ${sortByFloorUnit} unit type `;
		}
		case "By Shift": {
			const { sortByShift } = vals;
			return `that's sorted by the ${sortByShift} shift `;
		}
		case "By ADL": {
			const { sortByADL } = vals;
			return `that's sorted by ADL category in ${sortByADL.toLowerCase()} order `;
		}
		case "By Task Description": {
			const { sortByTaskDescription } = vals;
			return `that's sorted by the task description in ${sortByTaskDescription.toLowerCase()} order `;
		}
		case "By Is Past Due": {
			return `that's sorted by whether the task was 'PAST-DUE' or not `;
		}
		case "By TimeStamp": {
			return `that's sorted by the task timestamp: ${vals.sortByTimeStamp}`;
		}
		case "By Status": {
			return `that's sorted by ${vals.sortByStatus} status.`;
		}
		case "By Resolution": {
			return `that's sorted by the "${vals.sortByResolution}" resolution.`;
		}
		case "By Reason": {
			return `that's sorted by the task reason: ${vals.sortByReason}`;
		}
		default:
			return "";
	}
};

// handles shift selection(s) description
const getShiftDesc = (settings) => {
	const { shiftAM, shiftPM, shiftNOC } = settings;
	let desc = ``;
	const am = shiftAM ? "AM, " : "";
	const pm = shiftPM ? "PM, " : "";
	const noc = shiftNOC ? "NOC " : "";

	desc += am + pm + noc;
	desc += `shifts`;
	return desc;
};

// CLIENT-GENERATED REPORTS //
const getServicePlanDesc = (settings) => {
	let desc = `You've requested an Service Plan Report `;
	desc += getDateRangeDesc(settings);
	return desc;
};

// created task report desc
const getTaskCreatedDesc = (settings) => {
	let desc = `You've requested a Task Created Report `;
	desc += `${getFilterByDesc(settings)}`;
	desc += getDateRangeDesc(settings);
	return desc;
};

// actual time report desc
const getActualTimeDesc = (settings) => {
	let desc = `You've requested an Actual Time Report `;
	desc += getDateRangeDesc(settings);
	return desc;
};

// past due report desc
const getPastDueDesc = (settings) => {
	let desc = `You've requested an Past Due Report `;
	desc += `${getFilterByDesc(settings)} `;
	desc += getDateRangeDesc(settings);
	return desc;
};

// reassess report desc
const getReassessDesc = (settings) => {
	const { filterBy } = settings;
	let desc = `You've requested a Reassess Report `;

	switch (filterBy) {
		case "Resident": {
			const { filterByResident } = settings;
			desc += `for resident ${trimResidentName(filterByResident)} `;
			desc += `${getDateRangeDesc(settings)}`; // date range
			return desc;
		}
		case "Facility": {
			const { filterByFacility } = settings;
			desc += `for the facility (${filterByFacility}) `;
			desc += `${getDateRangeDesc(settings)}`; // date range
			return desc;
		}
		case "ADL": {
			const { filterByADL } = settings;
			desc += `for the ADL Category ${filterByADL}, `;
			desc += `${getDateRangeDesc(settings)}`;
			return desc;
		}
		case "User": {
			const { filterByUser } = settings;
			desc += `by user (${filterByUser}) `;
			desc += `${getDateRangeDesc(settings)}`; // date range
			return desc;
		}
		default:
			return "";
	}
};

// SERVER-GENERATED REPORTS //
const getCompletionDesc = (settings) => {
	let desc = `You've requested an Completion Report `;
	desc += getFilterByDesc(settings);
	desc += getDateRangeDesc(settings);
	desc += getSortByDesc(settings); // will return empty if no sortBy value exists
	return desc;
};

const getExceptionDesc = (settings) => {
	let desc = `You've requested an Exception Report `;
	desc += getFilterByDesc(settings);
	desc += getDateRangeDesc(settings);
	desc += getSortByDesc(settings); // will return empty if no sortBy value exists
	return desc;
};

// NEW DAILY REPORT DESCRIPTIONS //
const getDailyReportDesc = (settings, reportName) => {
	const shiftIDs = getShiftIDsFromSettings(settings);
	const shifts = shiftIDs.map((x) => getShiftName(x));
	let desc = `You've requested a Daily ${reportName} Report `;

	desc += `for today's `;
	desc += `${shifts.map((x) => `${x}`)} shift(s) `;

	return desc;
};

const getTaskStatusDesc = (settings) => {
	let desc = `You've requested an Task Status Report `;
	desc += getFilterByDesc(settings);
	desc += getDateRangeDesc(settings);
	desc += getSortByDesc(settings); // will return empty if no sortBy value exists
	return desc;
};

/**
 * @description - Description generator util that merges a user's selections into a human-readable description of the request report.
 * @param {Object} settings - User-selected values object (from the report picker).
 * @param {String} reportName - A report name (ie 'Completion Report', 'Reassess Report' etc).
 */
const getReportDesc = (settings, reportName) => {
	let desc = `You're requested a ${reportName} `;
	desc += `${getFilterByDesc(settings)}`;
	desc += `${getSortByDesc(settings)}`;
	desc += `${getDateRangeDesc(settings)}`;
	return desc;
};

const getReportDescByName = (settings, reportName) => {
	switch (reportName) {
		case `Completion Report`: {
			const desc = getCompletionDesc(settings);
			return desc;
		}
		case `Exception Report`: {
			const desc = getExceptionDesc(settings);
			return desc;
		}
		case `Task Created Report`: {
			const desc = getTaskCreatedDesc(settings);
			return desc;
		}
		case `Reassess Report`: {
			const desc = getReassessDesc(settings);
			return desc;
		}
		case `Task Status Report`: {
			const desc = getTaskStatusDesc(settings);
			return desc;
		}
		case `Service Plan Report`: {
			const desc = getServicePlanDesc(settings);
			return desc;
		}
		case `Past Due Report`: {
			const desc = getPastDueDesc(settings);
			return desc;
		}
		default:
			return "";
	}
};

const getReportDateRange = (settings) => {
	if (settings.reportType === `Daily`) {
		const date = format(new Date(), "M/D/YYYY");

		return { startDate: date, endDate: date };
	}
	switch (settings?.dateRangeType) {
		case "Today": {
			const { startDate, endDate } = settings;
			return {
				startDate: format(startDate, "M/D/YYYY"),
				endDate: format(endDate, "M/D/YYYY"),
			};
		}
		case "By Month": {
			const { byMonth } = settings;
			const { startDate, endDate } = getRangeFromMonth(byMonth);

			return {
				startDate,
				endDate,
			};
		}
		case "By Quarter": {
			const { byQuarter } = settings;
			const { startDate, endDate } = getRangeFromQuarter(byQuarter);
			return {
				startDate,
				endDate,
			};
		}
		case "By Year": {
			const { byYear } = settings;
			return {
				startDate: format(startOfYear(new Date(byYear, 1)), "M/DD/YYYY"),
				endDate: format(endOfYear(new Date(byYear, 1)), "M/DD/YYYY"),
			};
		}
		case "By Date": {
			const { startDate, endDate } = getRangeFromDate(settings.byDate);
			return {
				startDate,
				endDate,
			};
		}
		case "Last 30 days": {
			const { startDate, endDate } = getRangeFromLast30Days();
			return {
				startDate,
				endDate,
			};
		}
		case "Last year": {
			const curYr = getYear(new Date());
			const lastYr = subYears(new Date(curYr, 0, 1), 1);

			const startDate = startOfYear(lastYr);
			const endDate = endOfYear(lastYr);
			return {
				startDate,
				endDate,
			};
		}
		case "Last quarter": {
			const { startDate, endDate } = getRangeFromLastQuarter();
			return {
				startDate,
				endDate,
			};
		}

		default:
			return { startDate: "", endDate: "" };
	}
};

// FORMATS A REPORT DESCRIPTION FOR THE RECENTLY VIEWED CARD(S)
const formatReportDesc = (desc, fallbackMsg = "No description available") => {
	if (isEmptyVal(desc)) return fallbackMsg;
	const splitPoint = /(You've requested (a|an))\s/gm;
	const newDesc = desc.split(splitPoint)[3];
	return newDesc;
};

// REPORT DASHBOARD CARD DESCRIPTIONS //
const REPORT_DESCRIPTIONS = {
	"Exception Report": `Reports showing tasks marked with an Exception and the reason for the exception. \n\n Filters, sorting available.`,
	"Completion Report": `Reports showing all completed tasks.\n\n Filters, sorting available.`,
	"Task Status Report": `Reports showing all tasks by status matching specific criteria.\n\n Filters, sorting available.`,
	"Reassess Report": `Reports showing tasks that were marked for 'Reassessment' and why.\n\n Filters, sorting available.`,
	"Task Created Report": `Reports showing all created tasks, by whom, and why.\n\n Filters, sorting available.`,
	"Service Plan Report": `Historical record of a resident's service plans from a specific date range.`,
	"Past Due Report": `Reports showing all tasks currently PAST-DUE.\n\n Filters, sorting available.`,
	"Actual Time Report": `Historical report containing the "actual time" recorded for each task in a specific date range.\n\n Filters, sorting available.`,
};

export {
	getDateRangeDesc,
	getSortByDesc,
	getFilterByDesc,
	getShiftDesc,
	formatReportDesc,
};

export {
	getServicePlanDesc,
	getCompletionDesc,
	getTaskCreatedDesc,
	getActualTimeDesc,
	getReassessDesc,
	getPastDueDesc,
	getExceptionDesc,
	getTaskStatusDesc,
	getDailyReportDesc,
	// NEW REPORT DESC UTIL
	getReportDateRange,
	getReportDesc,
	getReportDescByName,
};

// REPORT DESCRIPTIONS FOR THE '<ReportsDashboard/>'
export { REPORT_DESCRIPTIONS };
