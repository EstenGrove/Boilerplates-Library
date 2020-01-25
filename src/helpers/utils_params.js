/**
 * @description - A request utility for setting the request params for all CRUD request functions.
 * Covers requests for CRUD including: CREATE, READ, UPDATE, DELETE
 * Params are categorized and named by request entity type (ie scheduledTask, unscheduledSubtask etc.)
 * @example requestParams.unscheduledTask
 */
const requestParams = {
	scheduledTask: {
		"db-meta": "Advantage",
		source: "AssessmentTrackingTask"
	},
	scheduledSubtask: {
		"db-meta": "Advantage",
		source: "AssessmentTrackingTaskShiftSubTask"
	},
	scheduledNote: {
		"db-meta": "Advantage",
		source: "AssessmentTrackingTaskNote"
	},
	scheduledShift: {
		"db-meta": "Advantage",
		source: "AssessmentTrackingTaskShift"
	},
	unscheduledTask: {
		"db-meta": "Advantage",
		source: "AssessmentUnscheduleTask"
	},
	unscheduledSubtask: {
		"db-meta": "Advantage",
		source: "AssessmentUnscheduleTaskShiftSubTask"
	},
	unscheduledNote: {
		"db-meta": "Advantage",
		source: "AssessmentUnscheduleTaskNote"
	},
	unscheduledShift: {
		"db-meta": "Advantage",
		source: "AssessmentUnscheduleTaskShift"
	}
};
// SCHEDULED TASK - RELATED
const {
	scheduledTask,
	scheduledSubtask,
	scheduledNote,
	scheduledShift
} = requestParams;

// UNSCHEDULED TASK - RELATED
const {
	unscheduledTask,
	unscheduledSubtask,
	unscheduledNote,
	unscheduledShift
} = requestParams;

// SCHEDULED TASK - RELATED
export { scheduledTask, scheduledSubtask, scheduledNote, scheduledShift };

// UNSCHEDULED TASK - RELATED
export {
	unscheduledTask,
	unscheduledSubtask,
	unscheduledNote,
	unscheduledShift
};

export { requestParams };
