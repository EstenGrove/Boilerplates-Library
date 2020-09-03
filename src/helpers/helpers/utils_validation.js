import { isEmptyObj, isEmptyVal, isEmptyArray } from "./utils_types";
import { getChangedDays, getChangedShifts } from "./utils_updates";
import { getRecurringTypeID } from "./utils_repeatingTasks";
import { format } from "date-fns";

/**
 * @description - Takes an object and an array of keys and checks if the keys are empty or not and returns true if valid and false if invalid(or empty)
 * @param {Object} vals - An object of key/value pairs (typically form values)
 * @param {Array} keysToCheck - An array of object keys that need to be checked/validated.
 */
const isValid = (vals = {}, keysToCheck = []) => {
	if (isEmptyObj(vals)) return false;
	const tests = keysToCheck.map((key) => {
		if (isEmptyVal(vals[key])) {
			return false;
		}
		return true;
	});
	return tests.includes(false) ? false : true;
};

////////////////////////////////////////////////////////////////////////
/////////////////////// SHIFT TIMES' VALIDATORS ///////////////////////
////////////////////////////////////////////////////////////////////////

// TODOS:
// - Create 'Shift times' validation:
// 		- Prevent shift times from overlapping
// 		- Prevent 'gaps' in a facility's 24hrs

const sortByReg = /(^sortBy)(?=[\w]{1,})/gm; // matches 'sortBy'
const sortTypeReg = /(By[\w]{1,})/gm; // matches 'ByXXXX'
const sortPrefix = /(sortBy)/gm;

const getAllSorts = (settings) => {
	const allKeys = Object.keys(settings);
	return allKeys.filter((key) => key.match(sortByReg) || key.match(sortPrefix));
};
// this will take a 'settings' object typically used in a formState instance & extract all the 'sortBy' key names and reset only those fields.
const resetSortsOnly = (settings) => {
	const allSorts = getAllSorts(settings);
	return allSorts.reduce((reset, sort) => {
		if (settings.hasOwnProperty(sort)) {
			settings[sort] = "";
			reset = { ...settings };
			return { ...reset };
		}
		return { ...reset };
	}, {});
};

////////////////////////////////////////////////////////////////////////
//////////////////// RECURRING SETTINGS VALIDATORS ////////////////////
////////////////////////////////////////////////////////////////////////

// sorts ['Mon', 'Tues',....] into alpha order for comparison
const sortDays = (days) => {
	if (isEmptyArray(days)) return [];
	return days.sort((a, b) => a.localeCompare(b));
};
const changedStart = (vals, task) => {
	const { startDate } = vals;
	const { RecurringStartDate } = task;
	return isEmptyVal(RecurringStartDate) !== isEmptyVal(startDate);
};
const changedEnd = (vals, task) => {
	const { startDate } = vals;
	const { RecurringEndDate } = task;
	return isEmptyVal(RecurringEndDate) !== isEmptyVal(startDate);
};
// checks if date range has changed
const changedDateRange = (fromVals, fromTask) => {
	const diffStart = changedStart(fromVals, fromTask);
	const diffEnd = changedEnd(fromVals, fromTask);
	if (!diffStart && !diffEnd) return false;

	const startChanged =
		format(fromTask?.RecurringStartDate, "MM/DD/YYYY") !==
		format(fromVals?.startDate, "MM/DD/YYYY");

	const endChanged =
		format(fromTask?.RecurringEndDate, "MM/DD/YYYY") !==
		format(fromVals?.endDate, "MM/DD/YYYY");

	return diffStart || diffEnd || startChanged || endChanged;
};
// checks if 'recurring days' have changed
const changedDays = (vals, task) => {
	const changed = getChangedDays(vals, task);
	if (changed.length !== task?.RecurringDays.length) {
		return true;
	} else {
		// match each day
		const sortChanged = sortDays(changed);
		const sortTask = sortDays(task?.RecurringDays);
		return JSON.stringify(sortChanged) !== JSON.stringify(sortTask);
	}
};
// checks if 'recurring shifts' have changed
const changedShifts = (vals, task) => {
	const { RecurringShifts } = task;
	const changed = getChangedShifts(vals, task);
	return JSON.stringify(changed) !== JSON.stringify(RecurringShifts);
};
// checks if 'recurring type' has changed
const changedRecurringType = (vals, task) => {
	const { AssessmentRecurringId: taskRecurringID } = task;
	return getRecurringTypeID(vals?.recurringType) !== taskRecurringID;
};
// checks if 'isLocked' has changed
const changedLock = (vals, task) => {
	const { IsLocked } = task;
	const { isLocked } = vals;
	return IsLocked !== isLocked;
};
// checks if settings have changed
const changedSettings = (vals, task) => {
	const hasChanged =
		changedRecurringType(vals, task) ||
		changedDateRange(vals, task) ||
		changedShifts(vals, task) ||
		changedDays(vals, task) ||
		changedLock(vals, task);

	return hasChanged;
};

//////////////////////////////////////////////////////////////////
//////////////////////// VALIDATION UTILS ////////////////////////
//////////////////////////////////////////////////////////////////

// REQUIREMENTS:
// - reportType
// - filterBy & filterByXXXX
// - shiftAM | PM | NOC
// - dateRangeType & byMonth | Quarter | Year
// - sortBy & sortByXXXX

// gets the sortByXXXX key
const getSortByKey = (settings) => {
	if (isEmptyVal(settings)) return "";
	const { sortBy } = settings;
	const trimmed = sortBy.replace(" ", "");
	return `sort${trimmed}`;
};
// gets the filterByXXXX key
const getFilterByKey = (settings) => {
	const { filterBy } = settings;
	if (isEmptyVal(filterBy)) return "";
	return `filterBy${filterBy}`;
};
// gets the dateRangeType key name
const getDateRangeTypeKey = (settings) => {
	if (isEmptyVal(settings.dateRangeType)) return;
	if (settings?.dateRangeType === `Today`) return;

	const type = settings?.dateRangeType.split(" ")[1];
	const val = `by${type}`;
	return val;
};
// checks for shift selections
const hasShift = (settings) => {
	const { shiftAM, shiftPM, shiftNOC } = settings;
	return shiftAM || shiftPM || shiftNOC;
};

const validateFields = (settings, listOfFields = []) => {
	if (isEmptyObj(settings)) return false;
	if (isEmptyArray(listOfFields)) return false;
	return listOfFields.reduce((isValid, fieldName) => {
		if (!hasShift(settings)) {
			isValid = false;
			return isValid;
		} else if (isEmptyVal(settings[fieldName])) {
			isValid = false;
			return isValid;
		} else {
			isValid = true;
			return isValid;
		}
	}, false);
};

// SINGLE RESPONSIBILITY VALIDATOR FIELD UTILS
// gets fields for 'byXXXX' date range type
const getDateField = (
	settings,
	fieldsToValidate = [`reportType`, `filterBy`, `dateRangeType`]
) => {
	const { dateRangeType } = settings;
	if (dateRangeType === `Today`) {
		return [...fieldsToValidate];
	} else if (dateRangeType === `Custom Range`) {
		return [...fieldsToValidate, `startDate`, `endDate`];
	} else if (isEmptyVal(dateRangeType)) {
		return [...fieldsToValidate, `dateRangeType`];
	} else {
		return [
			...fieldsToValidate,
			`dateRangeType`,
			getDateRangeTypeKey(settings),
		];
	}
};
// get fields for 'filterByXXXX'
const getFilterField = (
	settings,
	fieldsToValidate = [`reportType`, `filterBy`, `dateRangeType`]
) => {
	if (!isEmptyVal(settings?.filterBy)) {
		return [...fieldsToValidate, getFilterByKey(settings)];
	} else {
		return [...fieldsToValidate];
	}
};
// gets field for 'dateRangeType'
const getDateRangeField = (
	settings,
	fieldsToValidate = [`reportType`, `filterBy`, `dateRangeType`]
) => {
	if (
		!isEmptyVal(settings?.dateRangeType) &&
		settings.dateRangeType !== `Today`
	) {
		return [...fieldsToValidate, getDateRangeTypeKey(settings)];
	} else {
		return [...fieldsToValidate];
	}
};
// gets field for 'sortByXXXX'
const getSortField = (
	settings,
	fieldsToValidate = [`reportType`, `filterBy`, `dateRangeType`]
) => {
	const noSubOptions = [`By Shift`, `By Unit Type`, `By Floor Unit`];

	if (
		!isEmptyVal(settings?.sortBy) &&
		!noSubOptions.includes(settings.sortBy)
	) {
		return [...fieldsToValidate, getSortByKey(settings)];
	} else {
		return [...fieldsToValidate];
	}
};

// wrapper around ALL field validator checks
const getFields = (
	settings,
	fieldsToValidate = [`reportType`, `filterBy`, `dateRangeType`]
) => {
	const withFilters = getFilterField(settings, fieldsToValidate);
	const withDates = getDateField(settings, withFilters);
	const withSorts = getSortField(settings, withDates);

	return [...withSorts];
};

const getSvcPlanFields = (
	settings,
	fieldsToValidate = [`reportType`, `filterBy`, `dateRangeType`]
) => {
	const withFilters = getFilterField(settings, fieldsToValidate);
	const withDates = getDateField(settings, withFilters);

	return [...withDates];
};

// validates a list of keys in an object
export { isValid };

// SORT VALIDATION HELPERS
// helpers for finding keys by name
// regex
export { sortByReg, sortTypeReg, sortPrefix };
export { getAllSorts, resetSortsOnly };
// recurring change validators
export {
	changedLock,
	changedDateRange,
	changedDays,
	changedShifts,
	changedRecurringType,
	changedSettings,
};

// validation utils
export {
	getDateField,
	getDateRangeField,
	getSortField,
	getFilterField,
	// field validators
	getSvcPlanFields,
	getFields,
	getSortByKey,
	getFilterByKey,
	getDateRangeTypeKey,
	hasShift,
	validateFields,
};
