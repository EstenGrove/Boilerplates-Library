import { removeFalseys } from "./utils_types";
import { isPastDue, isCompleted } from "./utils_tasks";

const getStatusID = (status) => {
	switch (status) {
		case "PENDING":
			return 1;
		case "COMPLETE":
			return 2;
		case "MISSED-EVENT":
			return 3;
		case "NOT-COMPLETE":
			return 4;
		case "IN-PROGRESS":
			return 5;
		default:
			return 4;
	}
};

const getStatusNameFromID = (id) => {
	switch (id) {
		case 1:
			return "PENDING";
		case 2:
			return "COMPLETE";
		case 3:
			return "MISSED-EVENT";
		case 4:
			return "NOT-COMPLETE";
		case 5:
			return "IN-PROGRESS";
		default:
			return "PENDING";
	}
};

/**
 * @description - Provides a list of active 'status filters' based off current user-selections.
 * @param {Object} values - A 'useForm's formState.values instance containing all stateful status filters.
 * @param {Function} setter - A custom state setter used to update the 'statusFilters' list.
 * @param {Array} statusList - An array of string-form task status types.
 * @returns {Array} - Returns an array of current status filters.
 * - Used for the DailyView's task status filters.
 */
const getStatusFilters = (
	values,
	setter,
	statusList = [`COMPLETE`, `NOT-COMPLETE`, `PAST-DUE`, `EXCEPTIONS`]
) => {
	return setter(
		removeFalseys(
			statusList.map((x) => {
				if (values[x]) {
					return x;
				}
				return null;
			})
		)
	);
};

// FOR PAST DUE UPDATES
const getPastDueTaskStatus = (task, dueDate = new Date(), shiftTimes = []) => {
	if (isPastDue(task, dueDate, shiftTimes)) {
		return `PAST-DUE`;
	} else {
		return isCompleted(task) ? `COMPLETE` : `PAST-DUE`;
	}
};

export { getStatusID, getStatusNameFromID };

export { getStatusFilters };

export { getPastDueTaskStatus };
