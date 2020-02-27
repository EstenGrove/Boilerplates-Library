import { isEmptyArray } from "./utils_types.js";

const sortPastDueRecords = records => {
	if (isEmptyArray(records)) return [];
	return records.sort((a, b) => {
		return a.Resident[0].ResidentLastName.localeCompare(
			b.Resident[0].ResidentLastName
		);
	});
};

const countPastDueRecords = records => {
	const iteratee = x => x.Resident[0].ResidentLastName;
	return records.reduce((all, item) => {
		const keyToGroupBy = iteratee(item);
		if (!item[keyToGroupBy]) {
			all[keyToGroupBy] = {};
		}
		all[keyToGroupBy] = item.PastDueScheduleTask.length;
		return all;
	}, {});
};

export { sortPastDueRecords, countPastDueRecords };
