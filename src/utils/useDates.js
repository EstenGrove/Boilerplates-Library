import { useState } from "react";
import {
	getYear,
	eachDay,
	startOfWeek,
	startOfMonth,
	endOfMonth,
	addMonths,
	subMonths,
	addWeeks,
	subWeeks,
	endOfWeek,
	startOfQuarter,
	endOfQuarter,
	addQuarters,
	subQuarters,
	getQuarter
} from "date-fns";

export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// MONTH HELPERS
export const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
// QUARTER HELPERS
export const quarters = ["Q1", "Q2", "Q3", "Q4"];
export const quarterRange = {
	Q1: ["Jan", "Feb", "Mar"],
	Q2: ["Apr", "May", "Jun"],
	Q3: ["Jul", "Aug", "Sep"],
	Q4: ["Oct", "Nov", "Dec"]
};

export const parseQuarter = (qtrString, year) => {
	if (qtrString === "Q1") {
		return new Date(year, 1, 1);
	}
	if (qtrString === "Q2") {
		return new Date(year, 3, 1);
	}
	if (qtrString === "Q3") {
		return new Date(year, 6, 1);
	}
	if (qtrString === "Q4") {
		return new Date(year, 9, 1);
	}
};

// FUTURE REQUIREMENTS:

export const useDates = (base = new Date()) => {
	const [globalDates, setGlobalDates] = useState({
		year: getYear(base),
		quarter: {
			quarterStart: startOfQuarter(base),
			quarterEnd: endOfQuarter(base),
			name: "Q" + getQuarter(base)
		},
		month: {
			monthStart: startOfMonth(base),
			monthEnd: endOfMonth(base),
			days: eachDay(startOfMonth(base), endOfMonth(base))
		},
		week: {
			weekStart: startOfWeek(base),
			weekEnd: endOfWeek(base),
			days: eachDay(startOfWeek(base), endOfWeek(base))
		},
		today: new Date()
	});

	const getPrevQuarter = () => {
		const { quarter, month, week } = globalDates;
		setGlobalDates({
			...globalDates,
			year: getYear(subQuarters(quarter.quarterStart, 1)),
			quarter: {
				quarterStart: startOfQuarter(subQuarters(quarter.quarterStart, 1)),
				quarterEnd: endOfQuarter(subQuarters(quarter.quarterStart, 1)),
				name: "Q" + getQuarter(subQuarters(quarter.quarterStart, 1))
			},
			month: {
				monthStart: startOfMonth(subQuarters(month.monthStart, 1)),
				monthEnd: endOfMonth(subQuarters(month.monthEnd, 1)),
				days: eachDay(
					startOfMonth(subQuarters(month.monthStart, 1)),
					endOfMonth(subQuarters(month.monthEnd, 1))
				)
			},
			week: {
				weekStart: startOfWeek(subQuarters(week.weekStart, 1)),
				weekEnd: endOfWeek(subQuarters(week.weekEnd, 1)),
				days: eachDay(
					startOfWeek(subQuarters(week.weekStart, 1)),
					endOfWeek(subQuarters(week.weekEnd, 1))
				)
			}
		});
	};

	const getNextQuarter = () => {
		const { quarter, month, week } = globalDates;
		setGlobalDates({
			...globalDates,
			year: getYear(addQuarters(quarter.quarterStart, 1)),
			quarter: {
				quarterStart: startOfQuarter(addQuarters(quarter.quarterStart, 1)),
				quarterEnd: endOfQuarter(addQuarters(quarter.quarterStart, 1)),
				name: "Q" + getQuarter(addQuarters(quarter.quarterStart, 1))
			},
			month: {
				monthStart: startOfMonth(addQuarters(month.monthStart, 1)),
				monthEnd: endOfMonth(addQuarters(month.monthEnd, 1)),
				days: eachDay(
					startOfMonth(addQuarters(month.monthStart, 1)),
					endOfMonth(addQuarters(month.monthEnd, 1))
				)
			},
			week: {
				weekStart: startOfWeek(addQuarters(week.weekStart, 1)),
				weekEnd: endOfWeek(addQuarters(week.weekEnd, 1)),
				days: eachDay(
					startOfWeek(addQuarters(week.weekStart, 1)),
					endOfWeek(addQuarters(week.weekEnd, 1))
				)
			}
		});
	};

	// CONSIDER HANDLING W/ A DIFFERENT METHOD
	// TAKES THE "quarterString" AND GRABS THE 1ST MONTH FROM THAT QUARTER (ie new Date(2020, 1, 1))
	// AND CREATES A DATE INSTANCE W/ IT
	const setQuarterFromString = quarterString => {
		const { year } = globalDates;
		const qtrDate = parseQuarter(quarterString, year);
		setGlobalDates({
			...globalDates,
			year: getYear(qtrDate),
			quarter: {
				quarterStart: startOfQuarter(qtrDate),
				quarterEnd: endOfQuarter(qtrDate),
				name: quarterString
			},
			month: {
				monthStart: startOfMonth(qtrDate),
				monthEnd: endOfMonth(qtrDate),
				days: eachDay(startOfMonth(qtrDate), endOfMonth(qtrDate))
			},
			week: {
				weekStart: startOfWeek(qtrDate),
				weekEnd: endOfWeek(qtrDate),
				days: eachDay(startOfWeek(qtrDate), endOfWeek(qtrDate))
			}
		});
	};

	// GET PREVIOUS MONTH
	// MIGHT NEED "startOfMonth()" & "endOfMonth" ADDED
	const getPrevMonth = () => {
		const { monthStart, monthEnd } = globalDates.month;
		const { weekStart, weekEnd } = globalDates.week;
		setGlobalDates({
			...globalDates,
			year: getYear(subMonths(monthStart, 1)),
			quarter: {
				quarterStart: startOfQuarter(subMonths(monthStart, 1)),
				quarterEnd: endOfQuarter(subMonths(monthStart, 1)),
				name: "Q" + getQuarter(subMonths(monthStart, 1))
			},
			month: {
				monthStart: subMonths(monthStart, 1),
				monthEnd: subMonths(monthEnd, 1),
				days: eachDay(
					startOfMonth(subMonths(monthStart, 1)),
					endOfMonth(subMonths(monthEnd, 1))
				)
			},
			week: {
				weekStart: subMonths(weekStart, 1),
				weekEnd: subMonths(weekEnd, 1),
				days: eachDay(
					startOfWeek(subMonths(weekStart, 1)),
					endOfWeek(subMonths(weekEnd, 1))
				)
			}
		});
	};
	// GET NEXT MONTH
	const getNextMonth = () => {
		const { monthStart, monthEnd } = globalDates.month;
		const { weekStart, weekEnd } = globalDates.week;

		setGlobalDates({
			...globalDates,
			year: getYear(addMonths(monthEnd, 1)),
			quarter: {
				quarterStart: startOfQuarter(addMonths(monthStart, 1)),
				quarterEnd: endOfQuarter(addMonths(monthStart, 1)),
				name: "Q" + getQuarter(addMonths(monthStart, 1))
			},
			month: {
				monthStart: startOfMonth(addMonths(monthStart, 1)),
				monthEnd: endOfMonth(addMonths(monthEnd, 1)),
				days: eachDay(
					startOfMonth(addMonths(monthStart, 1)),
					endOfMonth(addMonths(monthEnd, 1))
				)
			},
			week: {
				weekStart: addMonths(weekStart, 1),
				weekEnd: addMonths(weekEnd, 1),
				days: eachDay(
					startOfWeek(addMonths(weekStart, 1)),
					endOfWeek(addMonths(weekEnd, 1))
				)
			}
		});
	};

	// SETS CURRENT MONTH FROM A STRING (ie "Jan", "Feb" etc.)
	const setMonthFromString = monthString => {
		const { year } = globalDates;
		const monthIndex = months.indexOf(monthString);
		const monthDate = new Date(year, monthIndex, 1);
		setGlobalDates({
			...globalDates,
			year: getYear(monthDate),
			quarter: {
				quarterStart: startOfQuarter(monthDate),
				quarterEnd: endOfQuarter(monthDate),
				name: "Q" + getQuarter(monthDate)
			},
			month: {
				monthStart: startOfMonth(monthDate),
				monthEnd: endOfMonth(monthDate),
				days: eachDay(startOfMonth(monthDate), endOfMonth(monthDate))
			}
		});
	};

	// GET PREVIOUS WEEK
	const getPrevWeek = () => {
		const { weekStart, weekEnd } = globalDates.week;
		setGlobalDates({
			...globalDates,
			year: getYear(subWeeks(weekStart, 1)),
			quarter: {
				quarterStart: startOfQuarter(subWeeks(weekStart, 1)),
				quarterEnd: endOfQuarter(subWeeks(weekStart, 1)),
				name: "Q" + getQuarter(subWeeks(weekStart, 1))
			},
			month: {
				monthStart: startOfMonth(subWeeks(weekStart, 1)),
				monthEnd: endOfMonth(subWeeks(weekStart, 1)),
				days: eachDay(
					startOfMonth(subWeeks(weekStart, 1)),
					endOfMonth(subWeeks(weekEnd, 1))
				)
			},
			week: {
				weekStart: startOfWeek(subWeeks(weekStart, 1)),
				weekEnd: endOfWeek(subWeeks(weekEnd, 1)),
				days: eachDay(
					startOfWeek(subWeeks(weekStart, 1)),
					endOfWeek(subWeeks(weekEnd, 1))
				)
			}
		});
	};
	// GET NEXT WEEK
	const getNextWeek = () => {
		const { weekStart, weekEnd } = globalDates.week;
		setGlobalDates({
			...globalDates,
			year: getYear(addWeeks(weekStart, 1)),
			quarter: {
				quarterStart: startOfQuarter(addWeeks(weekStart, 1)),
				quarterEnd: endOfQuarter(addWeeks(weekStart, 1)),
				name: "Q" + getQuarter(addWeeks(weekStart, 1))
			},
			month: {
				monthStart: startOfMonth(addWeeks(weekStart, 1)),
				monthEnd: endOfMonth(addWeeks(weekStart, 1)),
				days: eachDay(
					startOfMonth(addWeeks(weekStart, 1)),
					endOfMonth(addWeeks(weekStart, 1))
				)
			},
			week: {
				weekStart: addWeeks(weekStart, 1),
				weekEnd: addWeeks(weekEnd, 1),
				days: eachDay(
					startOfWeek(addWeeks(weekStart, 1)),
					endOfWeek(addWeeks(weekEnd, 1))
				)
			}
		});
	};
	// WEEK CHANGE HANDLERS

	const jumpToToday = () => {
		setGlobalDates({
			...globalDates,
			year: getYear(new Date()),
			quarter: {
				quarterStart: startOfQuarter(new Date()),
				quarterEnd: endOfQuarter(new Date()),
				name: "Q" + getQuarter(new Date())
			},
			month: {
				monthStart: startOfMonth(new Date()),
				monthEnd: endOfMonth(new Date()),
				days: eachDay(startOfMonth(new Date()), endOfMonth(new Date()))
			},
			week: {
				weekStart: startOfWeek(new Date()),
				weekEnd: endOfWeek(new Date()),
				days: eachDay(startOfWeek(new Date()), endOfWeek(new Date()))
			}
		});
	};

	return {
		globalDates,
		getPrevQuarter,
		getNextQuarter,
		getNextMonth,
		getPrevMonth,
		getNextWeek,
		getPrevWeek,
		jumpToToday,
		setQuarterFromString, // handles string quarter (ie "Q1", "Q2" etc)
		setMonthFromString // handles string months (ie "Jan", "Feb" etc.)
	};
};
