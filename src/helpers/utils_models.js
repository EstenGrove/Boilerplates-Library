import { isEmptyArray } from "./utils_types";
import { getShiftID } from "./utils_shifts";
import { getCategoryID } from "./utils_categories";

/////////////////////////////////////////////////////////////
///////////////////// UNSCHEDULED TASKS /////////////////////
/////////////////////////////////////////////////////////////

class UnscheduledTaskModel {
	constructor() {
		this._model = {
			AssessmentUnscheduleTaskId: 0,
			ResidentId: 0,
			AssessmentCategoryId: 14,
			AssessmentTaskId: null,
			AssessmentReasonId: 1,
			AssessmentPriorityId: 3,
			CompletedAssessmentShiftId: null,
			AssessmentResolutionId: 3,
			AssessmentTaskStatusId: 4,
			UserId: "",
			EntryDate: new Date().toUTCString(),
			CompletedDate: new Date().toUTCString(),
			FollowUpDate: new Date().toUTCString(),
			SignedBy: "",
			InitialBy: "",
			Notes: "",
			IsCompleted: false,
			IsFinal: false,
			IsActive: true,
			CreatedDate: new Date().toUTCString(),
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
			Description: "",
			AudioPath: "",
			VideoPath: "",
			// RECURRING TASK FIELDS //
			AssessmentShiftId: null,
			AssessmentRecurringId: null,
			RecurringMon: false,
			RecurringTue: false,
			RecurringWed: false,
			RecurringThu: false,
			RecurringFri: false,
			RecurringSat: false,
			RecurringSun: false,
			RecurringAMShiftId: null,
			RecurringPMShiftId: null,
			RecurringNOCShiftId: null,
			RecurringStartDate: null,
			RecurringEndDate: null,
			RecurringDescription: null,
		};
	}
	getProperty(prop) {
		return this._model[prop];
	}
	getModel() {
		return this._model;
	}
	setProperty(prop, val) {
		return (this._model[prop] = val);
	}
}

// UNSCHEDULED SHIFT
class UnscheduledTaskShiftModel {
	constructor() {
		this._model = {
			AssessmentUnscheduleTaskShiftId: 0,
			AssessmentUnscheduleTaskId: 0,
			AssessmentShiftId: 0,
			Notes: "",
			IsCheck: true,
			IsActive: true,
			CreatedDate: "",
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
		};
	}
	getProperty(prop) {
		return this._model[prop];
	}
	getModel() {
		return this._model;
	}
	setProperty(val, prop) {
		return (this._model[prop] = val);
	}
}

// UNSCHEDULED SHIFT SUB TASK
class UnscheduledSubTaskModel {
	constructor() {
		this._model = {
			AssessmentUnscheduleTaskShiftSubTaskId: 0,
			AssessmentUnscheduleTaskShiftId: 0,
			AssessmentUnscheduleTaskId: 0,
			AssessmentCategoryId: 0,
			AssessmentTaskId: 0,
			AssessmentReasonId: 0,
			AssessmentResolutionId: 0,
			AssessmentTaskStatusId: 0,
			AssessmentPriorityId: 0,
			Notes: "",
			Description: "",
			IsCheck: true,
			IsCompleted: true,
			IsFinal: true,
			IsActive: true,
			SignedBy: "",
			InitialBy: "",
			UserId: "",
			EntryDate: "",
			CompletedDate: "",
			FollowUpDate: "",
			CreatedDate: "",
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
		};
	}
	getProperty(prop) {
		return this._model[prop];
	}
	getModel() {
		return this._model;
	}
	setProperty(val, prop) {
		return (this._model[prop] = val);
	}
}

// UNSCHEDULED NOTE
class UnscheduledTaskNoteModel {
	constructor() {
		this._model = {
			AssessmentUnscheduleTaskNoteId: 0,
			AssessmentUnscheduleTaskId: 0,
			Notes: "",
			IsActive: true,
			EntryDate: "",
			EntryUserId: "",
			InitialBy: "",
			CreatedDate: "",
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
		};
	}
	getProperty(prop) {
		return this._model[prop];
	}
	getModel() {
		return this._model;
	}
	setProperty(val, prop) {
		return (this._model[prop] = val);
	}
}

///////////////////////////////////////////////////////////////
/////////////////////// SCHEDULED TASKS ///////////////////////
///////////////////////////////////////////////////////////////

// SCHEDULED TASK
class ScheduledTaskModel {
	constructor() {
		this.model = {
			AssessmentTrackingTaskId: 0,
			AssessmentTrackingId: 0,
			AssessmentTaskId: 0,
			AssessmentReasonId: 0,
			CompletedAssessmentShiftId: 0,
			AssessmentResolutionId: 0,
			AssessmentTaskStatusId: 0,
			AssessmentPriorityId: 0,
			Notes: "",
			Description: "",
			IsCompleted: false,
			IsFinal: false,
			IsActive: true,
			CompletedDate: "",
			FollowUpDate: "",
			SignedBy: "",
			InitialBy: "",
			AudioPath: "",
			VideoPath: "",
			UserId: "",
			EntryDate: "",
			CreatedDate: "",
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
		};
	}
	getModel() {
		return this._model;
	}
	getProperty(prop) {
		return this._model[prop];
	}
	setProperty(prop, val) {
		return (this._model[prop] = val);
	}
}

// SCHEDULED SHIFT
class ScheduledTaskShiftModel {
	constructor() {
		this._model = {
			AssessmentTrackingTaskShiftId: 0,
			AssessmentTrackingTaskId: 0,
			AssessmentShiftId: 0,
			AssessmentTrackingId: 0,
			Notes: "",
			IsCheck: true,
			IsActive: true,
			CreatedDate: "",
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
		};
	}
	getModel() {
		return this._model;
	}
	getProperty(prop) {
		return this._model[prop];
	}
	setProperty(prop, val) {
		return (this._model[prop] = val);
	}
}

// SCHEDULED SHIFT SUB TASK
class ScheduledSubTaskModel {
	constructor() {
		this._model = {
			AssessmentTrackingTaskShiftSubTaskId: 0,
			AssessmentTrackingTaskShiftId: 0,
			AssessmentTrackingTaskId: 0,
			AssessmentTaskId: 0,
			AssessmentReasonId: 0,
			AssessmentResolutionId: 0,
			AssessmentTaskStatusId: 0,
			AssessmentPriorityId: 0,
			AssessmentTrackingId: 0,
			Notes: "",
			Description: "",
			IsCheck: true,
			IsCompleted: false,
			IsFinal: false,
			IsActive: true,
			UserId: "",
			EntryDate: "",
			CompletedDate: "",
			FollowUpDate: "",
			SignedBy: "",
			InitialBy: "",
			CreatedDate: "",
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
		};
	}
	getModel() {
		return this._model;
	}
	getProperty(prop) {
		return this._model[prop];
	}
	setProperty(prop, val) {
		return (this._model[prop] = val);
	}
}

// SCHEDULED NOTE
class ScheduledTaskNoteModel {
	constructor() {
		this._model = {
			AssessmentTrackingTaskNoteId: 0,
			AssessmentTrackingTaskId: 0,
			AssessmentTrackingId: 0,
			Notes: "",
			IsActive: true,
			EntryDate: "",
			EntryUserId: "",
			InitialBy: "",
			CreatedDate: "",
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
		};
	}
	getModel() {
		return this._model;
	}
	getProperty(prop) {
		return this._model[prop];
	}
	setProperty(prop, val) {
		return (this._model[prop] = val);
	}
}

/////////////////////////////////////////
///////////// REPORT MODELS /////////////
/////////////////////////////////////////

class ReportsModel {
	constructor() {
		this._model = {
			// type of report, date ranges etc..
			// key/value name pairs
			ReportParms: [],
			// requesting specific sorting criteria, ascending, by status etc..
			// key/value name pairs
			ReportSorts: [],
		};
	}
	setParams(name, value) {
		return this._model.ReportParms.push({ Name: name, Value: value });
	}
	setParamsMany(listOfParams) {
		return (this._model.ReportParms = [
			...this._model.ReportParms,
			...listOfParams,
		]);
	}
	setSorts(name, value) {
		return this._model.ReportSorts.push({ Name: name, Value: value });
	}
	setSortsMany(listOfSorts) {
		return (this._model.ReportSorts = [
			...this._model.ReportSorts,
			...listOfSorts,
		]);
	}
	getParams() {
		return this._model.ReportParms;
	}
	getSorts() {
		return this._model.ReportSorts;
	}
	getSingleParam(paramName) {
		return this._model.ReportParms.filter((x) => x.includes(paramName));
	}
	getSingleSort(sortName) {
		return this._model.ReportSorts.filter((x) => x.includes(sortName));
	}
	getModel() {
		return this._model;
	}
}

///////////////////////////////////////////////
/////////////// REPORTS HELPERS ///////////////
///////////////////////////////////////////////

class ReportsCompletionModel {
	constructor() {
		this._model = {
			ReportParms: [
				{ Name: "FacilityID", Value: "" },
				{ Name: "CompletionStartDate", Value: "" },
				{ Name: "CompletionEndDate", Value: "" },
			],
			ReportSorts: [],
		};
	}
	setFacilityID(facilityID) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "FacilityID") {
				return (x.Value = facilityID);
			}
			return x;
		});
	}
	setStartDate(startDate) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "ExceptionStartDate") {
				return (x.Value = startDate);
			}
			return x;
		});
	}
	setEndDate(endDate) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "ExceptionEndDate") {
				return (x.Value = endDate);
			}
			return x;
		});
	}
	setStartAndEndDate(start, end) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "CompletionStartDate") {
				return (x.Value = start);
			}
			if (x.Name === "CompletionEndDate") {
				return (x.Value = end);
			}
			return x;
		});
	}
	setParams(name, value) {
		return this._model.ReportParms.push({ Name: name, Value: value });
	}
	setParamsMany(listOfParams) {
		if (isEmptyArray(listOfParams)) return;
		return (this._model.ReportParms = [
			...this._model.ReportParms,
			...listOfParams,
		]);
	}
	setSorts(name, value) {
		return this._model.ReportSorts.push({ Name: name, Value: value });
	}
	setSortsMany(listOfSorts) {
		if (isEmptyArray(listOfSorts)) return;
		return (this._model.ReportSorts = [
			...this._model.ReportSorts,
			...listOfSorts,
		]);
	}
	getParams() {
		return this._model.ReportParms;
	}
	getModel() {
		return this._model;
	}
}

class ReportsExceptionModel {
	constructor() {
		this._model = {
			ReportParms: [
				{ Name: "FacilityID", Value: "" },
				{ Name: "ExceptionStartDate", Value: "" },
				{ Name: "ExceptionEndDate", Value: "" },
			],
			ReportSorts: [],
		};
	}
	setFacilityID(facilityID) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "FacilityID") {
				return (x.Value = facilityID);
			}
			return x;
		});
	}
	setStartDate(startDate) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "ExceptionStartDate") {
				return (x.Value = startDate);
			}
			return x;
		});
	}
	setEndDate(endDate) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "ExceptionEndDate") {
				return (x.Value = endDate);
			}
			return x;
		});
	}
	setStartAndEndDate(start, end) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "ExceptionStartDate") {
				return (x.Value = start);
			}
			if (x.Name === "ExceptionEndDate") {
				return (x.Value = end);
			}
			return x;
		});
	}
	setParams(name, value) {
		return this._model.ReportParms.push({ Name: name, Value: value });
	}
	setParamsMany(listOfParams) {
		if (isEmptyArray(listOfParams)) return;
		return (this._model.ReportParms = [
			...this._model.ReportParms,
			...listOfParams,
		]);
	}
	setSorts(name, value) {
		return this._model.ReportSorts.push({ Name: name, Value: value });
	}
	setSortsMany(listOfSorts) {
		if (isEmptyArray(listOfSorts)) return;
		return (this._model.ReportSorts = [
			...this._model.ReportSorts,
			...listOfSorts,
		]);
	}
	getParams() {
		return this._model.ReportParms;
	}
	getModel() {
		return this._model;
	}
}

///////////////////////////////////////////////////////////
////////////// FACILITY SHIFT TIMES MODEL(S) //////////////
///////////////////////////////////////////////////////////

class FacilityShiftTimesModel {
	constructor() {
		this._model = {
			AssessmentFacilityShiftId: 0, // int, not null - default to 0
			FacilityId: null, // string, not null
			AssessmentShiftId: 0, // int, not null
			StartTime: "", // datetime, not null
			EndTime: "", // datetime, not null
			ShiftManagerUserId: null, // string, null
			IsActive: true, // bool, not null
			CreatedDate: new Date().toISOString(), // datetime, null
			CreatedBy: null, // string, null
			CreatedLoginBy: null, // string, null
			CreatedStation: null, // string, null
			ModifiedDate: new Date().toISOString(), // datetime, null
			ModifiedBy: null, // string, null
			ModifiedLoginBy: null, // string, null
			ModifiedStation: null, // string, null
		};
	}
	setShiftRecordID(shiftRecordID) {
		return (this._model = {
			...this._model,
			AssessmentFacilityShiftId: shiftRecordID,
		});
	}
	setManagerID(mgrID) {
		return (this._model = {
			...this._model,
			ShiftManagerUserId: mgrID,
		});
	}
	setShiftID(shift) {
		if (typeof shift === "string") {
			return (this._model = {
				...this._model,
				AssessmentShiftId: getShiftID(shift),
			});
		} else {
			return (this._model = {
				...this._model,
				AssessmentShiftId: shift,
			});
		}
	}
	setFacilityID(facilityID) {
		return (this._model = {
			...this._model,
			FacilityId: facilityID,
		});
	}
	setStartTime(startTime) {
		return (this._model = {
			...this._model,
			StartTime: startTime,
		});
	}
	setEndTime(endTime) {
		return (this._model = {
			...this._model,
			EndTime: endTime,
		});
	}
	setStartAndEndTime(startTime, endTime) {
		return (this._model = {
			...this._model,
			StartTime: startTime,
			EndTime: endTime,
		});
	}
	getStartTime() {
		return this._model.StartTime;
	}
	getEndTime() {
		return this._model.EndTime;
	}
	getStartAndEndTime() {
		return {
			startTime: this._model.StartTime,
			endTime: this._model.EndTime,
		};
	}
	getModel() {
		return this._model;
	}
}

///////////////////////////////////////////////////////////
/////////////// ADL SHIFT SCHEDULE MODEL(S) ///////////////
///////////////////////////////////////////////////////////
class AdlShiftScheduleModel {
	constructor() {
		this._model = {
			AssessmentResidentAdlShiftId: 0, // int, not null
			ResidentId: 0, // int, not null
			AssessmentCategoryId: 0, // int, not null
			AssessmentShiftId: 0, // int, not null
			ShiftMon: false, // bool, not null
			ShiftTue: false, // bool, not null
			ShiftWed: false, // bool, not null
			ShiftThu: false, // bool, not null
			ShiftFri: false, // bool, not null
			ShiftSat: false, // bool, not null
			ShiftSun: false, // bool, not null
			Notes: "", // string, null
			IsActive: true, // bool, not null
			CreatedDate: new Date().toUTCString(), // datetime, null
			CreatedBy: null, // string, null
			CreatedLoginBy: null, // string, null
			CreatedStation: null, // string, null
			ModifiedDate: new Date().toUTCString(), // datetime, null
			ModifiedBy: null, // uid, null
			ModifiedLoginBy: null, // string, null
			ModifiedStation: null, // string, null
		};
	}
	// accepts either a string Shift or id, will convert the string into the id
	setShiftID(id) {
		if (typeof id === "string") {
			return (this._model = {
				...this._model,
				AssessmentShiftId: getShiftID(id),
			});
		} else {
			return (this._model = {
				...this._model,
				AssessmentShiftId: id,
			});
		}
	}
	// accepts either a string ADL(category) or id, will convert the string into the id
	setCategoryID(id) {
		if (typeof id === "string") {
			return (this._model = {
				...this._model,
				AssessmentCategoryId: getCategoryID(id),
			});
		} else {
			this._model = {
				...this._model,
				AssessmentCategoryId: id,
			};
		}
	}
	setResidentID(id) {
		return (this._model = {
			...this._model,
			ResidentId: id,
		});
	}
	setProp(prop, val) {
		return (this._model = {
			...this._model,
			[prop]: val,
		});
	}
	toggleAdlSchedule() {
		return (this._model = {
			...this._model,
			ShiftMon: !this._model.ShiftMon,
			ShiftTue: !this._model.ShiftTue,
			ShiftWed: !this._model.ShiftWed,
			ShiftThu: !this._model.ShiftThu,
			ShiftFri: !this._model.ShiftFri,
			ShiftSat: !this._model.ShiftSat,
			ShiftSun: !this._model.ShiftSun,
		});
	}
	getProp(prop) {
		return this._model[prop];
	}
	getModel() {
		return this._model;
	}
}

// ALL ADLS, EXCLUDING "BATHING" & "LAUNDRY", WHICH ARE COVERED BY THE ASSESSMENT
/**
 * @description - All Shift Schedules for an ADL (ie "AM", "PM", "NOC").
 * @property {Boolean} ShiftMon - boolean indicating Monday's shift was/was not selected; defaults to "false".
 * @property {Boolean} ShiftTue - boolean indicating Monday's shift was/was not selected; defaults to "false".
 * @property {Boolean} ShiftWed - boolean indicating Monday's shift was/was not selected; defaults to "false".
 * @property {Boolean} ShiftThu - boolean indicating Monday's shift was/was not selected; defaults to "false".
 * @property {Boolean} ShiftFri - boolean indicating Monday's shift was/was not selected; defaults to "false".
 * @property {Boolean} ShiftSat - boolean indicating Monday's shift was/was not selected; defaults to "false".
 * @property {Boolean} ShiftSun - boolean indicating Monday's shift was/was not selected; defaults to "false".
 */
class AdlAllShiftsScheduleModel {
	constructor() {
		this._model = [
			{
				AssessmentResidentAdlShiftId: 0,
				ResidentId: 0,
				AssessmentCategoryId: 0,
				AssessmentShiftId: 1,
				ShiftMon: false,
				ShiftTue: false,
				ShiftWed: false,
				ShiftThu: false,
				ShiftFri: false,
				ShiftSat: false,
				ShiftSun: false,
				Notes: "",
				IsActive: true,
				CreatedDate: new Date().toUTCString(),
				CreatedBy: null,
				CreatedLoginBy: null,
				CreatedStation: null,
				ModifiedDate: new Date().toUTCString(),
				ModifiedBy: null,
				ModifiedLoginBy: null,
				ModifiedStation: null,
			},
			{
				AssessmentResidentAdlShiftId: 0,
				ResidentId: 0,
				AssessmentCategoryId: 0,
				AssessmentShiftId: 2,
				ShiftMon: false,
				ShiftTue: false,
				ShiftWed: false,
				ShiftThu: false,
				ShiftFri: false,
				ShiftSat: false,
				ShiftSun: false,
				Notes: "",
				IsActive: true,
				CreatedDate: new Date().toUTCString(),
				CreatedBy: null,
				CreatedLoginBy: null,
				CreatedStation: null,
				ModifiedDate: new Date().toUTCString(),
				ModifiedBy: null,
				ModifiedLoginBy: null,
				ModifiedStation: null,
			},
			{
				AssessmentResidentAdlShiftId: 0,
				ResidentId: 0,
				AssessmentCategoryId: 0,
				AssessmentShiftId: 3,
				ShiftMon: false,
				ShiftTue: false,
				ShiftWed: false,
				ShiftThu: false,
				ShiftFri: false,
				ShiftSat: false,
				ShiftSun: false,
				Notes: "",
				IsActive: true,
				CreatedDate: new Date().toUTCString(),
				CreatedBy: null,
				CreatedLoginBy: null,
				CreatedStation: null,
				ModifiedDate: new Date().toUTCString(),
				ModifiedBy: null,
				ModifiedLoginBy: null,
				ModifiedStation: null,
			},
		];
	}
	setProp(prop, val) {
		return (this._model = this._model.map((shiftModel) => {
			return {
				...shiftModel,
				[prop]: val,
			};
		}));
	}
	setCategoryID(adl) {
		if (typeof adl === "string") {
			return (this._model = this._model.map((shiftModel) => {
				return {
					...shiftModel,
					AssessmentCategoryId: getCategoryID(adl),
				};
			}));
		}
		return (this._model = this._model.map((shiftModel) => {
			return {
				...shiftModel,
				AssessmentCategoryId: adl,
			};
		}));
	}
	setResidentID(id) {
		return (this._model = this._model.map((shiftModel) => {
			return {
				...shiftModel,
				ResidentId: id,
			};
		}));
	}
	toggleAllSchedules() {
		return (this._model = this._model.map((shiftModel) => {
			const {
				ShiftMon,
				ShiftTue,
				ShiftWed,
				ShiftThu,
				ShiftFri,
				ShiftSat,
				ShiftSun,
			} = shiftModel;

			return {
				...shiftModel,
				ShiftMon: !ShiftMon,
				ShiftTue: !ShiftTue,
				ShiftWed: !ShiftWed,
				ShiftThu: !ShiftThu,
				ShiftFri: !ShiftFri,
				ShiftSat: !ShiftSat,
				ShiftSun: !ShiftSun,
			};
		}));
	}
	toggleScheduleByShift(shift) {
		if (typeof shift === "string") {
			return (this._model = this._model.map((shiftModel) => {
				if (getShiftID(shift) === shiftModel.AssessmentShiftId) {
					const {
						ShiftMon,
						ShiftTue,
						ShiftWed,
						ShiftThu,
						ShiftFri,
						ShiftSat,
						ShiftSun,
					} = shiftModel;
					return {
						...shiftModel,
						ShiftMon: !ShiftMon,
						ShiftTue: !ShiftTue,
						ShiftWed: !ShiftWed,
						ShiftThu: !ShiftThu,
						ShiftFri: !ShiftFri,
						ShiftSat: !ShiftSat,
						ShiftSun: !ShiftSun,
					};
				}
				return shiftModel;
			}));
		}
		return (this._model = this._model.map((shiftModel) => {
			const {
				ShiftMon,
				ShiftTue,
				ShiftWed,
				ShiftThu,
				ShiftFri,
				ShiftSat,
				ShiftSun,
			} = shiftModel;
			return {
				...shiftModel,
				ShiftMon: !ShiftMon,
				ShiftTue: !ShiftTue,
				ShiftWed: !ShiftWed,
				ShiftThu: !ShiftThu,
				ShiftFri: !ShiftFri,
				ShiftSat: !ShiftSat,
				ShiftSun: !ShiftSun,
			};
		}));
	}
	getModel() {
		return [...this._model];
	}
}

export {
	// UNSCHEDULED
	UnscheduledTaskModel,
	UnscheduledTaskShiftModel,
	UnscheduledSubTaskModel,
	UnscheduledTaskNoteModel,
	// SCHEDULED
	ScheduledTaskModel,
	ScheduledTaskShiftModel,
	ScheduledSubTaskModel,
	ScheduledTaskNoteModel,
	// REPORTS MODELS
	ReportsModel,
	ReportsCompletionModel,
	ReportsExceptionModel,
	// ADL SHIFT SCHEDULE MODELS (FOR A RESIDENT)
	AdlShiftScheduleModel,
	AdlAllShiftsScheduleModel,
	// FACILITY - SHIFT TIMES MODEL (FOR A FACILITY)
	FacilityShiftTimesModel,
};
