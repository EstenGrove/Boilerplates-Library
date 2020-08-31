import { isEmptyObj, isEmptyVal } from "./utils_types";

const ALERTS_MODEL = {
	ERROR: {
		heading: "Error",
		subheading: "",
	},
	SUCCESS: {
		heading: "Success",
		subheading: "",
	},
	WARN: {
		heading: "Warning",
		subheading: "",
	},
	INFO: {
		heading: "Notice",
		subheading: "",
	},
};

const taskAlerts = {
	ERROR: {
		heading: "Error",
		subheading: "Your changes were NOT saved.",
	},
	SUCCESS: {
		heading: "Success",
		subheading: "Your changes have been saved.",
	},
	WARN: {
		heading: "Warning",
		subheading: "",
	},
	INFO: {
		heading: "Notice",
		subheading: "",
	},
};
const dailyViewAlerts = {
	ERROR: {
		heading: "Error",
		subheading: "Oops. There was an error. Please try again.",
	},
	SUCCESS: {
		heading: "Success",
		subheading: "Your task was created",
	},
	WARN: {
		heading: "Warning",
		subheading: "Please complete the form.",
	},
	INFO: {
		heading: "Notice",
		subheading: "",
	},
};

class Alerts {
	constructor() {
		this._model = {
			ERROR: {
				heading: "",
				subheading: "",
			},
			SUCCESS: {
				heading: "Success",
				subheading: "",
			},
			WARN: {
				heading: "Warning",
				subheading: "",
			},
			INFO: {
				heading: "Notice",
				subheading: "",
			},
		};
	}
	setAlert(type, heading, subheading) {
		return (this._model[type] = {
			heading: heading,
			subheading: subheading,
		});
	}
	setAlertHeading(type, heading) {
		return (this._model[type] = {
			...this._model[type],
			heading: heading,
		});
	}
	setAlertSubheading(type, subheading) {
		return (this._model[type] = {
			...this._model[type],
			subheading: subheading,
		});
	}
	getModel() {
		return this._model;
	}
	getAlert(type) {
		return this._model[type];
	}
	getAlertHeading(type) {
		return this._model[type].heading;
	}
	getAlertSubheading(type) {
		return this._model[type].subheading;
	}
}

// formats 'alert.type' to match a valid alert
const getAlertType = (val) => {
	if (isEmptyVal(val)) return "SUCCESS";
	return val.toUpperCase();
};

const hasMsg = (msg = {}) => {
	const hasHeading = !isEmptyVal(msg?.heading);
	const hasSubheading = !isEmptyVal(msg?.subheading);

	if (!hasHeading && !hasSubheading) {
		return false;
	} else {
		return true;
	}
};

export { ALERTS_MODEL, Alerts, taskAlerts, dailyViewAlerts };

// UPDATED ALERTS HELPERS - 5/25/2020 9:41 AM
export { getAlertType, hasMsg };
