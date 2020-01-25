// MIRRORS THE SASS MAPS IN _variables.scss
const themeColors = {
	brand: {
		lightBlue: "hsla(192, 100%, 46%, 1)",
		darkBlue: "hsla(210, 83%, 34%, 1)",
		altLightBlue: "hsla(210, 52%, 47%, 1)",
		lightGrey: "hsla(204, 12%, 92%, 1)",
		altLightGrey: "hsla(210, 45%, 96%, 1)",
		mainWhite: "hsla(0, 0%, 100%, 1)",
		mainGreen: "hsla(79, 71%, 48%, 1)",
		lightGreen: "hsla(89, 54%, 85%, 1)"
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
		altRed: "hsla(352, 70%, 60%, 1)"
	},
	flat: {
		blue: "hsla(197, 100%, 50%, .3)",
		purple: "hsla(222, 89%, 64%, .3)",
		vibe: "hsla(259, 77%, 64%, .4)",
		green: "hsla(144, 69%, 63%, .4)",
		red: "hsla(330, 100%, 41%, .22)",
		yellow: "hsla(60, 92%, 71%, .7)",
		orange: "hsla(11, 100%, 75%, .4)"
	},
	blueGreys: {
		main: "hsla(214, 32%, 91%, 1)",
		saturated: "hsla(211, 25%, 84%, 1)",
		text: "hsla(216, 15%, 52%, 1)",
		headings: "hsla(218, 17%, 35%, 1)",
		subheadings: "hsla(218, 17, 65, 1)",
		light: "hsla(204, 46%, 98%, 1)",
		lightened: "hsla(234, 32%, 91%, 0.4)"
	},
	greys: {
		dark: "hsla(0, 0%, 13%, 1)",
		medium: "hsla(0, 0%, 29%, 1)",
		mediumGrey: "hsla(0, 0%, 45%, 1)",
		lightGrey: "hsla(214, 20%, 69%, 1)",
		extraLightGrey: "hsla(211, 25%, 84%, 1)",
		whiteish: "hsla(240, 14%, 97.3%, 1)",
		chalk: "hsla(0, 0%, 91%, 1)"
	}
};

const { brand, main, flat, blueGreys, greys } = themeColors;

// ADL CATEGORY COLORS - HARDCODED
const adlColors = {
	Ambulation: themeColors.main.blue,
	Bathing: themeColors.main.green,
	Dressing: themeColors.main.yellow,
	Grooming: themeColors.main.red,
	SpecialCare: themeColors.main.main,
	Laundry: themeColors.main.blackBlue,
	Meals: themeColors.main.mustard,
	MedAssist: themeColors.main.pink,
	Psychosocial: themeColors.main.violet,
	StatusChecks: themeColors.main.teal,
	Toileting: themeColors.main.green,
	Transfers: themeColors.flat.red
};

// TASK STATUS COLORS
const statusColors = {
	complete: {
		backgroundColor: themeColors.flat.green,
		color: "hsla(218, 17%, 35%, 1)",
		border: `1px solid ${themeColors.main.green}`
	},
	pending: {
		backgroundColor: themeColors.main.orange,
		color: "hsla(218, 17%, 35%, 1)",
		border: `1px solid ${themeColors.main.orange}`
	},
	inprogress: {
		backgroundColor: themeColors.main.altYellow,
		color: "hsla(218, 17%, 35%, 1)",
		border: `1px solid ${themeColors.main.charcoal}`
	},
	notcomplete: {
		backgroundColor: themeColors.blueGreys.saturated,
		color: "#ffffff",
		border: `1px solid ${themeColors.main.charcoal}`
	},
	missedevent: {
		backgroundColor: themeColors.flat.red,
		color: "hsla(218, 17%, 35%, 1)",
		border: `1px solid ${themeColors.main.red}`
	}
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
	getIcons: function() {
		return console.log(Object.getOwnPropertyNames(this));
	}
};

const statusReducer = (status = "PENDING") => {
	switch (status) {
		case "COMPLETE":
			return {
				backgroundColor: themeColors.flat.green,
				color: "hsla(218, 17%, 35%, 1)",
				border: `1px solid ${themeColors.main.green}`,
				fontSize: "1.3rem",
				fontWeight: "400"
			}; // "hsla(170, 100%, 39%, 1)"
		case "NOT-COMPLETE":
			return {
				backgroundColor: themeColors.main.charcoal,
				color: "#ffffff",
				border: `1px solid ${themeColors.main.charcoal}`,
				fontSize: "1.3rem",
				fontWeight: "400"
			}; // "hsla(268, 10%, 30%, 1)"
		case "IN-PROGRESS":
			return {
				backgroundColor: themeColors.main.mustard,
				color: "hsla(218, 17%, 35%, 1)",
				border: `1px solid ${themeColors.main.Green}`,
				fontSize: "1.3rem",
				fontWeight: "400"
			}; // "hsla(39, 100%, 70%, 1)"
		case "PENDING":
			return {
				backgroundColor: themeColors.flat.orange,
				color: "hsla(218, 17%, 35%, 1)",
				border: `1px solid ${themeColors.main.orange}`,
				fontSize: "1.3rem",
				fontWeight: "400"
			}; // "hsla(11, 100%, 75%, 1)"
		case "MISSED-EVENT":
			return {
				backgroundColor: themeColors.flat.red,
				color: "hsla(218, 17%, 35%, 1)",
				border: `1px solid ${themeColors.main.charcoal}`,
				fontSize: "1.3rem",
				fontWeight: "400"
			}; // "hsla(352, 70%, 50%, 1)"
		default:
			return {
				backgroundColor: themeColors.main.charcoal,
				color: "hsla(218, 17%, 35%, 1)",
				border: `1px solid ${themeColors.main.Green}`,
				fontSize: "1.3rem",
				fontWeight: "400"
			}; // "hsla(268, 10%, 30%, 1)"
	}
};

// PERFORMANT VERSION OF "iconsReducer"
const adlIcons = {
	Dressing: {
		icon: "dry_cleaning",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)"
		}
	},
	Dress: {
		icon: "dry_cleaning",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)"
		}
	},
	Grooming: {
		icon: "face",
		styles: {
			fill: "hsla(144, 69%, 63%, .4)"
		}
	},
	Groom: {
		icon: "face",
		styles: {
			fill: "hsla(144, 69%, 63%, .4)"
		}
	},
	Bathing: {
		icon: "bathtub",
		styles: {
			fill: "hsla(222, 89%, 64%, .3)"
		}
	},
	Bath: {
		icon: "bathtub",
		styles: {
			fill: "hsla(222, 89%, 64%, .3)"
		}
	},
	MedAssist: {
		icon: "sentiment_very_dissatisfied",
		styles: {
			fill: "hsla(330, 100%, 41%, .22)"
		}
	},
	Meds: {
		icon: "sentiment_very_dissatisfied",
		styles: {
			fill: "hsla(330, 100%, 41%, .22)"
		}
	},
	Psychosocial: {
		icon: "news",
		styles: {
			fill: "hsla(11, 100%, 75%, .4)"
		}
	},
	Mental: {
		icon: "news",
		styles: {
			fill: "hsla(11, 100%, 75%, .4)"
		}
	},
	StatusChecks: {
		icon: "timer",
		styles: {
			fill: "hsla(259, 77%, 64%, .4)"
		}
	},
	Health: {
		icon: "timer",
		styles: {
			fill: "hsla(259, 77%, 64%, .4)"
		}
	},
	Toileting: {
		icon: "new_releases",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)"
		}
	},
	Toilet: {
		icon: "new_releases",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)"
		}
	},
	SpecialCare: {
		icon: "new_releases",
		styles: {
			fill: "hsla(144, 69%, 63%, .4)"
		}
	},
	Care: {
		icon: "new_releases",
		styles: {
			fill: "hsla(144, 69%, 63%, .4)"
		}
	},
	Ambulation: {
		icon: "bus_alert",
		styles: {
			fill: "hsla(330, 100%, 41%, .22)"
		}
	},
	Ambulate: {
		icon: "bus_alert",
		styles: {
			fill: "hsla(330, 100%, 41%, .22)"
		}
	},
	Transfers: {
		icon: "transfer_within_a_station",
		styles: {
			fill: "hsla(268, 10%, 30%, .2)"
		}
	},
	Laundry: {
		icon: "local_laundry_service",
		styles: {
			fill: "hsla(197, 100%, 50%, .3)"
		}
	},
	Meals: {
		icon: "restaurant",
		styles: {
			fill: "hsla(259, 77%, 64%, .4)"
		}
	},
	All: {
		icon: "perm_contact_calendar",
		styles: {
			fill: "hsla(218, 17, 65, 1)"
		}
	},
	Other: {
		icon: "assignment_ind",
		styles: {
			fill: "hsla(218, 17, 65, 1)"
		}
	}
};

const iconsReducer = type => {
	switch (true) {
		case type === "Dressing" || type === "Dress": {
			return {
				icon: "dry_cleaning",
				styles: {
					fill: "hsla(268, 10%, 30%, .2)"
				}
			};
		}
		case type === "Grooming" || type === "Groom": {
			return {
				icon: "face",
				styles: {
					fill: "hsla(144, 69%, 63%, .4)"
				}
			};
		}
		case type === "Bathing" || type === "Bath": {
			return {
				icon: "bathtub",
				styles: {
					fill: "hsla(222, 89%, 64%, .3)"
				}
			};
		}
		case type === "MedAssist" || type === "Meds": {
			return {
				icon: "sentiment_very_dissatisfied",
				styles: {
					fill: "hsla(330, 100%, 41%, .22)"
				}
			};
		}
		case type === "Psychosocial" || type === "Mental": {
			return {
				icon: "news",
				styles: {
					fill: "hsla(11, 100%, 75%, .4)"
				}
			};
		}
		case type === "StatusChecks" || type === "Health": {
			return {
				icon: "timer",
				styles: {
					fill: "hsla(259, 77%, 64%, .4)"
				}
			};
		}
		case type === "Toileting" || type === "Toilet": {
			return {
				icon: "new_releases",
				styles: {
					fill: "hsla(268, 10%, 30%, .2)"
				}
			};
		}
		case type === "SpecialCare" || type === "Care": {
			return {
				icon: "new_releases",
				styles: {
					fill: "hsla(144, 69%, 63%, .4)"
				}
			};
		}
		case type === "Ambulation" || type === "Ambulate": {
			return {
				icon: "bus_alert",
				styles: {
					fill: "hsla(330, 100%, 41%, .22)"
				}
			};
		}
		case type === "Transfers": {
			return {
				icon: "transfer_within_a_station",
				styles: {
					fill: "hsla(268, 10%, 30%, .2)"
				}
			};
		}
		case type === "Laundry": {
			return {
				icon: "local_laundry_service",
				styles: {
					fill: "hsla(197, 100%, 50%, .3)"
				}
			};
		}
		case type === "Meals": {
			return {
				icon: "restaurant",
				styles: {
					fill: "hsla(259, 77%, 64%, .4)"
				}
			};
		}
		case type === "All": {
			return {
				icon: "perm_contact_calendar",
				styles: {
					fill: "hsla(218, 17, 65, 1)"
				}
			};
		}
		case type === "Other": {
			return {
				icon: "assignment_ind",
				styles: {
					fill: "hsla(218, 17, 65, 1)"
				}
			};
		}
		default:
			return new Error("Category type not recognized");
	}
};

export {
	themeColors,
	adlColors,
	statusColors,
	adlIcons,
	// destructured
	brand,
	main,
	flat,
	blueGreys,
	greys,
	iconChart,
	statusReducer,
	iconsReducer
};
