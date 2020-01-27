import { isEmptyVal } from "./utils_types";
import { replaceNullWithMsg } from "./utils_processing";
import { findStatusID } from "./utils_status";
import { findShiftID } from "./utils_shifts";
import { getReasonID } from "./utils_reasons";
import { getResolutionID, determineResolution } from "./utils_resolution";
import { findPriorityID, findCareTaskPriorityName } from "./utils_priority";
import { addHours, format } from "date-fns";

// handles formatting task notes
const handleTaskNotes = vals => {
	if (isEmptyVal(vals.reassessNotes)) return vals.taskNotes;
	return `${vals.taskNotes} <br/> Reassess Notes: ${vals.reassessNotes}`;
};

const handleCareTaskCompletion = (vals, record) => {
	return {
		...record,
		AssessmentTaskStatusId: findStatusID(vals.status),
		CompletedAssessmentShiftId: findShiftID(vals.shift),
		CompletedShift: vals.shift,
		TaskStatus: vals.status,
		AssessmentResolutionId: getResolutionID("COMPLETED"),
		Resolution: "COMPLETED",
		Reason: "COMPLETED-AS-SCHEDULED",
		AssessmentReasonId: getReasonID("COMPLETED-AS-SCHEDULED"),
		AssessmentPriorityId: findPriorityID(vals.priority),
		PriorityName: findCareTaskPriorityName(vals.priority),
		ReasonForReassess: !vals.reassess ? "" : vals.reassessNotes,
		SignedBy: vals.signature,
		IsCompleted: true,
		IsFinal: isEmptyVal(vals.followUpDate) ? true : false,
		CompletedDate: format(Date.now(), "MM/DD/YYYY"),
		FollowUpDate: isEmptyVal(!vals.followUpDate)
			? replaceNullWithMsg(vals.followUpDate, addHours(Date.now(), 2))
			: vals.followUpDate
	};
};

// handles MISSED-EVENTS & NOT-COMPLETE statuses
const handleCareTaskException = (vals, record) => {
	return {
		...record,
		AssessmentTaskStatusId: findStatusID(vals.status),
		TaskStatus: vals.status,
		AssessmentReasonId: getReasonID(vals.reason),
		Reason: vals.reason,
		CompletedAssessmentShiftId: findShiftID(vals.shift),
		CompletedShift: vals.shift,
		AssessmentResolutionId: getResolutionID(vals.resolution),
		Resolution: determineResolution(vals),
		AssessmentPriorityId: findPriorityID(vals.priority),
		PriorityName: vals.priority,
		ReasonForReassess: !vals.reassess ? "" : vals.reassessNotes,
		FollowUpDate: replaceNullWithMsg(
			vals.followUpDate,
			addHours(Date.now(), 2)
		),
		SignedBy: vals.signature,
		CompletedDate: "",
		IsCompleted: false,
		IsFinal: false
	};
};

const handleCareTaskPending = (vals, record) => {
	return {
		...record,
		AssessmentTaskStatusId: findStatusID(vals.status),
		TaskStatus: vals.status,
		AssessmentReasonId: getReasonID(vals.reason),
		Reason: vals.reason,
		CompletedAssessmentShiftId: findShiftID(vals.shift),
		CompletedShift: vals.shift,
		AssessmentResolutionId: 6, // pending resolutionID
		Resolution: "PENDING",
		AssessmentPriorityId: findPriorityID(vals.priority),
		PriorityName: vals.priority,
		ReasonForReassess: !vals.reassess ? "" : vals.reassessNotes,
		FollowUpDate: replaceNullWithMsg(
			vals.followUpDate,
			addHours(Date.now(), 2)
		),
		SignedBy: vals.signature,
		TaskNotes: vals.notes,
		IsCompleted: false,
		IsFinal: false
	};
};

// handles updating a care task locally
const updateCareTaskRecord = (vals, record) => {
	switch (vals.status) {
		case "COMPLETE": {
			return handleCareTaskCompletion(vals, record);
		}
		case "NOT-COMPLETE": {
			return handleCareTaskException(vals, record);
		}
		case "PENDING": {
			return handleCareTaskPending(vals, record);
		}
		case "MISSED-EVENT": {
			return handleCareTaskException(vals, record);
		}
		case "IN-PROGRESS": {
			return handleCareTaskPending(vals, record);
		}
		default:
			return;
	}
};

const findCareTaskRecord = (activeTask, records) => {
	return records.reduce((all, item) => {
		if (item.AssessmentTrackingTaskId === activeTask.AssessmentTrackingTaskId) {
			all = item;
			return all;
		}
		return all;
	}, {});
};

export {
	handleTaskNotes,
	handleCareTaskCompletion,
	handleCareTaskException,
	handleCareTaskPending,
	updateCareTaskRecord,
	findCareTaskRecord
};
