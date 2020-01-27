// scheduledTasks.save.task
// scheduledTasks.get.task
// unscheduledTasks.update.task
// unscheduledTasks.delete.taskMany

const endpoints = {
  base: "https://apitest.aladvantage.com/alaservices/v1/",
  auth: {
    login: "Security/Login",
    logout: "Security/Logout",
    loginStatus: "Security/LoginValid"
  },
  generic: {
    count: "Data/Count",
    get: "Data/Get",
    get2: "Data/Get2",
    delete: "Data/Delete",
    execute: "Data/Execute",
    insert: "Data/Insert",
    save: "Data/Save",
    update: "Data/Update"
  },
  uploads: {
    upload: "Upload/PutFile",
    uploadMany: "Upload/PutFileMany",
    saveFileRegistry: "Upload/SaveFileRegistry",
    saveFileRegistryMany: "Upload/SaveFileRegistryMany"
  },
  downloads: {
    getFile: "Download/GetFile",
    getFileMany: "Download/GetFileMany",
    getFileRegistry: {
      byUser: "Download/GetFileRegistryByUser",
      byResident: "Download/GetFileRegistryByResident",
      byFacility: "Download/GetFileRegistryByFacility",
      byMeta: "Download/GetFileRegistryByMeta"
    }
  },
  residents: {
    getResidents: "Advantage/GetResidents",
    byUser: "Resident/GetResidentsByUser",
    byUserEmail: "Resident/GetResidentsByUserEmail"
  },
  residentData: {
    getPhotos: "Advantage/GetResidentPhotos",
    getSummary: "Advantage/GetSummary",
    getAssessment: "Resident/GetResidentAssessment",
    getProfile: "Resident/GetResidentProfile",
    forTracker: {
      original: "Resident/GetResidentForAdvantageTracker",
      byDay: "Resident/GetResidentDayForAdvantageTracker",
      byWeek: "Resident/GetResidentWeekForAdvantageTracker"
    }
  },
  assessmentTracking: {
    save: "Advantage/SaveAssessmentTracking",
    update: "Advantage/UpdateAssessmentTracking"
  },
  scheduledTasks: {
    // ASSESSMENT TRACKING TASK RECORDS = SCHEDULED TASKS
    get: {
      task: "Advantage/GetAssessmentTrackingTask",
      task2: "Advantage/GetAssessmentTrackingTask2",
      subTask: "Advantage/GetAssessmentTrackingTaskSubTask", // DEPRECATED
      subTask2: "Advantage/GetAssessmentTrackingTaskSubTask2", // DEPRECATED
      shiftSubTask: "Advantage/GetAssessmentTrackingTaskShiftSubTask",
      shiftSubTask2: "Advantage/GetAssessmentTrackingTaskShiftSubTask2",
      note: "Advantage/GetAssessmentTrackingTaskNote",
      note2: "Advantage/GetAssessmentTrackingTaskNote2"
    },
    update: {
      task: "Advantage/UpdateAssessmentTrackingTask",
      taskMany: "Advantage/UpdateAssessmentTrackingTaskMany",
      subTask: "Advantage/UpdateAssessmentTrackingTaskSubTask", // DEPRECATED
      subTaskMany: "Advantage/UpdateAssessmentTrackingTaskSubTaskMany", // DEPRECATED
      shiftSubTask: "Advantage/UpdateAssessmentTrackingTaskShiftSubTask",
      shiftSubTaskMany:
        "Advantage/UpdateAssessmentTrackingTaskShiftSubTaskMany",
      note: "Advantage/UpdateAssessmentTrackingTaskNote",
      noteMany: "Advantage/UpdateAssessmentTrackingTaskNoteMany"
    },
    save: {
      task: "Advantage/SaveAssessmentTrackingTask",
      taskMany: "Advantage/SaveAssessmentTrackingTaskMany",
      subTask: "Advantage/SaveAssessmentTrackingTaskSubTask", // DEPRECATED
      subTaskMany: "Advantage/SaveAssessmentTrackingTaskSubTaskMany", // DEPRECATED
      shiftSubTask: "Advantage/SaveAssessmentTrackingTaskShiftSubTask",
      shiftSubTaskMany: "Advantage/SaveAssessmentTrackingTaskShiftSubTaskMany",
      note: "Advantage/SaveAssessmentTrackingTaskNote",
      noteMany: "Advantage/SaveAssessmentTrackingTaskNoteMany"
    },
    delete: {
      task: "Advantage/DeleteAssessmentTrackingTask",
      taskMany: "Advantage/DeleteAssessmentTrackingTaskMany",
      subTask: "Advantage/DeleteAssessmentTrackingTaskSubTask", // DEPRECATED
      subTaskMany: "Advantage/DeleteAssessmentTrackingTaskSubTaskMany", // DEPRECATED
      shiftSubTask: "Advantage/DeleteAssessmentTrackingTaskShiftSubTask",
      shiftSubTaskMany:
        "Advantage/DeleteAssessmentTrackingTaskShiftSubTaskMany",
      note: "Advantage/DeleteAssessmentTrackingTaskNote",
      noteMany: "Advantage/DeleteAssessmentTrackingTaskNoteMany"
    },
    insert: {
      task: "Advantage/InsertAssessmentTrackingTask",
      taskMany: "Advantage/InsertAssessmentTrackingTaskMany",
      subTask: "Advantage/InsertAssessmentTrackingTaskSubTask", // DEPRECATED
      subTaskMany: "Advantage/InsertAssessmentTrackingTaskSubTaskMany", // DEPRECATED
      shiftSubTask: "Advantage/InsertAssessmentTrackingTaskShiftSubTask",
      shiftSubTaskMany:
        "Advantage/InsertAssessmentTrackingTaskShiftSubTaskMany",
      note: "Advantage/InsertAssessmentTrackingTaskNote",
      noteMany: "Advantage/InsertAssessmentTrackingTaskNoteMany"
    },
    count: {
      task: "Advantage/CountAssessmentTrackingTask",
      task2: "Advantage/CountAssessmentTrackingTask2",
      subTask: "Advantage/CountAssessmentTrackingTaskSubTask", // DEPRECATED
      subTask2: "Advantage/CountAssessmentTrackingTaskSubTask2", // DEPRECATED
      shiftSubTask: "Advantage/CountAssessmentTrackingTaskShiftSubTask",
      shiftSubTask2: "Advantage/CountAssessmentTrackingTaskShiftSubTask2",
      note: "Advantage/CountAssessmentTrackingTaskNote",
      note2: "Advantage/CountAssessmentTrackingTaskNote2"
    }
  },
  unscheduledTasks: {
    get: {
      task: "Advantage/GetAssessmentUnscheduleTask",
      task2: "Advantage/GetAssessmentUnscheduleTask2",
      subTask: "Advantage/GetAssessmentUnscheduleTaskSubTask", // DEPRECATED
      subTask2: "Advantage/GetAssessmentUnscheduleTaskSubTask2", // DEPRECATED
      shiftSubTask: "Advantage/GetAssessmentUnscheduleTaskShiftSubTask",
      shiftSubTask2: "Advantage/GetAssessmentUnscheduleTaskShiftSubTaskMany",
      note: "Advantage/GetAssessmentUnscheduleTaskNote",
      note2: "Advantage/GetAssessmentUnscheduleTaskNote2"
    },
    update: {
      task: "Advantage/UpdateAssessmentUnscheduleTask",
      taskMany: "Advantage/UpdateAssessmentUnscheduleTaskMany",
      subTask: "Advantage/UpdateAssessmentUnscheduleTaskSubTask", // DEPRECATED
      subTaskMany: "Advantage/UpdateAssessmentUnscheduleTaskSubTaskMany", // DEPRECATED
      shiftSubTask: "Advantage/UpdateAssessmentUnscheduleTaskShiftSubTask",
      shiftSubTaskMany:
        "Advantage/UpdateAssessmentUnscheduleTaskShiftSubTaskMany",
      note: "Advantage/UpdateAssessmentUnscheduleTaskNote",
      noteMany: "Advantage/UpdateAssessmentUnscheduleTaskNoteMany"
    },
    save: {
      task: "Advantage/SaveAssessmentUnscheduleTask",
      taskMany: "Advantage/SaveAssessmentUnscheduleTaskMany",
      subTask: "Advantage/SaveAssessmentUnscheduleTaskSubTask", // DEPRECATED
      subTaskMany: "Advantage/SaveAssessmentUnscheduleTaskSubTaskMany", // DEPRECATED
      shiftSubTask: "Advantage/SaveAssessmentUnscheduleTaskShiftSubTask",
      shiftSubTaskMany:
        "Advantage/SaveAssessmentUnscheduleTaskShiftSubTaskMany",
      note: "Advantage/SaveAssessmentUnscheduleTaskNote",
      noteMany: "Advantage/SaveAssessmentUnscheduleTaskNoteMany"
    },
    delete: {
      task: "Advantage/DeleteAssessmentUnscheduleTask",
      taskMany: "Advantage/DeleteAssessmentUnscheduleTaskMany",
      subTask: "Advantage/DeleteAssessmentUnscheduleTaskSubTask", // DEPRECATED
      subTaskMany: "Advantage/DeleteAssessmentUnscheduleTaskSubTask", // DEPRECATED
      shiftSubTask: "Advantage/DeleteAssessmentUnscheduleTaskShiftSubTask",
      shiftSubTaskMany:
        "Advantage/DeleteAssessmentUnscheduleTaskShiftSubTaskMany",
      note: "Advantage/DeleteAssessmentUnscheduleTaskNote",
      noteMany: "Advantage/DeleteAssessmentUnscheduleTaskNote"
    },
    insert: {
      task: "Advantage/InsertAssessmentUnscheduleTask",
      taskMany: "Advantage/InsertAssessmentUnscheduleTaskMany",
      subTask: "Advantage/InsertAssessmentUnscheduleTaskSubTask", // DEPRECATED
      subTaskMany: "Advantage/InsertAssessmentUnscheduleTaskSubTaskMany", // DEPRECATED
      shiftSubTask: "Advantage/InsertAssessmentUnscheduleTaskShiftSubTask",
      shiftSubTaskMany:
        "Advantage/InsertAssessmentUnscheduleTaskShiftSubTaskMany",
      note: "Advantage/InsertAssessmentUnscheduleTaskNote",
      noteMany: "Advantage/InsertAssessmentUnscheduleTaskNoteMany"
    },
    count: {
      task: "Advantage/CountAssessmentUnscheduleTask",
      task2: "Advantage/CountAssessmentUnscheduleTask2",
      subTask: "Advantage/CountAssessmentUnscheduleTaskSubTask", // DEPRECATED
      subTask2: "Advantage/CountAssessmentUnscheduleTaskSubTask2", // DEPRECATED
      shiftSubTask: "Advantage/CountAssessmentUnscheduleTaskShiftSubTask",
      shiftSubTask2: "Advantage/CountAssessmentUnscheduleTaskShiftSubTask2",
      note: "Advantage/CountAssessmentUnscheduleTaskNote",
      note2: "Advantage/CountAssessmentUnscheduleTaskNote2"
    }
  },
  reassess: {
    updateSingle: "Advantage/UpdateAssessmentTrackingReassess",
    updateMany: "Advantage/UpdateAssessmentTrackingReassessMany"
  },
  user: {
    getProfile: "Security/GetUserProfile",
    getProfileByEmail: "Security/GetUserProfileByEmail"
  },
  reports: {
    getInfo: "Reports/GetReportInformation",
    executeReport: "Reports/ExecuteReport"
  }
};

const {
  auth,
  generic,
  uploads,
  downloads,
  downloads: { getFileRegistry },
  residents,
  residentData,
  residentData: { forTracker },
  assessmentTracking,
  scheduledTasks,
  unscheduledTasks,
  reassess,
  user,
  reports
} = endpoints;

const baseParams = {
  "db-meta": "Advantage",
  source: ""
};

export {
  auth,
  generic,
  uploads,
  downloads,
  getFileRegistry,
  residents,
  residentData,
  forTracker,
  assessmentTracking,
  scheduledTasks,
  unscheduledTasks,
  reassess,
  user,
  reports
};
