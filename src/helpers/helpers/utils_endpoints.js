/**
 * Update Endpoint & ENV Variables 6/2 at 8:00 AM
 * Azure ENV Endpoint: https://ala-api.azurewebsites.net
 */
const endpoints = {
	base: "https://apitest.aladvantage.com/alaservices/v1/",
	auth: {
		login: "Security/Login",
		logout: "Security/Logout",
		loginStatus: "Security/LoginValid",
		validateToken: "Security/SecurityTokenValid",
		refreshToken: "Security/SecurityTokenRefresh",
		sessionDetails: "Security/GetSecurityTokenDetail",
		userAccessByID: "Security/GetUserAccess",
		userAccessByEmail: "Security/GetUserAccessByEmail",
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
		getContacts: "Advantage/GetContacts",
		getProfile: "Resident/GetResidentProfile",
		getLOA: "Advantage/GetLeaveOfAbsence",
		getMeds: "Advantage/GetMedications",
		getInventory: "Advantage/GetResidentInventory",
		getResidentBM: "Advantage/GetResidentBowelMovements",
		getResidentWeight: "Advantage/GetResidentWeight",
		forTracker: {
			byDay: "Resident/GetResidentDayForAdvantageTracker",
			byWeek: "Resident/GetResidentWeekForAdvantageTracker",
			byDayMaster: "Resident/GetResidentDayAssessmentMaster",
			byWeekMaster: "Resident/GetResidentWeekAssessmentMaster",
			byDayDetails: "Resident/GetResidentDayAssessmentDetails",
			byWeekDetails: "Resident/GetResidentDayAssessmentDetails",
		},
		// for adl shift schedule (ie shifts per adl)
		adlSchedule: {
			getSchedule: "Advantage/GetAssessmentResidentAdlShift",
			saveScheduleMany: "Resident/UpdateResidentsAdlShifts",
			getAdlShiftChanges: "Facility/GetFacilityAdlShifts",
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
			generatedTasks: "Resident/DeleteResidentTrackingTasks",
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
		byFacility: "Community/GetCommunityPastDueTasks",
		byResident: "Resident/GetResidentPastDueTasks",
	},
	reassess: {
		updateSingle: "Advantage/UpdateAssessmentTrackingReassess",
		updateMany: "Advantage/UpdateAssessmentTrackingReassessMany",
		saveReassess: "Advantage/SaveAssessmentTrackingReassess",
		saveReassessMany: "Advantage/SaveAssessmentTrackingReassessMany",
	},
	user: {
		getProfile: "Security/GetUserProfile",
		getProfileByEmail: "Security/GetUserProfileByEmail",
	},
	reports: {
		getInfo: "Reports/GetReportInformation",
		executeReport: "Reports/ExecuteReport",
		executeReportAsync: "Reports/ExecuteReportAsync",
		// daily reports APIs
		getDailyExceptions: "Community/GetDailyExceptionTasks",
		getDailyCompletions: "Community/GetDailyCompletionTasks",
		getDailyTaskCreatedReport: "Assessment/GetUnscheduleTasks",
		getDailyReassessReport: "Assessment/GetReassessTasks",
		getDailyServicePlanReport: "Assessment/GetServicePlans",
		getPastDueReportByFacility: "Community/GetCommunityPastDueTasks",
		getPastDueReportByResident: "Resident/GetResidentPastDueTasks",
		// historical report APIs
		getHistoricalTaskCreated: "Assessment/GetUnscheduleTasks",
		getHistoricalReassess: "Assessment/GetReassessTasks",
		getHistoricalServicePlan: "Assessment/GetServicePlans",
		getHistoricalActualTime: "ENDPOINT-TBD",
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
		getFacilities: {
			byUser: "Community/GetCommunitiesByUser",
			byUserEmail: "Community/GetCommunitiesByUserEmail",
		},
		exceptions: {
			getExceptionType: "Advantage/GetAssessmentFacilityException",
			saveExceptionType: "Advantage/SaveAssessmentFacilityException",
			saveExceptionTypeMany: "Advantage/SaveAssessmentFacilityExceptionMany",
			deleteExceptionType: "Advantage/DeleteAssessmentFacilityException",
			deleteExceptionTypeMany:
				"Advantage/DeleteAssessmentFacilityExceptionMany",
		},
	},
	exceptions: {
		// 'AssessmentException' table (ie global)
		byAssessment: {
			saveException: "Advantage/SaveAssessmentException",
			saveExceptionMany: "Advantage/SaveAssessmentExceptionMany",
		},
		// 'AssessmentFacilityException' table (ie by facility)
		byFacility: {
			getException: "Advantage/GetAssessmentFacilityException",
			saveException: "Advantage/SaveAssessmentFacilityException",
			saveExceptionMany: "Advantage/SaveAssessmentFacilityExceptionMany",
			deleteException: "Advantage/DeleteAssessmentFacilityException",
			deleteExceptionMany: "Advantage/DeleteAssessmentFacilityExceptionMany",
		},
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
	facility: { getFacilities },
	facility,
	exceptions,
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
	exceptions,
	getFacilities,
};
