const dbBase = {
  "db-meta": "Advantage"
};

/**
 * @description - A request utility for setting the request params for all CRUD request functions.
 * Covers requests for CRUD including: CREATE, READ, UPDATE, DELETE
 * Params are categorized and named by request entity type (ie scheduledTask, unscheduledSubtask etc.)
 * @example requestParams.unscheduledTask
 */
const requestParams = {
  scheduledTask: {
    ...dbBase,
    source: "AssessmentTrackingTask"
  },
  scheduledSubtask: {
    ...dbBase,
    source: "AssessmentTrackingTaskShiftSubTask"
  },
  scheduledNote: {
    ...dbBase,
    source: "AssessmentTrackingTaskNote"
  },
  scheduledShift: {
    ...dbBase,
    source: "AssessmentTrackingTaskShift"
  },
  unscheduledTask: {
    ...dbBase,
    source: "AssessmentUnscheduleTask"
  },
  unscheduledSubtask: {
    ...dbBase,
    source: "AssessmentUnscheduleTaskShiftSubTask"
  },
  unscheduledNote: {
    ...dbBase,
    source: "AssessmentUnscheduleTaskNote"
  },
  unscheduledShift: {
    ...dbBase,
    source: "AssessmentUnscheduleTaskShift"
  },
  genericCount: {
    residents: {
      ...dbBase,
      source: "Residents"
    },
    scheduledTasks: {
      ...dbBase,
      source: "AssessmentTrackingTask"
    },
    unscheduledTasks: {
      ...dbBase,
      source: "AssessmentUnscheduleTask"
    },
    adls: {
      ...dbBase,
      source: "AssessmentCategory"
    }
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

const { genericCount } = requestParams;

// SCHEDULED TASK - RELATED
export { scheduledTask, scheduledSubtask, scheduledNote, scheduledShift };

// UNSCHEDULED TASK - RELATED
export {
  unscheduledTask,
  unscheduledSubtask,
  unscheduledNote,
  unscheduledShift
};

export { genericCount };

export { requestParams };
