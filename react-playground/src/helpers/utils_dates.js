import {
	isToday,
	format,
	isPast,
	distanceInWordsToNow,
	differenceInDays,
	distanceInWords
} from "date-fns";
import { isScheduledTask } from "./utils_tasks";

const formatDate = (date = null) => {
	if (!date) return "No date";
	const day = format(date, "ddd");
	const dayDate = format(date, "D");
	const month = format(date, "MMM");
	const year = format(date, "YYYY");
	return `${day}, ${month} ${dayDate} ${year}`;
};

const formatTime = time => {
	let hours = time.getHours();
	let mins = time.getMinutes();
	let timeOfDay = "AM";
	if (hours > 12) {
		hours = hours - 12;
		timeOfDay = "PM";
	}
	if (mins < 10) {
		mins = "0" + mins;
	}
	return `${hours}:${mins} ${timeOfDay}`;
};

// returns string: 3 days ago, 4 hours ago...
const formatTimeToNow = date => {
	if (!isToday(date)) {
		return `${distanceInWords(date, new Date())}`;
	}
	return "";
};

// returns boolean
const isPastDue = dueDate => {
	if (isPast(dueDate)) return true;
	return false;
};

// return
const formatPastDate = date => {
	if (!isPast(date)) return;
	return `${distanceInWordsToNow(date)} ago`;
};

const formatDifferenceInDays = date => {
	if (!isToday(date)) {
		return `${differenceInDays(date)} days`;
	}
	return "today";
};

// matches day ("Monday", "Tuesday")
const matchDayOfWeek = dateStr => {
	const dayOfWeek = format(new Date(), "dddd");
	if (dayOfWeek === dateStr) {
		return true;
	}
	return false;
};

// matches day & date (ie "Monday" & "12/19/2019")
const matchDayAndDate = (day, dateStr) => {
	const dayOfWeek = format(new Date(), "dddd");
	if (dayOfWeek === day && isToday(dateStr)) {
		return true;
	}
	return false;
};

// returns 0-6 (ie. "Sunday" = 0, "Monday" = 1, ...)
const getZeroBasedDayOfWeek = (day = new Date()) => {
	const dayOfWeek = format(day, "d");
	return dayOfWeek;
};

const checkForPastDue = task => {
	// if unscheduled task
	if (!isScheduledTask(task)) {
		return isPast(task.EntryDate)
			? formatPastDate(task.EntryDate)
			: formatDate(task.EntryDate);
	}
	return isPast(task.TrackDate)
		? formatPastDate(task.TrackDate)
		: formatDifferenceInDays(task.TrackDate);
};

export {
	formatDate,
	formatTime,
	formatTimeToNow,
	isPastDue,
	formatPastDate,
	formatDifferenceInDays,
	matchDayOfWeek,
	matchDayAndDate,
	getZeroBasedDayOfWeek,
	checkForPastDue
};
