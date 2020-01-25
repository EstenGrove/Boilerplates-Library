const findPriorityID = priority => {
	switch (priority) {
		case "NONE":
			return 0;
		case "LOW":
			return 1;
		case "MEDIUM":
			return 2;
		case "HIGH":
			return 3;
		default:
			return 0; // defaults to 'NONE'
	}
};

const findPriorityNameFromID = priority => {
	switch (priority) {
		case 0:
			return "NONE";
		case 1:
			return "LOW";
		case 2:
			return "MEDIUM";
		case 3:
			return "HIGH";
		default:
			return 0; // defaults to 'NONE'
	}
};

// handles priority name
const findCareTaskPriorityName = name => {
	switch (name) {
		case "NONE":
			return "None";
		case "LOW":
			return "Low";
		case "MEDIUM":
			return "Medium";
		case "HIGH":
			return "High";
		default:
			return 0; // defaults to 'NONE'
	}
};

export { findPriorityID, findPriorityNameFromID, findCareTaskPriorityName };
