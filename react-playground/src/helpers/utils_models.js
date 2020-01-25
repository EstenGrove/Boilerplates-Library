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
};
