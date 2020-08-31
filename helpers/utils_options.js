const STATUS = ["COMPLETE", "NOT-COMPLETE", "PAST-DUE", "EXCEPTION"];
const STATUS_TYPES = [`COMPLETE`, `NOT-COMPLETE`, `PAST-DUE`, `EXCEPTIONS`];

const SHIFTS = ["AM", "PM", "NOC"];

const FALLBACK_SHIFTS = [
	{ AssessmentShiftId: 1, Name: "AM" },
	{ AssessmentShiftId: 2, Name: "PM" },
	{ AssessmentShiftId: 3, Name: "NOC" },
];

const RECURRING_TYPES = [
	"Never",
	"Daily",
	"Weekly",
	"Monthly",
	"Quarterly",
	"Yearly",
	"This day every month",
];

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const DAYS_SLICED = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

////////////////////////////////////////////////////////
//////////////////// REPORT OPTIONS ////////////////////
////////////////////////////////////////////////////////

const UNIT_TYPES = ["Memory Care", "Independent", "Assisted Living"];
const PARAMS = ["FacilityID", "CompletionStartDate", "CompletionEndDate"];
const REPORTS = ["Completion Report", "Exception Report"];
const FILTERS = ["By Shift", "By Resolution", "By Room #"];
const SORTS = [
	"By Resident",
	"By Staff",
	"By Shift",
	"By Reason",
	"By TimeStamp",
];

/**
 * Used for ALL reports both client-side & server-side (SSRS)
 */
const DATE_RANGE_TYPES = [
	"Custom Range",
	"By Month",
	"By Quarter",
	"By Year",
	"By Date",
	"Last 30 days",
	"Last year",
	"Last quarter",
	"Today",
];
const RANGE_TYPES = ["Custom Range", "By Day", "By Month", "By Quarter"];
// USED FOR EXCEPTIONS (ie "MISSED-EVENT", and sometimes "NOT-COMPLETE")
const REASONS = [
	"COMPLETED-ON-LATER-SHIFT",
	"CANCELLED-BY-SUPERVISOR",
	"NOT-NEEDED",
	"MISSED-FORGOTTEN",
	"INSUFFICIENT-TIME-TO-COMPLETE",
	"COMPLETED-AS-SCHEDULED",
	"NOT-COMPLETED",
	"MISSED",
	"FORGOTTEN",
];

const RESOLUTIONS = [
	"COMPLETED",
	"COMPLETED-REASSESSMENT-NEEDED",
	"TBC-NEXT-SHIFT",
	"RESIDENT-DENIED",
	"CANCELLED-BY-SUPERVISOR",
	"PENDING",
	"TBC-NEXT-SHIFT-NEEDS",
];

const BASE_EXCEPTION_TYPES = [
	"Resident Unavailable",
	"Refused Care",
	"Not In Room",
	"Resident Sleeping",
];

// REPORT SORTING OPTION: BY ADL
const ADLS = [
	"Ambulation",
	"Bathing",
	"Dressing",
	"Grooming",
	"Laundry",
	"Meals",
	"MedAssist",
	"Psychosocial",
	"SpecialCare",
	"StatusChecks",
	"Toileting",
	"Transfers",
	"Others",
];

export {
	ADLS,
	SHIFTS,
	FALLBACK_SHIFTS,
	STATUS,
	STATUS_TYPES,
	REASONS,
	RESOLUTIONS,
	BASE_EXCEPTION_TYPES,
};

// REPEATING/RECURRING TASK HELPERS //
export { RECURRING_TYPES, REPORTS };

// DATE-PICKER HELPERS //
export { DAYS_SLICED, DAYS };

// REPORT OPTIONS //
export { DATE_RANGE_TYPES, RANGE_TYPES, UNIT_TYPES, PARAMS, FILTERS, SORTS };
