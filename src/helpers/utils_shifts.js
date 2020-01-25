const findShiftID = shift => {
	if (shift === "AM") return 1;
	if (shift === "PM") return 2;
	if (shift === "NOC") return 3;
	return 4;
};

const findShiftName = id => {
	if (id === 1) return "AM";
	if (id === 2) return "PM";
	if (id === 3) return "NOC";
	return "ANY"; // really means ALL = 4
};

const handleShiftLabel = (task, shift) => {
	if (task.ADLCategory === "Meals" && shift.AssessmentShiftId === 1)
		return "Breakfast";
	if (task.ADLCategory === "Meals" && shift.AssessmentShiftId === 2)
		return "Lunch";
	if (task.ADLCategory === "Meals" && shift.AssessmentShiftId === 3)
		return "Dinner";
	if (task.ADLCategory === "Meals" && shift.AssessmentShiftId === 4)
		return "Any";
	return findShiftName(shift.AssessmentShiftId);
};

export { findShiftID, findShiftName, handleShiftLabel };
