import { isEmptyVal } from "./utils_types";

const getResolutionID = resolution => {
	switch (resolution) {
		case "COMPLETED":
			return 1;
		case "COMPLETED-REASSESSMENT-NEEDED":
			return 2;
		case "TBC-NEXT-SHIFT":
			return 3;
		case "RESIDENT-DENIED":
			return 4;
		case "CANCELLED-BY-SUPERVISOR":
			return 5;
		case "PENDING":
			return 6;
		case "TBC-NEXT-SHIFT-NEEDS":
			return 7;
		default:
			return 6;
	}
};

const getResolutionNameFromID = id => {
	switch (id) {
		case 1:
			return "COMPLETED";
		case 2:
			return "COMPLETED-REASSESSMENT-NEEDED";
		case 3:
			return "TBC-NEXT-SHIFT";
		case 4:
			return "RESIDENT-DENIED";
		case 5:
			return "CANCELLED-BY-SUPERVISOR";
		case 6:
			return "PENDING";
		case 7:
			return "TBC-NEXT-SHIFT-NEEDS";
		default:
			return "PENDING";
	}
};

const determineResolution = vals => {
	if (vals.residentUnavailable) {
		return "RESIDENT-DENIED";
	}
	if (isEmptyVal(vals.followUpDate) && !vals.residentUnavailable) {
		return "TBC-NEXT-SHIFT";
	}
	if (vals.requiresMedCheck && !vals.residentUnavailable) {
		return "TBC-NEXT-SHIFT-NEEDS";
	}
	if (vals.reassess) {
		return "COMPLETED-REASSESSMENT-NEEDED";
	}
	return "PENDING";
};

export { getResolutionID, getResolutionNameFromID, determineResolution };
