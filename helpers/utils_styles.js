import {
	isPastDue,
	isCompleted,
	isNotComplete,
	isException,
} from "./utils_tasks";

// MIRRORS THE SASS MAPS IN _variables.scss
const themeColors = {
	brand: {
		lightBlue: "hsla(192, 100%, 46%, 1)",
		darkBlue: "#0F579F",
		altLightBlue: "hsla(210, 52%, 47%, 1)",
		lightGrey: "hsla(204, 12%, 92%, 1)",
		altLightGrey: "hsla(210, 45%, 96%, 1)",
		mainWhite: "hsla(0, 0%, 100%, 1)",
		mainGreen: "hsla(79, 71%, 48%, 1)",
		lightGreen: "hsla(89, 54%, 85%, 1)",
	},
	main: {
		main: "hsla(242, 89%, 64%, 1)",
		blue: "hsla(197, 100%, 50%, 1)",
		green: "hsla(170, 100%, 39%, 1)",
		red: "hsla(352, 70%, 50%, 1)",
		orange: "hsla(11, 100%, 75%, 1)",
		yellow: "hsla(60, 92%, 71%, 1)",
		mustard: "hsla(46, 100%, 50%, 1)",
		charcoal: "hsla(268, 10%, 30%, 1)",
		grey: "hsla(216, 14%, 93%, 1)",
		blackBlue: "hsla(220, 18%, 20%, 1)",
		violet: "hsla(292, 65%, 68%, 1)",
		teal: "hsla(186, 100%, 50%, 1)",
		pink: "hsla(332, 100%, 74%, 1)",
		neonGreen: "hsla(151, 100%, 45%, 1)",
		altYellow: "hsla(39, 100%, 70%, 1)",
		altRed: "hsla(352, 70%, 60%, 1)",
	},
	flat: {
		main: "hsla(259, 77%, 64%, .4)",
		blue: "hsla(197, 100%, 50%, .3)",
		purple: "hsla(222, 89%, 64%, .3)",
		vibe: "hsla(259, 77%, 64%, .4)",
		green: "hsla(144, 69%, 63%, .4)",
		red: "hsla(330, 100%, 41%, .22)",
		yellow: "hsla(60, 92%, 71%, .7)",
		orange: "hsla(11, 100%, 75%, .4)",
		violet: "hsla(292, 65%, 68%, .3)",
		teal: "hsla(186, 100%, 50%, .4)",
		neonGreen: "hsla(151, 100%, 45%, .4)",
		blackBlue: "hsla(220, 18%, 20%, .4)",
		altRed: "hsla(352, 70%, 60%, .3)",
	},
	blueGreys: {
		main: "hsla(214, 32%, 91%, 1)",
		saturated: "hsla(211, 25%, 84%, 1)",
		text: "hsla(216, 15%, 52%, 1)",
		headings: "hsla(218, 17%, 35%, 1)",
		subheadings: "hsla(218, 17%, 65%, 1)",
		light: "hsla(204, 46%, 98%, 1)",
		lightened: "hsla(234, 32%, 91%, 0.4)",
	},
	greys: {
		dark: "hsla(0, 0%, 13%, 1)",
		medium: "hsla(0, 0%, 29%, 1)",
		mediumGrey: "hsla(0, 0%, 45%, 1)",
		lightGrey: "hsla(214, 20%, 69%, 1)",
		extraLightGrey: "hsla(211, 25%, 84%, 1)",
		whiteish: "hsla(240, 14%, 97.3%, 1)",
		chalk: "hsla(0, 0%, 91%, 1)",
	},
};

const { brand, main, flat, blueGreys, greys } = themeColors;

// ADL CATEGORY COLORS - HARDCODED
const adlColors = {
	Ambulate: themeColors.main.blue,
	Ambulation: themeColors.main.blue, // alias for Ambulate
	Bathing: themeColors.main.green,
	Dressing: themeColors.main.yellow,
	Grooming: themeColors.main.red,
	SpecialCare: themeColors.main.main,
	Care: themeColors.main.main, // alias for SpecialCare
	Laundry: themeColors.main.blackBlue,
	Meals: themeColors.main.mustard,
	MedAssist: themeColors.main.pink,
	Meds: themeColors.main.pink, // alias for MedAssist
	Psychosocial: themeColors.main.violet,
	Mental: themeColors.main.violet, // alias for Psychosocial
	StatusChecks: themeColors.main.teal,
	Toileting: themeColors.main.green,
	Transfers: themeColors.flat.red,
};

///////////////////////////////////////////////////////////////
//////////////////////// STATUS COLORS ////////////////////////
///////////////////////////////////////////////////////////////

// TASK STATUS COLORS - ✅ "PRIMARY TASK STATUS COLOR-PALETTE!!!"
const statusColors = {
	complete: {
		backgroundColor: themeColors.flat.green,
		color: themeColors.main.green,
		border: `1px solid ${themeColors.main.green}`,
	},
	notComplete: {
		backgroundColor: themeColors.blueGreys.altYellow, // should be altYellow
		color: "hsla(218, 17%, 35%, 1)",
		border: `1px solid ${themeColors.main.orange}`,
	},
	pastDue: {
		backgroundColor: themeColors.flat.main,
		color: themeColors.main.main,
		border: `1px solid ${themeColors.main.main}`,
	},
	exception: {
		backgroundColor: themeColors.flat.red,
		color: themeColors.main.red,
		border: `1px solid ${themeColors.main.red}`,
	},
};

const statusBadgeColors = {
	complete: {
		...statusColors.complete,
		color: "#ffffff",
	},
	notComplete: {
		...statusColors.notComplete,
		color: "#ffffff",
	},
	pastDue: {
		...statusColors.pastDue,
		color: "#ffffff",
	},
	exception: {
		...statusColors.exception,
		color: "#ffffff",
	},
};

// JUST TEXT COLORS
const statusTextColor = {
	complete: {
		color: themeColors.main.green,
	},
	notcomplete: {
		color: themeColors.main.altYellow,
	},
	missedevent: {
		color: themeColors.main.red,
	},
	pastdue: {
		color: themeColors.main.main,
	},
	exception: {
		color: themeColors.main.red,
	},
};

const iconChart = {
	stopwatch: "access_alarmalarm",
	close: "clearclose",
	comments: "comments2",
	settings: "cog2",
	caretDown: "caret-down",
	caretUp: "caret-up",
	caretLeft: "caret-left",
	caretRight: "caret-right",
	getIcons: function () {
		return console.log(Object.getOwnPropertyNames(this));
	},
};

// updated as of 4/14/2020 - changed default status to "NOT-COMPLETE", updated "PENDING" status to match "NOT-COMPLETE" status styles.
const statusReducer = (status = "NOT-COMPLETE") => {
	const fonts = {
		fontSize: "1.3rem",
		fontWeight: "400",
	};
	switch (status) {
		case "COMPLETE": {
			return {
				backgroundColor: themeColors.flat.green,
				color: "hsla(218, 17%, 35%, 1)",
				border: `1px solid ${themeColors.main.green}`,
				...fonts,
			};
		}
		case "NOT-COMPLETE": {
			return {
				backgroundColor: themeColors.main.mustard,
				color: themeColors.main.charcoal,
				border: `1px solid ${themeColors.main.charcoal}`,
				...fonts,
			};
		}
		case "PAST-DUE": {
			return {
				backgroundColor: themeColors.flat.main,
				color: themeColors.main.main,
				border: `1px solid ${themeColors.main.main}`,
				...fonts,
			};
		}
		case "EXCEPTION": {
			return {
				backgroundColor: themeColors.flat.red,
				color: themeColors.main.red,
				border: `1px solid ${themeColors.main.red}`,
				...fonts,
			};
		}
		default:
			return {
				backgroundColor: themeColors.main.mustard,
				color: themeColors.main.charcoal,
				border: `1px solid ${themeColors.main.charcoal}`,
				...fonts,
			};
	}
};

const statusHandler = (task, dueDate = new Date(), shiftTimes = []) => {
	switch (true) {
		case isException(task) && !isCompleted(task): {
			return `EXCEPTION`;
		}
		case isPastDue(task, dueDate, shiftTimes): {
			return `PAST-DUE`;
		}
		case isNotComplete(task, dueDate, shiftTimes): {
			return `NOT-COMPLETE`;
		}
		case isCompleted(task): {
			return `COMPLETE`;
		}
		default:
			return `NOT-COMPLETE`;
	}
};

// PERFORMANT VERSION OF "iconsReducer"
const adlIcons = {
	Dressing: {
		icon: "dry_cleaning",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)",
		},
	},
	Dress: {
		icon: "dry_cleaning",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)",
		},
	},
	Grooming: {
		icon: "face",
		styles: {
			fill: "hsla(144, 69%, 63%, .4)",
		},
	},
	Groom: {
		icon: "face",
		styles: {
			fill: "hsla(144, 69%, 63%, .4)",
		},
	},
	Bathing: {
		icon: "bathtub",
		styles: {
			fill: "hsla(222, 89%, 64%, .3)",
		},
	},
	Bath: {
		icon: "bathtub",
		styles: {
			fill: "hsla(222, 89%, 64%, .3)",
		},
	},
	MedAssist: {
		icon: "stethoscope", // tasks.svg
		styles: {
			fill: "hsla(330, 100%, 41%, .22)",
		},
	},
	Meds: {
		icon: "stethoscope", // tasks.svg
		styles: {
			fill: "hsla(330, 100%, 41%, .22)",
		},
	},
	Psychosocial: {
		icon: "sentiment_very_dissatisfied",
		styles: {
			fill: "hsla(11, 100%, 75%, .4)",
		},
	},
	Mental: {
		icon: "list_alt", // tasks.svg
		styles: {
			fill: "hsla(11, 100%, 75%, .4)",
		},
	},
	StatusChecks: {
		icon: "timer",
		styles: {
			fill: "hsla(259, 77%, 64%, .4)",
		},
	},
	Health: {
		icon: "medkit", // "timer", tasks.svg
		styles: {
			fill: "hsla(259, 77%, 64%, .4)",
		},
	},
	Toileting: {
		icon: "news",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)",
		},
	},
	Toilet: {
		icon: "news",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)",
		},
	},
	SpecialCare: {
		icon: "local_hospital",
		styles: {
			fill: "hsla(144, 69%, 63%, .4)",
		},
	},
	Care: {
		icon: "local_hospital",
		styles: {
			fill: "hsla(144, 69%, 63%, .4)",
		},
	},
	Ambulation: {
		icon: "bus_alert",
		styles: {
			fill: "hsla(330, 100%, 41%, .22)",
		},
	},
	Ambulate: {
		icon: "bus_alert",
		styles: {
			fill: "hsla(330, 100%, 41%, .22)",
		},
	},
	Transfers: {
		icon: "transfer_within_a_station", // ambulance from tasks.svg??
		styles: {
			fill: "hsla(268, 10%, 30%, .2)",
		},
	},
	Laundry: {
		icon: "local_laundry_service",
		styles: {
			fill: "hsla(197, 100%, 50%, .3)",
		},
	},
	Meals: {
		icon: "restaurant",
		styles: {
			fill: "hsla(259, 77%, 64%, .4)",
		},
	},
	All: {
		icon: "perm_contact_calendar",
		styles: {
			fill: "hsla(218, 17, 65, 1)",
		},
	},
	Other: {
		icon: "assignment_ind",
		styles: {
			fill: "hsla(218, 17, 65, 1)",
		},
	},
};

const iconsReducer = (type) => {
	switch (true) {
		case type === "Dressing" || type === "Dress": {
			return {
				icon: "dry_cleaning",
				styles: {
					fill: "hsla(268, 10%, 30%, .2)",
				},
			};
		}
		case type === "Grooming" || type === "Groom": {
			return {
				icon: "face",
				styles: {
					fill: "hsla(144, 69%, 63%, .4)",
				},
			};
		}
		case type === "Bathing" || type === "Bath": {
			return {
				icon: "bathtub",
				styles: {
					fill: "hsla(222, 89%, 64%, .3)",
				},
			};
		}
		case type === "MedAssist" || type === "Meds": {
			return {
				icon: "sentiment_very_dissatisfied",
				styles: {
					fill: "hsla(330, 100%, 41%, .22)",
				},
			};
		}
		case type === "Psychosocial" || type === "Mental": {
			return {
				icon: "news",
				styles: {
					fill: "hsla(11, 100%, 75%, .4)",
				},
			};
		}
		case type === "StatusChecks" || type === "Health": {
			return {
				icon: "timer",
				styles: {
					fill: "hsla(259, 77%, 64%, .4)",
				},
			};
		}
		case type === "Toileting" || type === "Toilet": {
			return {
				icon: "new_releases",
				styles: {
					fill: "hsla(268, 10%, 30%, .2)",
				},
			};
		}
		case type === "SpecialCare" || type === "Care": {
			return {
				icon: "face",
				styles: {
					fill: "hsla(144, 69%, 63%, .4)",
				},
			};
		}
		case type === "Ambulation" || type === "Ambulate": {
			return {
				icon: "bus_alert",
				styles: {
					fill: "hsla(330, 100%, 41%, .22)",
				},
			};
		}
		case type === "Transfers": {
			return {
				icon: "transfer_within_a_station",
				styles: {
					fill: "hsla(268, 10%, 30%, .2)",
				},
			};
		}
		case type === "Laundry": {
			return {
				icon: "local_laundry_service",
				styles: {
					fill: "hsla(197, 100%, 50%, .3)",
				},
			};
		}
		case type === "Meals": {
			return {
				icon: "restaurant",
				styles: {
					fill: "hsla(259, 77%, 64%, .4)",
				},
			};
		}
		case type === "All": {
			return {
				icon: "perm_contact_calendar",
				styles: {
					fill: "hsla(218, 17, 65, 1)",
				},
			};
		}
		case type === "Other": {
			return {
				icon: "assignment_ind",
				styles: {
					fill: "hsla(218, 17, 65, 1)",
				},
			};
		}
		default:
			return new Error("Category type not recognized");
	}
};

/////////////////////////////
/////// ALERT HELPERS ///////
/////////////////////////////

const BORDERS = {
	ERROR: `5px solid ${themeColors.main.red}`,
	SUCCESS: `5px solid ${themeColors.main.green}`,
	WARN: `5px solid ${themeColors.main.altYellow}`,
	INFO: `5px solid ${themeColors.main.main}`,
};

const ICONS = {
	ERROR: "exclamation-outline",
	WARN: "warning",
	SUCCESS: "checkmark-outline",
	INFO: "information-outline",
};

const FILLS = {
	SUCCESS: themeColors.main.green,
	WARN: themeColors.main.altYellow,
	INFO: themeColors.main.main,
	ERROR: themeColors.main.red,
};

/////////////////////////////////////
// DIALOG COMPONENT - ICON HELPERS //
/////////////////////////////////////
const DIALOG_ICONS = {
	ERROR: "exclamation-outline",
	WARN: "warningreport_problem",
	WARN2: "warning",
	SUCCESS: "check_circle",
	INFO: "info-with-circle",
	INFO2: "information-outline",
	REPORT: "insert_chart_outlined",
	PRINT: "local_print_shopprint",
	SAVE: "save11",
	CHECKMARK: "check_circle",
	SIGNATURE: "gesture",
	ALARM: "access_alarmalarm",
	EDIT: "createmode_editedit",
	HELP: "live_help",
	MEDS: "local_hospital",
	CALENDAR: "event_note",
	CALENDAR_DONE: "event_available",
	CALENDAR_MISSED: "event_busy",
	USER: "account_circle",
	SETTINGS: "settings1",
	CHART: "chart-bar",
	ALERT: "notifications1",
	SHOW: "view-show",
	IMAGES: "images",
};

export {
	themeColors,
	adlColors,
	adlIcons,
	statusColors,
	statusTextColor,
	statusBadgeColors,
	// destructured
	brand,
	main,
	flat,
	blueGreys,
	greys,
	iconChart,
	statusHandler,
	statusReducer,
	iconsReducer,
};

// ALERT HELPERS //
export { BORDERS, ICONS, FILLS };

// DIALOG HELPERS
export { DIALOG_ICONS };
