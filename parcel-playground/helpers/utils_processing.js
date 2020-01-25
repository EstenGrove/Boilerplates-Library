import { isEmptyObj, isEmptyArray, isEmptyVal } from "./utils_types";

const isCompleted = task => {
	if (task?.IsCompleted) return true;
	if (task?.TaskStatus === "COMPLETE") return true;
	if (task?.AssessmentTaskStatusId === 2) return true;
	return false;
};

const isMissedEvent = task => {
	if (task?.TaskStatus === "MISSED-EVENT") return true;
	if (task?.AssessmentTaskStatusId === 3) return true;
	if (task?.Resolution === "MISSED-FORGOTTEN") return true;
	return false;
};

// #CALCULATIONS
const getPercentage = (count, completed) => {
	return Math.round(((completed / count) * 100).toFixed(2)) + "%";
};

const getAvg = arr => arr.reduce((acc, cur) => acc + cur / arr.length, 0);

// get various counts: COMPLETED, PENDING, NOT-COMPLETE, MISSED-EVENT
const getCount = (tasks, status) => {
	return tasks.filter((task, index) => task.TaskStatus === status).length;
};

const getIsCompletedCount = tasks => {
	return tasks.filter(task => task.IsCompleted).length;
};

// params: "list" - array of objects
// "prop" - a property in each array item's object
// "val" - the value that each "prop" should equal.
const getCountByProp = (list, prop, val) => {
	return list.filter((item, index) => item[prop] === val).length;
};

// pass a condition you DONT wont to match (ie all that DONT meet condition)
const getRemaining = (list, condition) => {
	return list.filter((item, index) => item.TaskStatus !== condition).length;
};

// gets the number of completed tasks (scheduled tasks)
const getCompletedCount = tasks => {
	if (isEmptyArray(tasks)) return 0;
	return tasks.filter(
		task =>
			task.IsCompleted ||
			(!(task?.TaskStatus === "COMPLETE") ?? task.AssessmentTaskStatusId === 2)
	).length;
};

const mergeCompletedCounts = (scheduledTasks, unscheduledTasks) => {
	if (isEmptyArray(scheduledTasks) && isEmptyArray(unscheduledTasks))
		return { scheduled: 0, unscheduled: 0, total: 0 };

	return {
		scheduled: scheduledTasks.filter(task => isCompleted(task)).length,
		unscheduled: unscheduledTasks.filter(task => isCompleted(task)).length,
		total:
			parseInt(scheduledTasks.filter(task => isCompleted(task)).length, 10) +
			parseInt(unscheduledTasks.filter(task => isCompleted(task)).length, 10)
	};
};

//  #STRING HELPERS
// will slice a string at a desired length an add a "..."
const addEllipsis = (val, desiredLength) => {
	if (val.length <= desiredLength) return val;
	return val.slice(0, desiredLength) + "...";
};

// #DATA TYPE HELPERS
const replaceNullWithMsg = (val, msg) => {
	if (!val || val === null) return msg;
	return val;
};

const getRandomNumArbitrary = (min, max) => {
	return Math.random() * (max - min) + min;
};

// SORTING, MATCHING AND FILTERING //
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

/**
 * @description - Match an object to an object by id
 * @param {object} item - The current item in an array to be checked/tested
 * @param {string} id - A unique identifier to test for.
 * @param {object} comparator - The base object to match 'to'
 * @example matchByID({id: 1}, 'id', {id: 1})
 * returns [{id: 1}]
 * NOTE: result can be destructured out of the array.
 */
const matchByID = (item, id, comparator) => {
	if (item[id] === comparator[id]) {
		return item;
	}
	return;
};

/**
 * @description - Locate the object that has the same id as the "comparator"
 * @param {array} items - An array of items to test for a match
 * @param {string} id - A unique identifier to test for.
 * @param {object} comparator - The base object to find a match for (ie "to compare against")
 */
const getMatch = (items, id, comparator) => {
	if (isEmptyArray(items)) return {};
	if (isEmptyObj(comparator)) return {};
	return items.reduce((all, item) => {
		if (item[id] === comparator[id]) {
			all = item;
			return all;
		}
		return all;
	});
};

// 1. loops thru an array of objects,
// 2. finds match by firstID in top-level array
// 3. loops thru matching items' array
// 4. finds child match by secondID
// NOTE: USED FOR FINDING THE MATCHING SUBTASK RECORD FROM A LIST OF ADLCARETASK RECORDS.
const getNestedMatch = (items, firstID, comparator, secondID) => {
	if (isEmptyArray(items)) return {};
	if (isEmptyObj(comparator)) return {};
	const initialMatch = items.reduce((all, item) => {
		if (item[firstID] === comparator[firstID]) {
			all = item;
			return all;
		}
		return all;
	});
	return getMatch(initialMatch?.ShiftTasks, secondID, comparator);
};

// accepts the current route as a string and finds the last entry
// ie "dashboard/daily/details/Ambulation" will return "Ambulation"
const getRoute = route => {
	if (isEmptyVal(route)) return;
	const split = route.split("/");
	const { length } = split;
	return split[length - 1];
};

// checking status's for scheduled, unscheduled and subtasks.
export { isCompleted, isMissedEvent };

export {
	mergeCompletedCounts,
	getCompletedCount,
	getPercentage,
	getAvg,
	getRemaining,
	getCount,
	getCountByProp,
	addEllipsis,
	replaceNullWithMsg,
	getRandomNumArbitrary,
	getIsCompletedCount
};
// handles splitting the url string to get the Details view's adl route
export { getRoute };

// SORTING & FILTERING UTILS
export { groupBy, matchByID, getMatch, getNestedMatch };
