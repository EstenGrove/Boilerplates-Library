import { isEmptyVal, isEmptyArray, hasProp } from "./utils_types";
import { format } from "date-fns";
import { formatResidentNameLast } from "./utils_residents";
import { formatUserNameLast, formatUserNameLastSvcPlan } from "./utils_user";
import { getExceptionTypeFromID } from "./utils_exceptions";
import { getCategoryID } from "./utils_categories";
import { getRecurringTypeFromID } from "./utils_repeatingTasks";
import { utcToLocal } from "./utils_dates";

// ##TODOS:
// - Convert ALL dates from UTC to local time using 'convertUTCToLocal(utc, anchor)'
// 		- Update table processors for ALL 'Daily' report types.

// ##TODOS:
// - 'Exception Time' timestamp is NOT UTC
// 		- This is likely due to not converting it when sending to the server

// Processing Helpers for row data utils //
const getCompletedTime = (task) => {
	const completedDate = task?.CompletedDate ?? task?.TrackDate ?? task.TaskDate;
	const localTime = utcToLocal(completedDate);

	return format(localTime, "h:mm A");
};
const getExceptionTime = (task) => {
	const { ExceptionDate } = task;
	const localTime = utcToLocal(ExceptionDate);

	return `${format(localTime, "h:mm A")}`;
};
const getException = (task, facilityExceptions = []) => {
	const { AssessmentExceptionId: id, Exception } = task;
	if (isEmptyVal(Exception)) {
		return getExceptionTypeFromID(id, facilityExceptions);
	} else {
		return Exception.split(/(?=[A-Z])/).join(" ");
	}
};
const getWasCompleted = (task) => {
	const { IsCompleted } = task;
	const confirm = `Yes`;
	const deny = `No`;

	if (IsCompleted) {
		return confirm;
	} else {
		return deny;
	}
};
const getTaskADL = (task) => {
	return task?.ADLCategory ?? getCategoryID(task.AssessmentCategoryId);
};
const getTaskDesc = (task, maxLength = 30) => {
	const desc = task?.TaskDescription ?? task?.TaskName ?? task?.TaskNotes;
	if (desc?.length < maxLength) return desc;
	return desc?.slice(0, maxLength);
};
const getRecurring = (task) => {
	const { AssessmentRecurringId: recurringID } = task;
	if (isEmptyVal(recurringID)) return "No Repeat";
	return getRecurringTypeFromID(recurringID);
};
const getReassessCause = (record) => {
	const notes = record?.TaskNotes ?? record?.TaskName;
	const reason = isEmptyVal(notes) ? `No description` : notes;
	return reason;
};
const getReassessDesc = (record) => {
	const desc = record?.TaskName ?? record?.TaskNotes;
	return desc;
};

// extracts, formats and returns the required fields from a resident record's tasks
const extractCompletionRowsFromTasks = (residentTasks = [], residentInfo) => {
	return residentTasks.reduce((rowData, task) => {
		// create new row, w/ column names as keys

		const newRow = {
			Resident: formatResidentNameLast(residentInfo),
			"Room #": residentInfo.RoomNum,
			ADL: task.ADLCategory,
			Task: getTaskDesc(task),
			Shift: task.Shift,
			"Completed By": formatUserNameLast(task),
			"Completed Time": getCompletedTime(task),
		};

		rowData.push({ ...newRow });
		return rowData;
	}, []);
};

// ##TODOS:
// - Add 'Was Completed?' column to exception report processors

/**
 * Cols:
 * - 'Resident'
 * - 'Room #'
 * - 'ADL'
 * - 'Task'
 * - 'Exception'
 * - 'Shift'
 * - 'Exception Time'
 */
// extracts, formats and returns the required fields from a resident record's tasks
const extractExceptionRowsFromTasks = (
	residentTasks = [],
	residentInfo,
	facilityExceptions = []
) => {
	return residentTasks.reduce((rowData, task) => {
		// create new row, w/ column names as keys

		const newRow = {
			Resident: formatResidentNameLast(residentInfo),
			"Room #": residentInfo.RoomNum,
			ADL: getTaskADL(task),
			Task: getTaskDesc(task),
			Shift: task.Shift,
			Exception: getException(task, facilityExceptions),
			"Exception Time": getExceptionTime(task),
			"Was Completed?": getWasCompleted(task),
		};

		rowData.push({ ...newRow });
		return rowData;
	}, []);
};

// inject a 'ResidentId' into each task record for the 'DailyCompletionReport' data
const injectResidentInfo = (tasks, residentInfo) => {
	return tasks.map((task) => {
		if (hasProp(task, "ResidentId") || hasProp(task, "ResidentID")) {
			return {
				...task,
				ResidentFirstName: residentInfo.ResidentFirstName,
				ResidentLastName: residentInfo.ResidentLastName,
				ResidentId: residentInfo.ResidentId,
			};
		} else {
			return {
				...task,
				ResidentFirstName: residentInfo.ResidentFirstName,
				ResidentLastName: residentInfo.ResidentLastName,
				ResidentId: residentInfo.ResidentId,
			};
		}
	});
};

// adds resident info to each data record & merges task by task type (scheduled & unscheduled)
const mergeResidentTasks = (reportData) => {
	return reportData.reduce(
		(mergedTasks, record) => {
			const {
				Resident,
				CompletedScheduleTasks: scheduled,
				CompletedUnscheduleTasks: unscheduled,
			} = record;
			const [resident] = Resident;
			const { ResidentId } = resident;

			const scheduledWithID = injectResidentInfo(scheduled, {
				ResidentFirstName: resident.FirstName,
				ResidentLastName: resident.FirstName,
				ResidentId: ResidentId,
			});
			const unscheduledWithID = injectResidentInfo(unscheduled, {
				ResidentFirstName: resident.FirstName,
				ResidentLastName: resident.LastName,
				ResidentId: ResidentId,
			});

			const { scheduledTasks, unscheduledTasks } = mergedTasks;

			return {
				scheduledTasks: [...scheduledTasks, ...scheduledWithID],
				unscheduledTasks: [...unscheduledTasks, ...unscheduledWithID],
			};
		},
		{
			scheduledTasks: [],
			unscheduledTasks: [],
		}
	);
};

////////////////////////////////////////////////////////////
/////////////// REPORT ROW PROCESSING UTILS ///////////////
////////////////////////////////////////////////////////////

/**
 * Processes the raw report data for 'DailyCompletionReport' by facility.
 * - Columns: 'Resident', 'Room #', 'ADL', 'Task', 'Completed By', 'Shift', 'Completed Time'
 */
const getCompletionReportRows = (reportData) => {
	if (isEmptyArray(reportData)) return [];
	return reportData.reduce((tableData, reportRecord) => {
		const {
			Resident,
			CompletedScheduleTasks: scheduled,
			CompletedUnscheduleTasks: unscheduled,
		} = reportRecord;
		const [resident] = Resident;

		const newRow = extractCompletionRowsFromTasks(
			[...scheduled, ...unscheduled],
			resident
		);

		return [...tableData, ...newRow];
	}, []);
};

/**
 * Processes the custom 'DailyExceptionReport' API data into table-readable data.
 */
const getExceptionReportRows = (rawData = [], facilityExceptions = []) => {
	if (isEmptyArray(rawData)) return [];
	return rawData.reduce((tableData, rawRecord) => {
		const {
			Resident,
			ExceptionScheduleTasks: scheduled,
			ExceptionUnscheduleTasks: unscheduled,
		} = rawRecord;
		const [resident] = Resident;

		const newRow = extractExceptionRowsFromTasks(
			[...scheduled, ...unscheduled],
			resident,
			facilityExceptions
		);

		return [...tableData, ...newRow];
	}, []);
};
/**
 * Processes the custom 'DailyTaskCreatedReport' API data into table-readable data.
 * Table Data:
 * - Columns: 'Resident', 'Task', 'ADL', 'Unit Type', 'Created Date', 'Created By'
 */
const getTaskCreatedRows = (rawData = []) => {
	if (isEmptyArray(rawData)) return [];

	return rawData.reduce((tableData, record) => {
		const { Resident, User } = record;
		const localTime = utcToLocal(record?.DateCreated);

		const row = {
			Resident: formatResidentNameLast(Resident),
			ADL: record?.ADLCategory,
			Task: getTaskDesc(record),
			"Recurring Type:": getRecurring(record),
			"Created By": formatUserNameLast(User),
			"Created Date": format(localTime, "MM/DD/YYYY h:mm A"),
			"Unit Type": Resident?.FloorUnit,
		};

		tableData.push({ ...row });
		return tableData;
	}, []);
};
/**
 * Processes the custom 'DailyServicePlanReport' API data into table-readable data.
 * Table Data:
 * - columns: 'Resident', 'Need/Problem', 'Person(s) Responsible', 'DateCreated', 'Created By', 'Unit Type'
 */
const getServicePlanRows = (rawData = []) => {
	if (isEmptyArray(rawData)) return [];
	return rawData.reduce((tableData, record) => {
		const { Resident } = record;
		const localTime = utcToLocal(record?.DateUpdated);

		const row = {
			Resident: formatResidentNameLast(Resident),
			"Need/Problem": record?.ResidentTask,
			"Person(s) Responsible": formatUserNameLastSvcPlan(record),
			"Date Updated": format(localTime, "M/D/YY h:mm A"),
			"Updated By": formatUserNameLastSvcPlan(record),
			"Unit Type": Resident?.FloorUnit,
		};

		tableData.push({ ...row });
		return tableData;
	}, []);
};
/**
 * Processes the custom 'DailyReassessReport' API data into table-readable data.
 * Table Data:
 * - columns: 'Resident', 'Task', 'ADL', 'Reason for Reassess', 'Reassess Date', Reassess By'
 */
const getReassessRows = (rawData = []) => {
	if (isEmptyArray(rawData)) return [];
	return rawData.reduce((tableData, record) => {
		const { Resident, User } = record;
		const localTime = utcToLocal(record?.DateCreated);

		const row = {
			Resident: formatResidentNameLast(Resident),
			Task: getReassessDesc(record),
			ADL: record.ADLCategory,
			"Reason for Reassess": getReassessCause(record),
			"Reassess Date": format(localTime, "M/D/YY h:mm A"),
			"Reassess By": formatUserNameLast(User),
		};

		tableData.push({ ...row });
		return tableData;
	}, []);
};

/////////////////////////////////////////////////////////////////
///////////////////////// TABLE COLUMNS /////////////////////////
/////////////////////////////////////////////////////////////////

const completionCols = [
	`Resident`,
	`Room #`,
	`ADL`,
	`Task`,
	`Shift`,
	`Completed By`,
	`Completed Time`,
];
const exceptionCols = [
	`Resident`,
	`Room #`,
	`ADL`,
	`Task`,
	`Shift`,
	`Exception`,
	`Exception Time`,
	`Was Completed?`,
];
const taskCreatedCols = [
	`Resident`,
	`ADL`,
	`Task`,
	`Recurring Type`,
	`Created By`,
	`Created Date`,
	`Unit Type`,
];
const reassessCols = [
	`Resident`,
	`Task`,
	`ADL`,
	`Reason for Reassess`,
	`Reassess Date`,
	`Reassessed By`,
];
const servicePlanCols = [
	`Resident`,
	`Need/Problem`,
	`Person(s) Responsible`,
	`Date Updated`,
	`Updated By`,
	`Unit Type`,
];

/////////////////////////////////////////////////////////////////
//////// TABLE SORTING: 'Date', 'String', 'Number' types ////////
/////////////////////////////////////////////////////////////////

/**
 * @description - Helper that handles sorting of the current data types: 'String', 'Date', 'Number'.
 * @param {Array} rowData - An array of row data to be sorted.
 * @param {String} sortType - A valid property in each array instance. Used to determine what field to sort by.
 * @param {Boolean} isSorted - A boolean that states whether the data is already sorted or not.
 * @returns {Array} - Returns a cloned version of 'rowData' that is now sorted; either in ascending or descending order.
 */
const handleSorting = (rowData = [], sortType, isSorted = false) => {
	if (isEmptyArray(rowData)) return [];

	const isStringSortable =
		typeof rowData?.[0]?.[sortType] === "string" ||
		rowData?.[0]?.[sortType]?.constructor?.name === "String";

	const isDate = rowData[0][sortType] instanceof Date;

	if (isStringSortable && !isDate) {
		// string sorting
		if (isSorted) return rowData.reverse();

		return rowData.sort((a, b) => {
			return a[sortType].localeCompare(b[sortType]);
		});
	} else if (isDate) {
		// date sorting
		return rowData.sort((a, b) => {
			return b[sortType] - a[sortType];
		});
	} else {
		// numeric sorting
		if (isSorted) return rowData.reverse();

		return rowData.sort((a, b) => {
			return a[sortType] - b[sortType];
		});
	}
};

// misc data processing/massaging utils
export {
	injectResidentInfo,
	mergeResidentTasks,
	extractCompletionRowsFromTasks,
	extractExceptionRowsFromTasks,
};

// processing table data for rows
export {
	getCompletionReportRows,
	getExceptionReportRows,
	getTaskCreatedRows,
	getServicePlanRows,
	getReassessRows,
};
export { handleSorting };

// table columns
export {
	completionCols,
	exceptionCols,
	taskCreatedCols,
	reassessCols,
	servicePlanCols,
};
