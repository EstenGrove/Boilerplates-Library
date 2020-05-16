const endpoints = {
	base: "https://apitest.aladvantage.com/alaservices/v1/",
	auth: {
		login: "Security/Login",
		logout: "Security/Logout",
		loginStatus: "Security/LoginValid",
	},
	generic: {
		count: "Data/Count",
		get: "Data/Get",
		get2: "Data/Get2",
		delete: "Data/Delete",
		execute: "Data/Execute",
		insert: "Data/Insert",
		save: "Data/Save",
		update: "Data/Update",
	},
	uploads: {
		upload: "Upload/PutFile",
		uploadMany: "Upload/PutFileMany",
		saveFileRegistry: "Upload/SaveFileRegistry",
		saveFileRegistryMany: "Upload/SaveFileRegistryMany",
	},
	downloads: {
		getFile: "Download/GetFile",
		getFileMany: "Download/GetFileMany",
		getFileRegistry: {
			byUser: "Download/GetFileRegistryByUser",
			byResident: "Download/GetFileRegistryByResident",
			byFacility: "Download/GetFileRegistryByFacility",
			byMeta: "Download/GetFileRegistryByMeta",
		},
	},
	residents: {
		getResidents: "Advantage/GetResidents",
		byUser: "Resident/GetResidentsByUser",
		byUserEmail: "Resident/GetResidentsByUserEmail",
	},
	residentData: {
		getPhotos: "Advantage/GetResidentPhotos",
		getSummary: "Advantage/GetSummary",
		getAssessment: "Resident/GetResidentAssessment",
		getProfile: "Resident/GetResidentProfile",
		getLOA: "Advantage/GetLeaveOfAbsence",
		getMeds: "Advantage/GetMedications",
		getInventory: "Advantage/GetResidentInventory",
		getResidentBM: "Advantage/GetResidentBowelMovements",
		getResidentWeight: "Advantage/GetResidentWeight",
		forTracker: {
			DEPRECATED_API_byDay: "Resident/GetResidentForAdvantageTracker", // DEPRECATED ENDPOINT
			byDay: "Resident/GetResidentDayForAdvantageTracker",
			byWeek: "Resident/GetResidentWeekForAdvantageTracker",
		},
		// for adl shift schedule (ie shifts per adl)
		adlSchedule: {
			getSchedule: "Advantage/GetAssessmentResidentAdlShift",
			saveScheduleMany: "Resident/UpdateResidentsAdlShifts",
			getAdlShiftChanges: "Facility/GetFacilityAdlShifts",
			DEPRECATED_API_save: "Advantage/SaveAssessmentResidentAdlShift", // deprecated
			DEPRECATED_API_saveMany: "Advantage/SaveAssessmentResidentAdlShiftMany", // deprecated
		},
	},
	assessmentTracking: {
		save: "Advantage/SaveAssessmentTracking",
		update: "Advantage/UpdateAssessmentTracking",
	},
	scheduledTasks: {
		// ASSESSMENT TRACKING TASK RECORDS = SCHEDULED TASKS
		get: {
			task: "Advantage/GetAssessmentTrackingTask",
			task2: "Advantage/GetAssessmentTrackingTask2",
		},
		update: {
			task: "Advantage/UpdateAssessmentTrackingTask",
			taskMany: "Advantage/UpdateAssessmentTrackingTaskMany",
		},
		// PRIMARY UPDATE ENDPOINTS
		save: {
			task: "Advantage/SaveAssessmentTrackingTask",
			taskMany: "Advantage/SaveAssessmentTrackingTaskMany",
		},
		delete: {
			task: "Advantage/DeleteAssessmentTrackingTask",
			taskMany: "Advantage/DeleteAssessmentTrackingTaskMany",
		},
		insert: {
			task: "Advantage/InsertAssessmentTrackingTask",
			taskMany: "Advantage/InsertAssessmentTrackingTaskMany",
		},
		count: {
			task: "Advantage/CountAssessmentTrackingTask",
			task2: "Advantage/CountAssessmentTrackingTask2",
		},
	},
	unscheduledTasks: {
		get: {
			task: "Advantage/GetAssessmentUnscheduleTask",
			task2: "Advantage/GetAssessmentUnscheduleTask2",
		},
		update: {
			task: "Advantage/UpdateAssessmentUnscheduleTask",
			taskMany: "Advantage/UpdateAssessmentUnscheduleTaskMany",
		},
		// PRIMARY UPDATE ENDPOINTS - USE *IN-PLACE-OF* "UPDATE" ROUTES
		save: {
			task: "Advantage/SaveAssessmentUnscheduleTask",
			taskMany: "Advantage/SaveAssessmentUnscheduleTaskMany",
		},
		delete: {
			task: "Advantage/DeleteAssessmentUnscheduleTask",
			taskMany: "Advantage/DeleteAssessmentUnscheduleTaskMany",
		},
		insert: {
			task: "Advantage/InsertAssessmentUnscheduleTask",
			taskMany: "Advantage/InsertAssessmentUnscheduleTaskMany",
		},
		count: {
			task: "Advantage/CountAssessmentUnscheduleTask",
			task2: "Advantage/CountAssessmentUnscheduleTask2",
		},
	},
	pastDue: {
		get: "Community/GetCommunityPastDueTasks",
	},
	reassess: {
		updateSingle: "Advantage/UpdateAssessmentTrackingReassess",
		updateMany: "Advantage/UpdateAssessmentTrackingReassessMany",
	},
	user: {
		getProfile: "Security/GetUserProfile",
		getProfileByEmail: "Security/GetUserProfileByEmail",
	},
	reports: {
		getInfo: "Reports/GetReportInformation",
		executeReport: "Reports/ExecuteReport",
		executeReportAsync: "Reports/ExecuteReportAsync",
		getTaskCreatedReport: "Assessment/GetUnscheduleTasks",
		getReassessReport: "Assessment/GetReassessTasks",
		getServicePlanReport: "Assessment/GetServicePlans",
		getPastDueReport: "Community/GetCommunityPastDueTasks",
	},
	// UPDATE FACILITY'S SHIFT TIMES (START/END TIME)
	shiftTimes: {
		getShiftTimes: "Advantage/GetAssessmentFacilityShift",
		getShiftTimes2: "Advantage/GetAssessmentFacilityShift2", // "POST" TYPE
		saveShiftTimes: "Advantage/SaveAssessmentFacilityShift",
		saveShiftTimesMany: "Advantage/SaveAssessmentFacilityShiftMany",
	},
	facility: {
		getCategories: "Advantage/GetAssessmentCategory",
		getShifts: "Advantage/GetAssessmentShift",
	},
};

const {
	auth,
	generic,
	uploads,
	downloads,
	downloads: { getFileRegistry },
	residents,
	residentData,
	residentData: { forTracker, adlSchedule },
	assessmentTracking,
	scheduledTasks,
	unscheduledTasks,
	pastDue,
	reassess,
	user,
	reports,
	shiftTimes,
	facility,
} = endpoints;

export {
	endpoints,
	auth, // login, logout, checkLoginStatus
	generic, // get, save, delete, update
	uploads,
	downloads, // download single, download many
	getFileRegistry,
	residents,
	residentData,
	forTracker,
	adlSchedule, // resident adl schedule (bulk or single resident)
	assessmentTracking,
	scheduledTasks,
	unscheduledTasks,
	pastDue,
	reassess,
	user,
	reports,
	shiftTimes, // by facility
	facility,
};
