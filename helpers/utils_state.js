import { handleEmpties } from "./utils_types";

const populateState = (data, state) => {
	const {
		ADL,
		ADLCareTask,
		ADLCareTaskHistory,
		ADLCareTaskFuture,
		ADLCareLevel,
		Resident,
		ResidentId,
		AssessmentTrackingTask,
		Charts,
		Vitals,
		UnscheduledTasks,
		ADLCategory
		// AssessmentTask,
		// AssessmentTracking,
	} = data;
	const [resident] = Resident;

	const newState = {
		...state,
		globals: {
			...state.globals,
			currentResident: {
				...resident,
				ResidentId: ResidentId
			},
			adlDescriptions: handleEmpties(ADL),
			unscheduledTasks: handleEmpties(UnscheduledTasks),
			scheduledTasks: handleEmpties(ADLCareTask),
			scheduledTasksHistory: handleEmpties(ADLCareTaskHistory),
			scheduledTasksFuture: handleEmpties(ADLCareTaskFuture),
			trackingTasks: handleEmpties(AssessmentTrackingTask),
			categories: handleEmpties(ADLCareLevel),
			activeCategories: handleEmpties(ADLCategory),
			charting: handleEmpties(Charts),
			vitals: handleEmpties(Vitals)
		}
	};

	return { ...newState };
};

export { populateState };
