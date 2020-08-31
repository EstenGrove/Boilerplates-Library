import { test } from "./utils_env";
import { residentData, forTracker, generic } from "./utils_endpoints";
import { genericGet as genericGetParams } from "./utils_params";
import {
	isEmptyArray,
	isEmptyObj,
	isEmptyVal,
	handleEmpties,
} from "./utils_types";
import {
	getFileRegistryByResident,
	getFileBlob,
	createURL,
} from "./utils_files";
import { AdlShiftScheduleModel } from "./utils_models";
import { getCategoryID } from "./utils_categories";
import { getShiftID } from "./utils_shifts";
import { format, isWithinRange } from "date-fns";
import { saveToStorage } from "./utils_caching";

///////////////////////////////////////////////////
////////////// DATA FETCHING HELPERS //////////////
///////////////////////////////////////////////////

// defaults to today's date if no date is passed
/**
 * @description - Fetches a resident's daily summary including: ADL care tasks, recurring tasks, care levels, their ADL Shift Schedules & other data.
 * @param {String} token - A base64 encoded auth token.
 * @param {Number} residentID - A numeric resident uid to fetch daily data for.
 * @param {Date} weekDate - A date string for the day to fetch data for.
 * @default weekDate - Defaults to today's data, if empty.
 * @param {Boolean} showMoreTasks - A boolean value to enable "History" & "Future" ADL care tasks in the HTTP reponse.
 * @default showMoreTasks - Defaults to 'false'
 * @param {Number} showNumOfDaysTasks - Number to indicate how many days' worth of tasks to return in the HTTP response.
 * @default showNumOfDaysTasks - Defaults to '0'. This param is only applicable is 'showMoreTasks' is enabled (ie set to 'true')
 *
 */
const getResidentDay = async (
	token,
	residentID,
	weekDate,
	showMoreTasks = false,
	showNumOfDaysTasks = 0
) => {
	let url = test.base + forTracker.byDay;
	url +=
		"?" +
		new URLSearchParams({
			residentId: residentID,
			dayOfWeekDate: weekDate,
			showMoreAdlCareTasks: showMoreTasks,
			daysMoreAdlCareTasks: showNumOfDaysTasks,
		});
	try {
		const request = await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			}),
		});
		const response = await request.json();
		if (!response.Data) return response;
		return response.Data;
	} catch (err) {
		console.log("An error occured: " + err);
		return err.message;
	}
};
// gets entire week by passing 0-6 (Sunday-Saturday) value for the week day
const getResidentWeek = async (
	token,
	residentID,
	dayOfWeek = 0,
	weekDate = null,
	showMoreTasks = false,
	showNumOfDaysTasks = 0
) => {
	let url = test.base + forTracker.byWeek;
	url +=
		"?" +
		new URLSearchParams({
			residentId: residentID,
			dayOfWeek: dayOfWeek,
			showMoreAdlCareTasks: showMoreTasks,
			daysMoreAdlCareTasks: showNumOfDaysTasks,
		});
	if (weekDate) {
		url += "&dayOfWeekDate=" + weekDate;
	}

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			}),
		});
		const response = await request.json();
		if (!response.Data) return response;
		return response.Data;
	} catch (err) {
		console.log("An error occured: " + err);
		return err.message;
	}
};

// performance-sensitive versions: 'getResidentDay' & 'getResidentWeek'
/**
 * @description - This is a 'scaled-down' version of 'getResidentDayForAdvantageTracker', that only returns the essentials.
 * @param {String} token - Auth token.
 * @param {Number} residentId - Unique resident identifier.
 * @param {Date} dayOfWeekDate - Date(day) to request data for.
 * @param {Boolean} showMoreTasks - Enables returning 'ADLCareTaskHistory' & 'ADLCareTaskFuture' records.
 * @param {Number} showNumOfDaysTasks - Sets *how* many days of 'ADLCareTaskHistory' & 'ADLCareTaskFuture' records should be returned.
 * @returns {Object} - Returns an object with the 'Data' property populated w/ a resident's schedule for a given day.
 */
const getResidentDayMaster = async (
	token,
	residentId,
	dayOfWeekDate = new Date(),
	showMoreTasks = false,
	showNumOfDaysTasks
) => {
	let url = test.base + forTracker.byDayMaster;
	url += "?" + new URLSearchParams({ residentId });
	url +=
		"&" +
		new URLSearchParams({ dayOfWeekDate: format(dayOfWeekDate, "MM/DD/YYYY") });
	url += "&" + new URLSearchParams({ showMoreAdlCareTasks: showMoreTasks });
	url +=
		"&" + new URLSearchParams({ daysMoreAdlCareTasks: showNumOfDaysTasks });

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
 * @description - This is a 'scaled-down' version of 'getResidentDayForAdvantageTracker', that only returns the essentials.
 * @param {String} token - Auth token.
 * @param {Number} residentId - Unique resident identifier.
 * @param {Date} dayOfWeekDate - Date(day) to request data for.
 * @param {Boolean} showMoreTasks - Enables returning 'ADLCareTaskHistory' & 'ADLCareTaskFuture' records.
 * @param {Number} showNumOfDaysTasks - Sets *how* many days of 'ADLCareTaskHistory' & 'ADLCareTaskFuture' records should be returned.
 * @returns {Object} - Returns an object with the 'Data' property populated w/ a resident's schedule for a given day.
 */
const getResidentDayDetails = async (
	token,
	residentId,
	dayOfWeekDate = new Date(),
	showMoreTasks = false,
	showNumOfDaysTasks
) => {
	let url = test.base + forTracker.byDayDetails;
	url += "?" + new URLSearchParams({ residentId });
	url +=
		"&" +
		new URLSearchParams({ dayOfWeekDate: format(dayOfWeekDate, "MM/DD/YYYY") });
	url += "&" + new URLSearchParams({ showMoreAdlCareTasks: showMoreTasks });
	url +=
		"&" + new URLSearchParams({ daysMoreAdlCareTasks: showNumOfDaysTasks });

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
 * @description - This is a 'scaled-down' version of 'getResidentDayForAdvantageTracker', that only returns the essentials.
 * @param {String} token - Auth token.
 * @param {Number} residentId - Unique resident identifier.
 * @param {Number} dayOfWeek - Zero-based day of the week (ie Sunday-Saturday = 0-6)
 * @param {Date} dayOfWeekDate - Date that sets the 'weeks start' to fetch data for. (not needed)
 * @param {Boolean} showMoreTasks - Enables returning 'ADLCareTaskHistory' & 'ADLCareTaskFuture' records.
 * @param {Number} showNumOfDaysTasks - Sets *how* many days of 'ADLCareTaskHistory' & 'ADLCareTaskFuture' records should be returned.
 * @returns {Object} - Returns an object with the 'Data' property populated w/ a resident's schedule for a given day.
 */
const getResidentWeekMaster = async (
	token,
	residentId,
	dayOfWeek = 0,
	dayOfWeekDate = null,
	showMoreTasks = false,
	showNumOfDaysTasks = 0
) => {
	let url = test.base + forTracker.byWeekMaster;
	url += "?" + new URLSearchParams({ residentId });
	url +=
		"&" +
		new URLSearchParams({
			dayOfWeek,
			showMoreAdlCareTasks: showMoreTasks,
			daysMoreAdlCareTasks: showNumOfDaysTasks,
		});
	if (dayOfWeekDate) {
		url +=
			"&" +
			new URLSearchParams({
				dayOfWeekDate: format(dayOfWeekDate, "MM/DD/YYYY"),
			});
	}

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
 * @description - This is a 'scaled-down' version of 'getResidentDayForAdvantageTracker', that only returns the essentials.
 * @param {String} token - Auth token.
 * @param {Number} residentId - Unique resident identifier.
 * @param {Date} dayOfWeekDate - Date(day) to request data for.
 * @param {Boolean} showMoreTasks - Enables returning 'ADLCareTaskHistory' & 'ADLCareTaskFuture' records.
 * @param {Number} showNumOfDaysTasks - Sets *how* many days of 'ADLCareTaskHistory' & 'ADLCareTaskFuture' records should be returned.
 * @returns {Object} - Returns an object with the 'Data' property populated w/ a resident's schedule for a given day.
 */
const getResidentWeekDetails = async (
	token,
	residentId,
	dayOfWeek = 0,
	dayOfWeekDate = new Date(),
	showMoreTasks = false,
	showNumOfDaysTasks
) => {
	let url = test.base + forTracker.byWeekDetails;
	url += "?" + new URLSearchParams({ residentId });
	url +=
		"&" +
		new URLSearchParams({
			dayOfWeek,
			dayOfWeekDate: format(dayOfWeekDate, "MM/DD/YYYY"),
			showMoreAdlCareTasks: showMoreTasks,
			daysMoreAdlCareTasks: showNumOfDaysTasks,
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

const getResidentProfile = async (token, residentID) => {
	let url = test.base + residentData.getProfile;
	url += "?residentId=" + residentID;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			}),
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("An error occured: " + err);
		return err.message;
	}
};

const getResidentLOA = async (token, residentID) => {
	let url = test.base + residentData.getLOA;
	url += "?residentId=" + residentID;

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
		return console.log("An error occured: " + err);
	}
};

const getResidentMeds = async (token, residentID) => {
	let url = test.base + residentData.getMeds;
	url += "?" + new URLSearchParams({ residentId: residentID });

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
		console.log("Oops. An error occurred", err);
		return err.message;
	}
};

// fetches a resident record from the 'RESIDENTS' table
const getResidentRecord = async (token, residentID) => {
	let url = test.base + generic.get2;
	url += "?" + new URLSearchParams({ ...genericGetParams.resident });
	url += "&" + new URLSearchParams({ ID: residentID });

	try {
		const request = await fetch(url, {
			method: "POST",
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
// fetches a resident record from the 'RESIDENTS' table
const getResidentContacts = async (token, residentId) => {
	let url = test.base + residentData.getContacts;
	url += "?" + new URLSearchParams({ residentId });

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
		console.log(`✅ Success! 'CONTACTS' request was successful:`, response);
		return response.Data;
	} catch (err) {
		console.log(`❌ Oops! 'CONTACTS' request failed:`, err);
		return err.message;
	}
};

// fetch a single 'RESIDENTS' record & 'CONTACTS' record(s) for a given residentID
// used for 'ResidentInfo' modal (ie <ResidentInfoPanel/>)
const getResidentInfo = async (token, residentID) => {
	if (isEmptyVal(residentID)) return {};
	const [residentRecord, residentContacts] = await Promise.all([
		getResidentRecord(token, residentID),
		getResidentContacts(token, residentID),
	]);

	return { profile: { ...residentRecord[0] }, contacts: residentContacts };
};

// fetches resident profile, meds and ...
const getResidentDetails = async (token, residentID) => {
	const profile = await getResidentProfile(token, residentID);
	const meds = await getResidentMeds(token, residentID);

	return {
		profile,
		meds,
	};
};
////////////////////////////////////////////////////////////////////
////////////////////// RESIDENT PHOTO HELPERS //////////////////////
////////////////////////////////////////////////////////////////////
/**
 * @description - Fetches resident's files, finds their most recent photo record, fetches photo file, saves to storage, then returns objectURL.
 * @param {String} token - An active auth security token.
 * @param {Number} residentId - A unique resident identifier.
 * @returns {ObjectURL} - Returns an active window.URL.objectURL() to use as an <img src=""/>
 */
const getResidentPhotoSrc = async (token, residentId) => {
	const fileList = await getFileRegistryByResident(token, residentId);
	const imgFile = getRecentResidentImg(fileList);

	if (!isEmptyVal(imgFile?.photoID)) {
		const fileBlob = await getFileBlob(token, imgFile?.photoID);
		const url = createURL(fileBlob);
		saveToStorage(`Photo-${residentId}`, imgFile);
		return url;
		// return createURL(fileBlob);
	} else {
		return "";
	}
};

// checks if file record is a resident photo
const isResidentIMG = (file) => {
	const { Description } = file;
	const names = [`Resident Image`, `Resident Photo`];
	if (names.includes(Description)) {
		return true;
	} else {
		return false;
	}
};

// get the most recent resident photo file record, in custom data structure
const getRecentResidentImg = (files = []) => {
	// 1. find ALL 'Resident Image' files
	// 2. determine 'most recent'; if empty return {}
	if (isEmptyArray(files)) return {};
	const photos = files.filter((file) => isResidentIMG(file));
	const mostRecentIMG = getMostRecentIMG(photos);
	return mostRecentIMG;
};
/**
 * @description - Return custom details from most recent resident photo.
 * @param {Array} files - Array of 'FileRegistry' records, that should ONLY contain resident photo records.
 * @returns {Object} - Returns custom object w/ details or empty object if empty.
 * - "obj.filename": filename from repo.
 * - "obj.photoID": 'FileRegistryID'.
 * - "obj.modifiedDate": original 'ModifiedDate' field.
 * - "obj.desc": file description (ie 'Resident Image').
 * - "obj.status": file's status; 'ready', 'archived', 'not-ready'.
 * - "obj.path": file's immediate folder path.
 * - "obj.repo": full path to file's DMS repo.
 * - "obj.residentID": resident's uid.
 * - "obj.size": file size in raw bytes.
 */
const getMostRecentIMG = (files) => {
	return files.reduce((a, b) => {
		if (new Date(a.FileDate) > new Date(b.FileDate)) {
			return {
				filename: a.Filename,
				photoID: a.FileRegistryID,
				modifiedDate: a.ModifiedDate,
				desc: a.Description,
				status: a.Status,
				path: a.FileSourcePath,
				repo: a.UrlPath,
				residentID: a.ResidentId,
				size: a.FileBytes,
			};
		} else {
			return {
				filename: b.FileName,
				photoID: b.FileRegistryID,
				modifiedDate: b.ModifiedDate,
				desc: b.Description,
				status: b.Status,
				path: b.FileSourcePath,
				repo: b.UrlPath,
				residentID: b.ResidentId,
				size: b.FileBytes,
			};
		}
	}, {});
};

// MISC RESIDENT HELPERS //

/**
 * @description - Helper, that handles applying user selected values(ie form values) to a ResidentAdlSchedule model.
 * @param {Object} settings - A object of user selected values to be saved (ie form values)
 * @param {Number} residentID - A numeric resident id, representing which resident's ADL shift record should be updated.
 */
const updateResidentAdlModel = (settings, residentID) => {
	const base = new AdlShiftScheduleModel();
	base.setResidentID(residentID);
	const model = base.getModel();
	return {
		...model,
		IsActive: true,
		AssessmentCategoryId: getCategoryID(settings.category),
		AssessmentShiftId: getShiftID(settings.shift),
		ShiftSun: settings.shiftSun,
		ShiftMon: settings.shiftMon,
		ShiftTue: settings.shiftTue,
		ShiftWed: settings.shiftWed,
		ShiftThu: settings.shiftThu,
		ShiftFri: settings.shiftFri,
		ShiftSat: settings.shiftSat,
		Notes: settings.notes,
	};
};

/**
 * @description - Helper that maps thru each formState object, inits a ResidentAdlSchedule model and applies updates to the model.
 * @param {Array} allSettings - A merged array of all ADL shift schedules (with updated values)
 * @param {Number} residentID - A numeric resident id.
 */
const updateAllAdlModels = (allSettings, residentID) => {
	return allSettings.map((settings) =>
		updateResidentAdlModel(settings, residentID)
	);
};

/**
 * @description - Helper that accepts a "LeaveOfAbsence" entry and checks if today is within the leave of absence range.
 * @param {object} loa - An LeaveOfAbsence data object
 * @returns boolean
 */
const isLOA = (loa) => {
	if (isEmptyArray(loa)) return false;
	const [current] = loa;
	const { LeaveDate, ReturnDate } = current;
	if (!isEmptyVal(LeaveDate) && isEmptyVal(ReturnDate)) return true;
	if (!isWithinRange(new Date(), LeaveDate, ReturnDate)) {
		return false;
	}
	return true;
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////// RESIDENT DATA FETCHING UTILS ////////////////////////
///////////////////////////////////////////////////////////////////////////////

// fetches a residents weekly tasks starting from a given day (defaults to "Sunday") - <CALENDARVIEW/>
/**
 *
 * @param {String} token - A base64 encoded auth token.
 * @param {Number} residentID - Unique identifier (uid) for a given resident.
 * @param {Number} dayOfWeek - The desired day of the week as an index 0-6 (ie "Sunday" = 0, "Monday" = 1 etc)
 * @param {Date} weekDate - A specific date to fetch from *that* date forward. (ie fetch everything from 05/14/2020 thru 05/21/2020 etc.)
 * @returns {Object} - Returns an object with a 3-week span of tasks. (ie "Last week", "Current week", "Next week").
 */
const fetchWeeklyTasks = async (
	token,
	residentID,
	dayOfWeek = 0,
	weekDate = new Date().toUTCString()
) => {
	const [residentWeek] = await Promise.all([
		getResidentWeek(token, residentID, dayOfWeek, weekDate),
	]);
	if (residentWeek) {
		// NOT CURRENTLY HANDLING CATEGORIES/CARE-LEVELS
		const data = processResidentWeek(residentWeek, []);
		return {
			categories: [...data.categories],
			scheduledTasks: [...data.scheduledTasks],
			scheduledTasksHistory: [...data.scheduledTasksHistory],
			scheduledTasksFuture: [...data.scheduledTasksFuture],
			unscheduledTasks: [...data.unscheduledTasks],
		};
	} else {
		// handle failure case???
		return;
	}
};

// UPDATED AS OF 5/11/2020 - runs in parallel ✅
const fetchDailyResidentData = async (token, residentID, day = new Date()) => {
	const dayOfWeekDate = day.toISOString();
	const [dailyData, profileData] = await Promise.all([
		getResidentDay(token, residentID, dayOfWeekDate),
		// getResidentProfile(token, residentID),
	]);
	return { ...dailyData, ...profileData };
};
// UPDATED AS OF 8/31/2020 - added 'weekDate' datetime object
const fetchWeeklyResidentData = async (
	token,
	residentID,
	startDay = 0,
	weekDate = new Date().toUTCString()
) => {
	const [weeklyData, profileData] = await Promise.all([
		getResidentWeek(token, residentID, startDay, weekDate),
		getResidentProfile(token, residentID),
	]);
	return { ...weeklyData, ...profileData };
};

const mergeDailyResidentData = async (token, residentID, day = new Date()) => {
	const dailyData = await fetchDailyResidentData(token, residentID, day);
	const l_o_a = await getResidentLOA(token, residentID); // leave_of_absence - move this into "fetchDailyResidentData" Promise.all call

	const merged = {
		...dailyData,
		UnscheduledTasks: handleEmpties(dailyData.AssessmentUnscheduleTask),
		UnscheduledTasksRaw: handleEmpties(dailyData.AssessmentUnscheduleTaskRaw),
		LOA: [l_o_a],
		ResidentID: residentID,
	};
	return { ...merged };
};

/**
 * @description - Helper that processes, formats the data response from fetch a resident's weekly schedule data (ie tasks, adls, care-levels etc.)
 * @param {Object} weeklyData - The data response from fetching a resident's weekly data (ie tasks, adls, care-levels etc.)
 * @param {Array} unscheduledTasks - An array of "AssessmentUnscheduleTask" records for a resident from the desired week.
 * @returns {Object} - Returns an object with neatly formatted data:
 * - "categories": resident's current active categories for the week.
 * - "scheduledTasks": the current week's scheduled tasks (ie "ADLCareTask"s).
 * - "scheduledTasksHistory": the previous week's scheduled tasks.
 * - "scheduledTasksFuture": the following week's scheduled tasks.
 * - "trackingTasks": the matching "AssessmentTrackingTask" records for the tasks.
 * - "unscheduledTasks": "AssessmentUnscheduleTask" records for the current date or date range.
 * - "unscheduledTasksRaw": "AssessmentUnscheduleTask" records WITHOUT any additions/modification. The raw table data for an 'unscheduled task'.
 */
const processResidentWeek = (weeklyData, unscheduledTasks) => {
	if (isEmptyObj(weeklyData)) return {};
	const {
		ADLCareTask,
		ADLCareTaskHistory, // currently not in use!!!
		ADLCareTaskFuture, // currently not in use!!!
		AssessmentTrackingTask,
		AssessmentUnscheduleTask,
		ADLCareLevel,
	} = weeklyData;

	return {
		categories: handleEmpties(ADLCareLevel),
		scheduledTasks: handleEmpties(ADLCareTask),
		scheduledTasksHistory: handleEmpties(ADLCareTaskHistory),
		scheduledTasksFuture: handleEmpties(ADLCareTaskFuture),
		trackingTasks: handleEmpties(AssessmentTrackingTask),
		unscheduledTasks: handleEmpties(AssessmentUnscheduleTask),
	};
};

// FETCH RESIDENT DATA FOR DATE RANGES
export { getResidentDay, getResidentWeek };
// PERFORMANCE-SENSITIVE VERSIONS!!!
export {
	// DAY
	getResidentDayMaster,
	getResidentDayDetails,
	// WEEK
	getResidentWeekMaster,
	getResidentWeekDetails,
};

// FETCHING RESIDENT DATA for the ResidentInfoView
export {
	getResidentMeds, // should be deprecated ???
	getResidentDetails, // should be deprecated ???
	getResidentProfile,
	getResidentInfo,
};

// RESIDENT PHOTO HANDLER(S)
export { isResidentIMG, getRecentResidentImg, getMostRecentIMG };
// MAIN RESIDENT PHOTO HANDLER
export { getResidentPhotoSrc };

export {
	isLOA,
	getResidentLOA,
	fetchWeeklyTasks,
	processResidentWeek,
	mergeDailyResidentData,
	fetchDailyResidentData,
	fetchWeeklyResidentData,
};

// SAVE/UPDATE RESIDENT ADL SHIFT SCHEDULE & MODEL UPDATERS
export { updateResidentAdlModel, updateAllAdlModels };
