import { isEmptyVal, isEmptyArray } from "./utils_types";
import {
	isScheduledTask,
	isPastDue,
	isException,
	isNotComplete,
	isCompleted,
	findNotCompleteTasks,
} from "./utils_tasks";
import { hasException } from "./utils_exceptions";

// MISC PROCESSING HELPERS //

// creates a range; usage: range(0, 10, x => x + 1)
const range = (start, stop, callback) => {
	return Array.from({ length: stop - start }, (_, i) => callback(i + start));
};

// converts num to letter (MUST BE WITHIN RANGE: 97-122 A-Za-z)
const numToLetter = (num) => {
	const letter = String.fromCharCode(num);
	return letter;
};
// gets a 'random' number within a range
const numInRange = (min = 97, max = 122) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// count: how many 'random chars' to generate
// used for ids in <ReassessReport/>
const generateID = (count = 6) => {
	const baseCount = range(1, count, (x) => x + 1);
	const random = baseCount
		.map((x) => {
			const inRange = numInRange();
			return numToLetter(inRange);
		})
		.join("");
	return count + random;
};

// creates a unique ID, w/ a 'timestamp' of when it was created
const generateUID = (idLength = 32) => {
	const x1 = generateID(idLength);
	return `${x1}=${Date.now()}`;
};

// returns true if "odd number", else false
// uses whether there is a remainder, to determine event/odd type
const isOdd = (num) => {
	return Boolean(num % 2);
};

// returns true if "even number", else false
// uses whether there is a remainder, to determine event/odd type
const isEven = (num) => {
	return !Boolean(num % 2);
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;

	return function executedFunction() {
		var context = this;
		var args = arguments;

		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		var callNow = immediate && !timeout;

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) func.apply(context, args);
	};
}

//////////////////////////////////////////////////////////////
///////////////////// STRING PROCESSING /////////////////////
/////////////////////////////////////////////////////////////

const addEllipsis = (str = ``, maxLength) => {
	if (isEmptyVal(str)) return `No description`;
	if (str.length < maxLength) return str;
	const managedStr = enforceStrMaxLength(str, maxLength);
	return managedStr + `...`;
};

const replaceNullWithMsg = (val, msg) => {
	if (!val || val === null) return msg;
	return val;
};

const enforceStrMaxLength = (str, maxLength = 30) => {
	if (str.length < maxLength) return str;
	return str.slice(0, maxLength);
};

// capitalize first letter of string
const capitalize = (str) => {
	return str.substring(0, 1).toUpperCase() + str.substring(1);
};
// capitalize all characters
const capitalizeAll = (str) => {
	return str?.toUpperCase();
};
const capitalizeADLs = (str) => {
	const { length } = str;
	return str.substring(0, length - 1).toUpperCase() + str.substring(length - 1);
};

//////////////////////////////////////////////////////////////
/////////////////////// COUNTING TASKS ///////////////////////
//////////////////////////////////////////////////////////////

// get various counts: COMPLETED, PENDING, NOT-COMPLETE, MISSED-EVENT
const getCount = (tasks, status) => {
	return tasks.filter((task, index) => task.TaskStatus === status).length;
};

/**
 * Default 'counts' object for 'getCountsByStatus'.
 */
const initialCounts = {
	total: 0,
	pastDue: 0,
	exceptions: 0,
	notComplete: 0,
	complete: 0,
};
/**
 * @description - Counts ALL tasks by status type w/ a single iteration (for performance reasons) and returns an object w/ each task status count.
 * @default initialCounts - The default count values, and return object.
 * @param {Array} allTasks - An array of ALL current tasks (includes 'scheduled' & 'unscheduled').
 * @param {Date} dueDate - A date used to compare if a task is 'PAST-DUE' comparable to the current time & its due date.
 * @param {Array} shiftTimes - An array of 'AssessmentFacilityShift' records including the facility's shift times.
 * @returns {Object} - Returns an object with each status count as a field.
 * - "counts.total": total # of tasks
 * - "counts.pastDue": total # of 'PAST-DUE' tasks
 * - "counts.exceptions": total # of 'EXCEPTION' tasks
 * - "counts.notComplete": total # of 'NOT-COMPLETE' tasks; excludes 'PAST-DUE' & 'EXCEPTION' types
 * - "counts.complete": total # of 'COMPLETE' tasks; excludes 'PAST-DUE' & 'EXCEPTION' types
 *
 * - Updated 8/7/2020 @ 12:48 PM
 */
const getCountsByStatus = (
	allTasks = [],
	dueDate = new Date(),
	shiftTimes = []
) => {
	return allTasks.reduce(
		(counts, task) => {
			if (isException(task) && !isCompleted(task)) {
				counts.exceptions += 1;
				return { ...counts, total: allTasks.length };
			} else if (isPastDue(task, dueDate, shiftTimes)) {
				counts.pastDue += 1;
				return { ...counts, total: allTasks.length };
			} else if (isNotComplete(task, dueDate, shiftTimes)) {
				counts.notComplete += 1;
				return { ...counts, total: allTasks.length };
			} else {
				counts.complete += 1;
				return { ...counts, total: allTasks.length };
			}
		},
		{ ...initialCounts }
	);
};

// checks the 'AssessmentExceptionId' field
const getExceptionCount = (tasks) => {
	if (isEmptyArray(tasks)) return 0;
	return tasks.filter((x) => hasException(x)).length;
};

// gets the number of completed tasks (scheduled tasks)
// UPDATED AS 3/4/2020
const getCompletedCount = (tasks) => {
	if (isEmptyArray(tasks)) return 0;
	return tasks.filter((task) => isCompleted(task)).length;
};

/**
 * @description - Returns a the total # of "NOT-COMPLETE" tasks, EXCLUDING "PAST DUE" tasks
 * @param {Array} tasks - A merged array of Scheduled & Unscheduled tasks or either individually.
 * @returns {Number} - Returns a number as the count of not completed tasks.
 */
// EXCLUDES "past due" tasks - UPDATED AS OF 4/28/2020
const getNotCompleteCount = (tasks, dueDate = Date.now()) => {
	if (isEmptyArray(tasks)) return 0;
	return findNotCompleteTasks(tasks, dueDate).length;
};

/**
 * UPDATED AS OF 4/28/2020
 * @description - Counts the number of past due tasks, based off a past due date provided.
 * @param {Array} tasks - An array of tasks.
 * @param {Date|Null} pastDueDate - Either date or null. If a date is provided it's used as the past due comparator
 * @returns {Number} - Returns the number of past due tasks
 */
const getPastDueCount = (tasks, pastDueDate = Date.now(), shiftTimes = []) => {
	if (isEmptyArray(tasks)) return 0;
	return tasks.filter(
		(task) => isPastDue(task, pastDueDate, shiftTimes) && !isException(task)
	).length;
};

// ##TODOS:
// - Replace existing 'getPastDueCount' helpers w/ the below version
// const getPastDueCount = (tasks, anchorDate = new Date(), shiftTimes = []) => {
// 	if (isEmptyArray(tasks)) return [];
// 	return tasks.filter((task) => isPastDue(task, anchorDate, shiftTimes)).length;
// };

/**
 * @description - Merges Scheduled & Unscheduled tasks and returns the count.
 * @param {Array} tasks - A merged array of Scheduled & Unscheduled tasks.
 * @example getTaskCount([...scheduledTasks, ...unscheduledTasks])
 * @returns {Number} - Returns a number as the total task count.
 */
const getTaskCount = (tasks) => {
	if (isEmptyArray(tasks)) return 0;
	return tasks.length;
};

const getMissedEvents = (tasks) => {
	if (isEmptyArray(tasks)) return [];
	return tasks.filter((task) => {
		if (isScheduledTask(task)) {
			return (
				task.TaskStatus === "MISSED-EVENT" || task.AssessmentTaskStatusId === 3
			);
		} else {
			return (
				task.AssessmentTaskStatusId === 3 || task?.TaskStatus === "MISSED-EVENT"
			);
		}
	});
};

// removes dups from arrays (does NOT work with nested objects)
const removeDuplicates = (list) => {
	return list.reduce((unique, item) => {
		return unique.includes(item) ? unique : [...unique, item];
	}, []);
};

// handles complex data structures (ie nested objects inside of arrays etc.)
const removeComplexDuplicates = (list) => {
	return list.reduce((unique, item) => {
		return JSON.stringify(unique).includes(JSON.stringify(item))
			? unique
			: [...unique, item];
	}, []);
};

const groupBy = (list, iteratee) => {
	return list.reduce((acc, item) => {
		const keyToSortBy = iteratee(item);
		if (!acc[keyToSortBy]) {
			acc[keyToSortBy] = [];
		}
		acc[keyToSortBy].push(item);
		return acc;
	}, {});
};

// checks if an item 'already exists' in an array
// works w/ primitives and object-types
const alreadyExists = (current, existing = []) => {
	const strCurrent = JSON.stringify(current);
	const strExisting = JSON.stringify(existing);
	if (!strExisting.includes(strCurrent)) return false;
	return true;
};

// ID & CHAR HELPERS
export { numToLetter, numInRange, generateID, generateUID };

// NUMBER, CALCULATION HELPERS
export {
	isOdd,
	isEven,
	range,
	debounce,
	groupBy,
	alreadyExists,
	removeDuplicates,
	removeComplexDuplicates,
};

// string processing utils
export {
	addEllipsis,
	replaceNullWithMsg,
	enforceStrMaxLength,
	capitalize,
	capitalizeAll,
	capitalizeADLs,
};

// TASK COUNTS //
export {
	getCount,
	getTaskCount,
	getMissedEvents,
	// CURRENT TASK COUNT HELPERS
	getCountsByStatus, // GET ALL TASK COUNTS IN A SINGLE LOOP
	getPastDueCount,
	getCompletedCount, // "COMPLETE" & & "EXCEPTIONS"
	getNotCompleteCount, // "NOT-COMPLETE", excluding "PAST DUE" & "EXCEPTIONS"
	getExceptionCount, //
};
