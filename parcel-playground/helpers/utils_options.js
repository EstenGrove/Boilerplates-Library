const SHIFTS = ["AM", "PM", "NOC", "ANY"];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const STATUS = [
  "COMPLETE",
  "IN-PROGRESS",
  "NOT-COMPLETE",
  "PENDING",
  "MISSED-EVENT"
];

const RESOLUTIONS = [
  "COMPLETED",
  "COMPLETED-REASSESSMENT-NEEDED",
  "TBC-NEXT-SHIFT",
  "RESIDENT-DENIED",
  "CANCELLED-BY-SUPERVISOR",
  "PENDING",
  "TBC-NEXT-SHIFT-NEEDS"
];

const RESOLUTION_DETAILS = [
  { name: "COMPLETED", desc: "Completed", id: 1 },
  {
    name: "COMPLETED-REASSESSMENT-NEEDED",
    desc: "Completed Reassessment Needed",
    id: 2
  },
  { name: "TBC-NEXT-SHIFT", desc: "TBC - Next Shift", id: 3 },
  { name: "RESIDENT-DENIED", desc: "Resident Denied", id: 4 },
  { name: "CANCELLED-BY-SUPERVISOR", desc: "Cancelled by Supervisor", id: 5 },
  { name: "PENDING", desc: "Pending", id: 6 },
  {
    name: "TBC-NEXT-SHIFT-NEEDS",
    desc: "TBC - Next Shift Needs Updated Assessment",
    id: 7
  }
];

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
  "FORGOTTEN"
];

const REASONS_DETAILS = [
  { name: "COMPLETED-ON-LATER-SHIFT", desc: "Completed On Later Shift", id: 1 },
  { name: "CANCELLED-BY-SUPERVISOR", desc: "Cancelled By Supervisor", id: 2 },
  { name: "NOT-NEEDED", desc: "Not Needed", id: 3 },
  { name: "MISSED-FORGOTTEN", desc: "Missed/Forgotten", id: 4 },
  {
    name: "INSUFFICIENT-TIME-TO-COMPLETE",
    desc: "Insufficient Time To Complete",
    id: 5
  },
  { name: "COMPLETED-AS-SCHEDULED", desc: "Completed As Scheduled", id: 6 },
  {
    name: "NOT-COMPLETED",
    desc: "Not Completed During scheduled Shift",
    id: 7
  },
  { name: "MISSED", desc: "Missed", id: 8 },
  { name: "FORGOTTEN", desc: "Forgotten", id: 9 }
];

const PRIORITIES = ["NONE", "LOW", "MEDIUM", "HIGH"];

const ADLS = [
  "Ambulation",
  "Bathing",
  "Dressing",
  "Grooming",
  "Laundry",
  "Meals",
  "Meds",
  "Psychosocial",
  "SpecialCare",
  "StatusChecks",
  "Toileting",
  "Transfers",
  "Other"
];

export {
  SHIFTS,
  DAYS,
  // status
  STATUS,
  // resolutions
  RESOLUTIONS,
  RESOLUTION_DETAILS,
  // reasons
  REASONS,
  REASONS_DETAILS,
  // priorities
  PRIORITIES,
  ADLS
};
