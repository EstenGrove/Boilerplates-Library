import { isEmptyArray, hasProp } from "./utils_types";
import { getShiftID } from "./utils_shifts";
import { getCategoryID } from "./utils_categories";
import { getShiftParams } from "./utils_reports";
import { format } from "date-fns";

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// TASK MODELS ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// used for creating new records
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
			IsLocked: false,
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
			// EXCEPTION FIELDS
			IsPastDue: false,
			PastDueDate: null,
			AssessmentExceptionId: null,
			ExceptionDate: null,
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

// UNSCHEDULED UI TASK RECORD MODEL //
// used for UI purposes ONLY
class UnscheduledUITaskModel {
	constructor() {
		this._model = {
			AssessmentUnscheduleTaskId: 0,
			ResidentId: 0,
			ResidentFirstName: null,
			ResidentLastName: null,
			AssessmentCategoryId: 2,
			AssessmentTaskId: null,
			TaskName: null,
			TaskDescription: null,
			AssessmentReasonId: 1,
			Reason: null,
			AssessmentExceptionId: null,
			Exception: null,
			AssessmentShiftId: 1,
			Shift: null,
			CompletedAssessmentShiftId: null,
			CompletedShift: null,
			AssessmentResolutionId: 3,
			Resolution: null,
			AssessmentTaskStatusId: 4,
			TaskStatus: "NOT-COMPLETE",
			AssessmentPriorityId: 0,
			PriorityName: "None",
			UserId: null,
			EntryUserFirstName: null,
			EntryUserLastName: null,
			TaskDate: null,
			CompletedDate: null,
			FollowUpDate: null,
			SignedBy: "",
			InitialBy: "",
			TaskNotes: null,
			IsCompleted: false,
			IsFinal: false,
			IsLocked: false,
			IsPastDue: false,
			Description: null,
			AudioPath: "",
			VideoPath: "",
			ExceptionDate: null,
			PastDueDate: null,
			AssessmentRecurringId: null,
			RecurringType: null,
			RecurringStartDate: null,
			RecurringEndDate: null,
			RecurringDescription: null,
			IsActiveADL: 0,
			RecurringDays: [],
			RecurringShifts: [],
			RecurringDates: [],
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

// SCHEDULED TASK - 'AssessmentTrackingTask' model record
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
			// NEWLY ADDED
			AssessmentExceptionId: null,
			ExceptionDate: null,
			PastDueDate: null,
			IsPastDue: false,
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
// - UPDATED 6/26/2020 8:03 AM
class ScheduledTrackingTaskModel {
	constructor() {
		this._model = {
			AssessmentTrackingTaskId: 0,
			AssessmentTrackingId: 0,
			AssessmentTaskId: 0,
			AssessmentReasonId: 0,
			CompletedAssessmentShiftId: 0,
			AssessmentResolutionId: 0,
			AssessmentTaskStatusId: 0,
			AssessmentPriorityId: 0,
			UserId: "00000000-0000-0000-0000-000000000000",
			EntryDate: "2020-06-26T14:17:45.427Z",
			CompletedDate: "2020-06-26T14:17:45.427Z",
			FollowUpDate: "2020-06-26T14:17:45.427Z",
			SignedBy: "string",
			InitialBy: "string",
			Notes: "string",
			Description: "string",
			AudioPath: "string",
			VideoPath: "string",
			IsCompleted: true,
			IsFinal: true,
			IsActive: true,
			CreatedDate: "2020-06-26T14:17:45.427Z",
			CreatedBy: "00000000-0000-0000-0000-000000000000",
			CreatedLoginBy: "string",
			CreatedStation: "string",
			ModifiedDate: "2020-06-26T14:17:45.427Z",
			ModifiedBy: "00000000-0000-0000-0000-000000000000",
			ModifiedLoginBy: "string",
			ModifiedStation: "string",
			AssessmentShiftId: 0,
			AssessmentRecurringId: 0,
			RecurringMon: true,
			RecurringTue: true,
			RecurringWed: true,
			RecurringThu: true,
			RecurringFri: true,
			RecurringSat: true,
			RecurringSun: true,
			RecurringAMShiftId: 0,
			RecurringPMShiftId: 0,
			RecurringNOCShiftId: 0,
			RecurringStartDate: "2020-06-26T14:17:45.427Z",
			RecurringEndDate: "2020-06-26T14:17:45.427Z",
			RecurringDescription: "string",
			IsLocked: true,
			IsPastDue: true,
			AssessmentExceptionId: 0,
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

// REASSESS MODEL //
// Requirements:
// - 'AssessmentTrackingId'
// - 'AssessmentTaskId'
// - 'UserId'
// - 'EntryDate'
// - 'Notes'
// - 'IsActive'
class ReassessModel {
	constructor() {
		this._model = {
			AssessmentTrackingReassessId: null, // int, not null
			AssessmentTrackingId: 0, // int, not null
			UserId: null, // str/uid, not null
			AssessmentTaskId: 0, // int, not null
			EntryDate: new Date().toUTCString(), // datetime, not null
			Notes: null, // str, null
			IsActive: true, // bool, not null
			CreatedDate: new Date().toUTCString(), // datetime, null
			CreatedBy: null, // str, null
			CreatedLoginBy: null, // str, null
			CreatedStation: null, // str, null
			ModifiedDate: null, // datetime, null
			ModifiedBy: null, // str, null
			ModifiedLoginBy: null, // str, null
			ModifiedStation: null, // str, null
		};
	}

	// setters
	setProp(prop, val) {
		return (this._model = {
			...this._model,
			[prop]: val,
		});
	}
	setUserID(userID) {
		return (this._model = {
			...this._model,
			UserId: userID,
		});
	}
	setReassessID(reassessID) {
		return (this._model = {
			...this._model,
			AssessmentTrackingReassessId: reassessID,
		});
	}
	setTrackingID(trackingID) {
		return (this._model = {
			...this._model,
			AssessmentTrackingId: trackingID,
		});
	}
	setTaskID(taskID) {
		return (this._model = {
			...this._model,
			AssessmentTaskId: taskID,
		});
	}
	setEntryDate(entryDate) {
		return (this._model = {
			...this._model,
			EntryDate: entryDate,
		});
	}
	setNotes(notes) {
		return (this._model = {
			...this._model,
			Notes: notes,
		});
	}

	// getters
	getProp(prop) {
		return this._model[prop];
	}
	getModel() {
		return { ...this._model };
	}
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// REPORT MODELS ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * ReportsModel: used for requesting/executing server-side reports within ALA Services.
 *
 * Required "ReportParms":
 * - 'StartDate'
 * - 'EndDate'
 * - 'FacilityID'
 */
class ReportsModel {
	constructor() {
		this._model = {
			// type of report, date ranges etc..
			// key/value name pairs
			ReportParms: [
				{ Name: "StartDate", Value: "" },
				{ Name: "EndDate", Value: "" },
			],
			// requesting specific sorting criteria, ascending, by status etc..
			// key/value name pairs
			ReportSorts: null,
			// allows specifying a which facility's DMS directory to save the report file to (ie MUST BE A facilityId)
			ReportFacilityId: null,
		};
	}
	_hasFacilityID() {
		const { ReportParms } = this._model;
		const strParms = JSON.stringify(ReportParms);
		const id = `FacilityID`;
		return strParms.includes(id);
	}
	setFacilityID(facilityID) {
		// if a facility has been set via custom params, then don't overwrite it
		if (this._hasFacilityID()) {
			return this._model;
		}
		return this.createParam("FacilityID", facilityID);
	}
	setStartDate(startDate) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "StartDate") {
				return (x.Value = startDate);
			}
			return x;
		});
	}
	setEndDate(endDate) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "EndDate") {
				return (x.Value = endDate);
			}
			return x;
		});
	}
	setStartAndEndDate(start, end) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "StartDate") {
				return (x.Value = start);
			}
			if (x.Name === "EndDate") {
				return (x.Value = end);
			}
			return x;
		});
	}
	setShiftIDs(settings) {
		const shiftParams = getShiftParams(settings);
		return (this._model = {
			...this._model,
			...shiftParams,
		});
	}
	setShift(shiftName, shiftVal) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === shiftName) {
				return (x.Value = shiftVal);
			}
			return x;
		});
	}
	createParam(name, value) {
		return this._model.ReportParms.push({ Name: name, Value: value });
	}
	setParam(param) {
		return this._model.ReportParms.push({ ...param });
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

// 'ReportsCompletionModel' is to be DEPRECATED
class ReportsCompletionModel {
	constructor() {
		this._model = {
			ReportParms: [
				{ Name: "FacilityID", Value: "" },
				{ Name: "StartDate", Value: "" },
				{ Name: "EndDate", Value: "" },
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
			if (x.Name === "StartDate") {
				return (x.Value = startDate);
			}
			return x;
		});
	}
	setEndDate(endDate) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "EndDate") {
				return (x.Value = endDate);
			}
			return x;
		});
	}
	setStartAndEndDate(start, end) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "StartDate") {
				return (x.Value = start);
			}
			if (x.Name === "EndDate") {
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
// 'ReportsCompletionModel' is to be DEPRECATED
class ReportsExceptionModel {
	constructor() {
		this._model = {
			ReportParms: [
				{ Name: "FacilityID", Value: "" },
				{ Name: "StartDate", Value: "" },
				{ Name: "EndDate", Value: "" },
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
			if (x.Name === "StartDate") {
				return (x.Value = startDate);
			}
			return x;
		});
	}
	setEndDate(endDate) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "EndDate") {
				return (x.Value = endDate);
			}
			return x;
		});
	}
	setStartAndEndDate(start, end) {
		return this._model.ReportParms.filter((x) => {
			if (x.Name === "StartDate") {
				return (x.Value = start);
			}
			if (x.Name === "EndDate") {
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

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////// REPORTS HELPERS ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * @class - "RecentlyViewedModel"
 * @classdesc - Data structure used for storing meta-data about a "recently viewed" entry in localStorage.
 * @param {Number|String} id - Param/argument passed to the constructor that sets a unique id for the model entry.
 * @param {String} type - A 'type' definition for the entry (ie "ExceptionReport", "ScheduledTask" etc)
 * @param {String} name - A name used to easily identify the model's data and relevance.
 * @param {String} desc - A string description typically used for displaying meta information to the user.
 * @param {Date} dateCreated - A datestring defining when the entry(ie model) was created.
 * @param {Any} rest - Any remaining entries that may be applied to the model, as desired. Such as UI input values or state.
 */
class RecentlyViewedModel {
	constructor(
		id,
		type = "Report",
		name = "Unknown",
		desc = "No description available",
		dateCreated = format(Date.now(), "MM/DD/YYYY hh:mm A"),
		data = {}
	) {
		this._model = {
			id: id, // not null
			type: type, // not null
			name: name, // not null
			desc: desc, // null
			dateCreated: dateCreated, // not null
			data: { ...data },
		};
	}
	/**
	 * @description - Custom setter that allows completely overriding/appending data to the existing data structure.
	 * @param {Object} model - Allows overriding the existing model's structure in exigent circumstances. USE WITH CAUTION!!.
	 */
	setModel(model) {
		return (this._model = {
			...this._model,
			model: model,
		});
	}
	/**
	 * @description - Setter for appending additional, and often unique, data to an entry's model.
	 * @param {Object} data - Any additionally relevant data needed to be added to a model.
	 */
	setData(data) {
		return (this._model = {
			...this._model,
			data: {
				...this._model.data,
				...data,
			},
		});
	}
	/**
	 * @description - Sets the 'dateCreated' field of the model.
	 * @param {Date} dateCreated - A datestring for when the entry was first created.
	 */
	setDateCreated(dateCreated) {
		return (this._model = {
			...this._model,
			dateCreated: dateCreated,
		});
	}
	/**
	 * @description - Sets the 'desc' field of the model
	 * @param {String} desc - A string description that describes what the entry's data contains (ie a recent report, recent task etc.)
	 */
	setDesc(desc) {
		return (this._model = {
			...this._model,
			desc: desc,
		});
	}
	/**
	 * @description - Sets the 'name' field of the model.
	 * @param {String} name - A string-form name used for easy recall and assignment.
	 */
	setName(name) {
		return (this._model = {
			...this._model,
			name: name,
		});
	}
	/**
	 * @description - Sets the model's 'type' field.
	 * @param {String} type - A string 'type' such as the report type (ie "ExceptionReport" ro "CompletionReport") or any other relevant type definition.
	 */
	setType(type) {
		return (this._model = {
			...this._model,
			type: type,
		});
	}
	/**
	 * @description - Sets the "entry id" for a RecentlyViewed entry.
	 * @param {Number|String} id - A unique (uid) assigned to the model.
	 */
	setEntryID(id) {
		return (this._model = {
			...this._model,
			id: id,
		});
	}
	/**
	 * @description - Getter that retrieves the populated model, in its current state.
	 */
	getModel() {
		return this._model;
	}
}

///////////////////////////////////////////////////////////
////////////// FACILITY SHIFT TIMES MODEL(S) //////////////
///////////////////////////////////////////////////////////

/**
 * @class - 'FacilityShiftTimesModel'
 * @classdesc - Custom class used for creating & updating 'AssessmentFacilityShift' records, includes 'StartTime' & 'EndTime's.
 * @method setStartAndEndTime - sets the 'StartTime' & 'EndTime' fields by cnoverting to UTC format for the server.
 * @method setShiftID - sets the 'AssessmentShiftId' (ie which shift is being updated)
 * @method setRollOver - sets the 'IsRollOver' field, which indicates if a shift schedule 'rolls over' to the following day (ie NOC).
 * @method getModel - returns the entire model for use in an HTTP request.
 * - NOTE: the 'IsRollOver' field indicates whether a shift time schedule "rolls over" into the next day (ie for NOC shifts)
 */
class FacilityShiftTimesModel {
	constructor() {
		this._model = {
			AssessmentFacilityShiftId: 0, // int, not null - default to 0
			FacilityId: null, // string, not null
			AssessmentShiftId: 0, // int, not null
			StartTime: "", // datetime, not null
			EndTime: "", // datetime, not null
			ShiftManagerUserId: null, // string, null
			IsRollOver: false, // bool, not null
			IsActive: true, // bool, not null
			CreatedDate: new Date().toUTCString(), // datetime, null
			CreatedBy: null, // string, null
			CreatedLoginBy: null, // string, null
			CreatedStation: null, // string, null
			ModifiedDate: new Date().toUTCString(), // datetime, null
			ModifiedBy: null, // string, null
			ModifiedLoginBy: null, // string, null
			ModifiedStation: null, // string, null
		};
	}
	setRollOver(rollOver) {
		return (this._model = {
			...this._model,
			IsRollOver: rollOver,
		});
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
			StartTime: startTime?.toUTCString(),
		});
	}
	setEndTime(endTime) {
		return (this._model = {
			...this._model,
			EndTime: endTime?.toUTCString(),
		});
	}
	setStartAndEndTime(startTime, endTime) {
		return (this._model = {
			...this._model,
			StartTime: startTime.toUTCString(),
			EndTime: endTime.toUTCString(),
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

// EXCEPTION MODELS
class AssessmentExceptionModel {
	constructor() {
		this._model = {
			AssessmentExceptionId: 0,
			Name: null,
			Description: null,
			IsActive: true,
			CreatedDate: new Date().toUTCString(),
			CreatedBy: null,
			CreatedLoginBy: null,
			CreatedStation: null,
			ModifiedDate: new Date().toUTCString(),
			ModifiedBy: null,
			ModifiedLoginBy: null,
			ModifiedStation: null,
		};
	}
	setID(id) {
		return (this._model = {
			...this._model,
			AssessmentExceptionId: id,
		});
	}
	setName(name) {
		return (this._model = {
			...this._model,
			Name: name,
		});
	}
	setProp(prop, val) {
		if (!hasProp(prop)) throw new Error(`❌ Oops. Invalid property:`, prop);

		return (this._model = {
			...this._model,
			[prop]: val,
		});
	}
	getProp(prop) {
		if (!hasProp(prop)) return;
		return this._model[prop];
	}
	getModel() {
		return this._model;
	}
}

class FacilityExceptionModel {
	constructor() {
		this._model = {
			AssessmentFacilityExceptionId: 0, // existing ID or 0
			FacilityId: null,
			AssessmentExceptionId: 0, // existing ID or 0
			IsActive: true,
			CreatedDate: new Date().toUTCString(),
			CreatedBy: null,
			CreatedLoginBy: null,
			CreatedStation: null,
			ModifiedDate: new Date().toUTCString(),
			ModifiedBy: null,
			ModifiedLoginBy: null,
			ModifiedStation: null,
		};
	}
	setFacilityExceptionID(id) {
		return (this._model = {
			...this._model,
			AssessmentFacilityExceptionId: id,
		});
	}
	setExceptionID(id) {
		return (this._model = {
			...this._model,
			AssessmentExceptionId: id,
		});
	}
	setFacilityID(facilityID) {
		return (this._model = {
			...this._model,
			FacilityId: facilityID,
		});
	}
	setName(name) {
		return (this._model = {
			...this._model,
			Name: name,
		});
	}
	setProp(prop, val) {
		if (!hasProp(prop)) throw new Error(`❌ Oops. Invalid property:`, prop);

		return (this._model = {
			...this._model,
			[prop]: val,
		});
	}
	getProp(prop) {
		if (!hasProp(prop)) return;
		return this._model[prop];
	}
	getModel() {
		return this._model;
	}
}

////////////////////////////////////////////////////////////////////////////
/////////////////////// DEPRECATED/NOT-IN-USE MODELS ///////////////////////
////////////////////////////////////////////////////////////////////////////

// SCHEDULED SHIFT

export {
	// UNSCHEDULED
	UnscheduledTaskModel,
	UnscheduledUITaskModel,
	// SCHEDULED
	ScheduledTaskModel,
	ScheduledTrackingTaskModel,
	// REASSESS MODEL
	ReassessModel,
	// REPORTS MODELS
	ReportsModel,
	ReportsCompletionModel,
	ReportsExceptionModel,
	// RECENTLY VIEWED MODELS
	RecentlyViewedModel,
	// ADL SHIFT SCHEDULE MODELS (FOR A RESIDENT)
	AdlShiftScheduleModel,
	AdlAllShiftsScheduleModel,
	// FACILITY - SHIFT TIMES MODEL (FOR A FACILITY)
	FacilityShiftTimesModel,
	// EXCEPTION MODELS
	AssessmentExceptionModel,
	FacilityExceptionModel,
};
