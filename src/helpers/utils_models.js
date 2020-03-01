///////////////////////////////////////////////
////////////// UNSCHEDULED TASKS //////////////
///////////////////////////////////////////////

class UnscheduledTaskModel {
	constructor() {
		this._model = {
			AssessmentUnscheduleTaskId: null,
			ResidentId: 0,
			AssessmentCategoryId: 0,
			AssessmentTaskId: null,
			AssessmentReasonId: 0,
			AssessmentPriorityId: 0,
			CompletedAssessmentShiftId: 4,
			AssessmentResolutionId: 0,
			AssessmentTaskStatusId: 0,
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
			CreatedDate: "",
			CreatedBy: "",
			CreatedLoginBy: "",
			CreatedStation: "",
			ModifiedDate: "",
			ModifiedBy: "",
			ModifiedLoginBy: "",
			ModifiedStation: "",
			Description: "",
			AudioPath: "",
			VideoPath: ""
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
			ModifiedStation: ""
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
class UnscheduledSubTask {
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
			ModifiedStation: ""
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
			ModifiedStation: ""
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

///////////////////////////////////////////////
/////////////// SCHEDULED TASKS ///////////////
///////////////////////////////////////////////

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
			ModifiedStation: ""
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
			ModifiedStation: ""
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
class ScheduledSubtaskModel {
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
			ModifiedStation: ""
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
			ModifiedStation: ""
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

//////////////////////////////////////////////
////////////// REPORTS MODELS ////////////////
//////////////////////////////////////////////

class ReportsModel {
	constructor() {
		this._model = {
			// type of report, date ranges etc...
			// key/value pairs (Name, Value)
			ReportParms: [],
			// for requesting sorting criteria
			// key/value pairs (Name, Value)
			ReportSorts: []
		};
	}
	setParams(name, value) {
		return this._model.ReportParms.push({ Name: name, Value: value });
	}
	setParamsMany(listOfParams) {
		return (this._model.ReportParms = [
			...this._model.ReportParms,
			...listOfParams
		]);
	}
	setSorts(name, value) {
		return this._model.ReportSorts.push({ Name: name, Value: value });
	}
	setSortsMany(listOfSorts) {
		return (this._model.ReportSorts = [
			...this._model.ReportSorts,
			...listOfSorts
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
				{ Name: "ExceptionEndDate", Value: "" }
			],
			ReportSorts: []
		};
	}
	setFacilityID(facilityID) {
		return this._model.ReportParms.filter(x => {
			if (x.Name === "FacilityID") {
				return (x.Value = facilityID);
			}
			return x;
		});
	}
	setStartDate(startDate) {
		return this._model.ReportParms.filter(x => {
			if (x.Name === "ExceptionStartDate") {
				return (x.Value = startDate);
			}
			return x;
		});
	}
	setEndDate(endDate) {
		return this._model.ReportParms.filter(x => {
			if (x.Name === "ExceptionEndDate") {
				return (x.Value = endDate);
			}
			return x;
		});
	}
	setStartAndEndDate(start, end) {
		return this._model.ReportParms.filter(x => {
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
		return (this._model.ReportParms = [
			...this._model.ReportParms,
			...listOfParams
		]);
	}
	setSorts(name, value) {
		return this._model.ReportSorts.push({ Name: name, Value: value });
	}
	setSortsMany(listOfSorts) {
		return (this._model.ReportSorts = [
			...this._model.ReportSorts,
			...listOfSorts
		]);
	}
	getSorts() {
		return this._model.ReportSorts;
	}
	getParams() {
		return this._model.ReportParms;
	}
	getModel() {
		return this._model;
	}
}

class ReportsCompletionModel {
	constructor() {
		this._model = {
			ReportParms: [
				{ Name: "FacilityID", Value: "" },
				{ Name: "CompletionStartDate", Value: "" },
				{ Name: "CompletionEndDate", Value: "" }
			],
			ReportSorts: []
		};
	}
	setFacilityID(facilityID) {
		return this._model.ReportParms.filter(x => {
			if (x.Name === "FacilityID") {
				return (x.Value = facilityID);
			}
			return x;
		});
	}
	setStartDate(startDate) {
		return this._model.ReportParms.filter(x => {
			if (x.Name === "CompletionStartDate") {
				return (x.Value = startDate);
			}
			return x;
		});
	}
	setEndDate(endDate) {
		return this._model.ReportParms.filter(x => {
			if (x.Name === "CompletionEndDate") {
				return (x.Value = endDate);
			}
			return x;
		});
	}
	setStartAndEndDate(start, end) {
		return this._model.ReportParms.filter(x => {
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
		return (this._model.ReportParms = [
			...this._model.ReportParms,
			...listOfParams
		]);
	}
	setSorts(name, value) {
		return this._model.ReportSorts.push({ Name: name, Value: value });
	}
	setSortsMany(listOfSorts) {
		return (this._model.ReportSorts = [
			...this._model.ReportSorts,
			...listOfSorts
		]);
	}
	getSorts() {
		return this._model.ReportSorts;
	}
	getParams() {
		return this._model.ReportParms;
	}
	getModel() {
		return this._model;
	}
}


export {
	// UNSCHEDULED
	UnscheduledTaskModel,
	UnscheduledTaskShiftModel,
	UnscheduledSubTask,
	UnscheduledTaskNoteModel,
	// SCHEDULED
	ScheduledTaskModel,
	ScheduledTaskShiftModel,
	ScheduledSubtaskModel,
	ScheduledTaskNoteModel
// REPORTS MODELS
  ReportsModel,
  ReportsCompletionModel,
  ReportsExceptionModel
};
