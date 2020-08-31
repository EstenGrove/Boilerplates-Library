import { REPORT_DESCRIPTIONS } from "./utils_descriptions";
// IMG PREVIEW SRC'S
import exceptionPreview from "../assets/images/PREVIEW/PREVIEW-ExceptionDaily.webp";
import completionPreview from "../assets/images/PREVIEW/PREVIEW-CompletionDaily.webp";
import taskStatusPreview from "../assets/images/PREVIEW/PREVIEW-TaskStatusHistorical.webp";
import taskCreatedPreview from "../assets/images/PREVIEW/PREVIEW-TaskCreatedHistorical.webp";
import pastDuePreview from "../assets/images/PREVIEW/PREVIEW-PastDueDaily.webp";
import servicePlanPreview from "../assets/images/PREVIEW/PREVIEW-ServicePlan.webp";
// IMG PREVIEW FALLBACK'S
import completionFallback from "../assets/images/PREVIEW/PREVIEW-CompletionDaily.png";
import taskStatusFallback from "../assets/images/PREVIEW/PREVIEW-TaskStatusHistorical.png";
import taskCreatedFallback from "../assets/images/PREVIEW/PREVIEW-TaskCreatedHistorical.png";
import exceptionFallback from "../assets/images/PREVIEW/PREVIEW-ExceptionDaily.png";
import pastDueFallback from "../assets/images/PREVIEW/PREVIEW-PastDueDaily.png";
import servicePlanFallback from "../assets/images/PREVIEW/PREVIEW-ServicePlan.png";

////////////////////////////////////////////////////////////////////////
/////////////////// REPORT 'CARDS' CONFIG(S) & UTILS ///////////////////
////////////////////////////////////////////////////////////////////////

// PREVIEW ASSETS
const REPORT_PREVIEW_ASSETS = {
	Exception: {
		src: exceptionPreview,
		fallback: exceptionFallback,
	},
	Completion: {
		src: completionPreview,
		fallback: completionFallback,
	},
	TaskStatus: {
		src: taskStatusPreview,
		fallback: taskStatusFallback,
	},
	TaskCreated: {
		src: taskCreatedPreview,
		fallback: taskCreatedFallback,
	},
	ServicePlan: {
		src: servicePlanPreview,
		fallback: servicePlanFallback,
	},
	Reassess: {
		src: null,
		fallback: null,
	},
	PastDue: {
		src: pastDuePreview,
		fallback: pastDueFallback,
	},
	ActualTime: {
		src: null,
		fallback: null,
	},
};
const REPORTS_CONFIG = [
	{
		name: `Exception Report`,
		route: `/exception`,
		icon: `archive`,
		previewSrc: REPORT_PREVIEW_ASSETS?.Exception?.src,
		fallback: REPORT_PREVIEW_ASSETS?.Exception?.fallback,

		desc: REPORT_DESCRIPTIONS[`Exception Report`],
		isDisabled: false,
		hide: false,
	},
	{
		name: `Completion Report`,
		route: `/completion`,
		icon: `checkbox`,
		previewSrc: REPORT_PREVIEW_ASSETS?.Completion?.src,
		fallback: REPORT_PREVIEW_ASSETS?.Completion?.fallback,
		desc: REPORT_DESCRIPTIONS[`Completion Report`],
		isDisabled: false,
		hide: false,
	},
	{
		name: `Past Due Report`,
		route: `/pastdue`,
		icon: `chartDark`,
		previewSrc: REPORT_PREVIEW_ASSETS?.PastDue?.src,
		fallback: REPORT_PREVIEW_ASSETS?.PastDue?.fallback,
		desc: REPORT_DESCRIPTIONS[`Past Due Report`],
		isDisabled: false,
		hide: false,
	},
	{
		name: `Service Plan Report`,
		route: `/serviceplan`,
		icon: `news`,
		previewSrc: REPORT_PREVIEW_ASSETS?.ServicePlan?.src,
		fallback: REPORT_PREVIEW_ASSETS?.ServicePlan?.fallback,
		desc: REPORT_DESCRIPTIONS[`Service Plan Report`],
		isDisabled: false,
		hide: false,
	},
	{
		name: `Reassess Report`,
		route: `/reassess`,
		icon: `openBook`,
		previewSrc: REPORT_PREVIEW_ASSETS?.Reassess?.src,
		fallback: REPORT_PREVIEW_ASSETS?.Reassess?.fallback,
		desc: REPORT_DESCRIPTIONS[`Reassess Report`],
		isDisabled: false,
		hide: false,
	},
	{
		name: `Task Created Report`,
		route: `/taskcreated`,
		icon: `archive`,
		previewSrc: REPORT_PREVIEW_ASSETS?.TaskCreated?.src,
		fallback: REPORT_PREVIEW_ASSETS?.TaskCreated?.fallback,
		desc: REPORT_DESCRIPTIONS[`Task Created Report`],
		isDisabled: false,
		hide: false,
	},
	{
		name: `Task Status Report`,
		route: `/taskstatus`,
		icon: `chartLight`,
		previewSrc: REPORT_PREVIEW_ASSETS?.TaskStatus?.src,
		fallback: REPORT_PREVIEW_ASSETS?.TaskStatus?.fallback,
		desc: REPORT_DESCRIPTIONS[`Task Status Report`],
		isDisabled: false,
		hide: false,
	},
	{
		name: `Actual Time Report`,
		route: `/actualtime`,
		icon: `stopwatch`,
		previewSrc: REPORT_PREVIEW_ASSETS?.ActualTime?.src,
		fallback: REPORT_PREVIEW_ASSETS?.ActualTime?.fallback,
		desc: REPORT_DESCRIPTIONS[`Actual Time Report`],
		isDisabled: true,
		hide: true,
	},
];

////////////////////////////////////////////////////////////////////////
/////////////////// DEFAULT PICKER CONFIG(S) & UTILS ///////////////////
////////////////////////////////////////////////////////////////////////

// CONFIG AMENDMENT HELPERS //

// applies changes (additive) to 'Daily' config ONLY
const amendDailyConfig = (config, name, options) => {
	return {
		...config,
		Daily: {
			...config.Daily,
			[name]: options,
		},
	};
};
// applies changes (additive) to 'Historical' config ONLY
const amendHistoricalConfig = (config, name, options) => {
	return {
		...config,
		Historical: {
			...config.Historical,
			[name]: options,
		},
	};
};
// applies changes (additive) to both 'Daily' & 'Historical' configs
const amendConfigMany = (config, name, options) => {
	return {
		...config,
		Daily: {
			...config.Daily,
			[name]: options,
		},
		Historical: {
			...config.Historical,
			[name]: options,
		},
	};
};

// settings.filterBy - By Resident/Facility/ADL
const BASE_FILTERS = [
	{
		name: "filterBy",
		id: "Resident",
		label: "By Resident",
	},
	{
		name: "filterBy",
		id: "Facility",
		label: "By Facility",
	},
	{
		name: "filterBy",
		id: "ADL",
		label: "By ADL",
	},
];
// settings.filterByXXXX - requires an array of options typically derived from props
const BASE_FILTER_OPTIONS = [];
// settings.shiftXX toggles: AM/PM/NOC
const BASE_SHIFT_OPTIONS = [
	{
		name: "shiftAM",
		id: "shiftAM",
		label: "AM",
	},
	{
		name: "shiftPM",
		id: "shiftPM",
		label: "PM",
	},
	{
		name: "shiftNOC",
		id: "shiftNOC",
		label: "NOC",
	},
];
// settings.sortByXXXX - 'By Resident', 'By Facility' etc.
const BASE_SORTS = [
	{
		id: "By Resident",
		label: "By Resident",
	},
	{
		id: "By ADL",
		label: "By ADL",
	},
	{
		id: "By Shift",
		label: "By Shift",
	},
	{
		id: "By Staff",
		label: "By Staff",
	},
	{
		id: "By Floor Unit",
		label: "By Unit Type",
	},
];
// settings.sortByXXXX sub options (ie 'Ascending'/'Descending')
const BASE_SORT_OPTIONS = {
	sortByResident: [
		{
			name: "sortByADL",
			id: "None",
			label: "No sorting",
		},
		{
			name: "sortByResident",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByResident",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByStaff: [
		{
			name: "sortByADL",
			id: "None",
			label: "No sorting",
		},
		{
			name: "sortByStaff",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByStaff",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByShift: [], // no sub options
	sortByADL: [
		{
			name: "sortByADL",
			id: "None",
			label: "No sorting",
		},
		{
			name: "sortByADL",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByADL",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByFloorUnit: [], // no sub options
	sortByException: [],
};

////////////////////////////////////////////////////////////////////////
/////////////////////////// CUSTOM CONFIG(S) ///////////////////////////
////////////////////////////////////////////////////////////////////////

const COMBINED_CONFIG = {
	Daily: {
		filters: [...BASE_FILTERS],
		filterOptions: [],
		shiftOptions: [...BASE_SHIFT_OPTIONS],
		sorts: [],
		sortOptions: {},
	},
	Historical: {
		filters: [...BASE_FILTERS],
		filterOptions: [], // is custom populated in <XXXXXXXXReport/> view
		shiftOptions: [...BASE_SHIFT_OPTIONS],
		sorts: [...BASE_SORTS],
		sortOptions: { ...BASE_SORT_OPTIONS },
	},
};
//////////////////////////////////////////////
//// DAILY/HISTORICAL - COMPLETION REPORT ////
//////////////////////////////////////////////
const COMPLETION_FILTERS = [
	{
		name: "filterBy",
		id: "Resident",
		label: "By Resident",
	},
	{
		name: "filterBy",
		id: "Facility",
		label: "By Facility",
	},
	{
		name: "filterBy",
		id: "ADL",
		label: "By ADL",
	},
];
const COMPLETION_FILTER_OPTIONS = [...BASE_FILTER_OPTIONS];
const COMPLETION_SHIFT_OPTIONS = [...BASE_SHIFT_OPTIONS];
const COMPLETION_SORTS = [...BASE_SORTS];
const COMPLETION_SORT_OPTIONS = { ...BASE_SORT_OPTIONS };

const COMPLETION_CONFIG = {
	Daily: {
		filters: [...COMPLETION_FILTERS],
		filterOptions: [],
		shiftOptions: [...COMPLETION_SHIFT_OPTIONS],
		sorts: [],
		sortOptions: [],
	},
	Historical: {
		filters: [...COMPLETION_FILTERS],
		filterOptions: [...COMPLETION_FILTER_OPTIONS],
		shiftOptions: [...COMPLETION_SHIFT_OPTIONS],
		sorts: [...COMPLETION_SORTS],
		sortOptions: { ...COMPLETION_SORT_OPTIONS },
	},
};
//////////////////////////////////////////////
//// DAILY/HISTORICAL - EXCEPTION REPORT ////
//////////////////////////////////////////////
const EXCEPTION_FILTERS = [...BASE_FILTERS];
const EXCEPTION_FILTER_OPTIONS = [...BASE_FILTER_OPTIONS];
const EXCEPTION_SHIFT_OPTIONS = [...BASE_SHIFT_OPTIONS];
// Resident, ADL, TaskDesc, Staff, ExceptionType, IsPastDue, Shift
const EXCEPTION_SORTS = [
	...BASE_SORTS,
	{
		id: "By Task Description",
		label: "By Task Description",
	},
	{
		id: "By Exception Type",
		label: "By Exception Type",
	},
	{
		id: "Is Past Due",
		label: "Is Past Due",
	},
];
const EXCEPTION_SORT_OPTIONS = {
	...BASE_SORT_OPTIONS,
	sortByResident: [
		{
			name: "sortByResident",
			id: "None",
			label: "No sorting",
		},
		{
			name: "sortByResident",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByResident",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByTaskDescription: [
		{
			name: "sortByTaskDescription",
			id: "None",
			label: "No sorting",
		},
		{
			name: "sortByTaskDescription",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByTaskDescription",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByIsPastDue: [],
	sortByUnitType: [
		{
			name: "sortByUnitType",
			id: "None",
			label: "None",
		},
		{
			name: "sortByUnitType",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByUnitType",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByShift: [],
	sortByStaff: [
		{
			name: "sortByStaff",
			id: "None",
			label: "None",
		},
		{
			name: "sortByStaff",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByStaff",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByFloorUnit: [
		{
			name: "sortByFloorUnit",
			id: "None",
			label: "No sorting",
		},
		{
			name: "sortByFloorUnit",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByFloorUnit",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByExceptionType: [],
};

const EXCEPTION_CONFIG = {
	Daily: {
		filters: [...COMPLETION_FILTERS],
		filterOptions: [],
		shiftOptions: [...COMPLETION_SHIFT_OPTIONS],
		sorts: [],
		sortOptions: [],
	},
	Historical: {
		filters: [...EXCEPTION_FILTERS],
		filterOptions: [...EXCEPTION_FILTER_OPTIONS],
		shiftOptions: [...EXCEPTION_SHIFT_OPTIONS],
		sorts: [...EXCEPTION_SORTS],
		sortOptions: { ...EXCEPTION_SORT_OPTIONS },
	},
};

//////////////////////////////////////////////
/// DAILY/HISTORICAL - TASK-STATUS REPORT ///
//////////////////////////////////////////////
const TASKSTATUS_FILTERS = [...BASE_FILTERS];
const TASKSTATUS_FILTER_OPTIONS = [];
const TASKSTATUS_SHIFT_OPTIONS = [...BASE_SHIFT_OPTIONS];
const TASKSTATUS_SORTS = [...BASE_SORTS];
const TASKSTATUS_SORT_OPTIONS = {
	sortByResident: [
		{
			name: "sortByResident",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByResident",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByADL: [],
	sortByShift: [],
	sortByStaff: [
		{
			name: "sortByStaff",
			id: "None",
			label: "No sorting",
		},
		{
			name: "sortByStaff",
			id: "Ascending",
			label: "Ascending (A-Z)",
		},
		{
			name: "sortByStaff",
			id: "Descending",
			label: "Descending (Z-A)",
		},
	],
	sortByFloorUnit: [],
};

const TASKSTATUS_CONFIG = {
	Daily: {
		filters: [],
		filterOptions: [],
		shiftOptions: [],
		sorts: [],
		sortOptions: {},
	},
	Historical: {
		filters: [...TASKSTATUS_FILTERS],
		filterOptions: [...TASKSTATUS_FILTER_OPTIONS],
		shiftOptions: [...TASKSTATUS_SHIFT_OPTIONS],
		sorts: [...TASKSTATUS_SORTS],
		sortOptions: { ...TASKSTATUS_SORT_OPTIONS },
	},
};

//////////////////////////////////////////////
///// DAILY/HISTORICAL - PAST-DUE REPORT /////
//////////////////////////////////////////////
const PASTDUE_FILTERS = [];
const PASTDUE_FILTER_OPTIONS = [];
const PASTDUE_SHIFT_OPTIONS = [];
const PASTDUE_SORTS = [];
const PASTDUE_SORT_OPTIONS = {};

const PASTDUE_CONFIG = {
	Daily: {
		filters: [...PASTDUE_FILTERS],
		filterOptions: [],
		shiftOptions: [],
		sorts: [],
		sortOptions: [],
	},
	Historical: {
		filters: [...PASTDUE_FILTERS],
		filterOptions: [...PASTDUE_FILTER_OPTIONS],
		shiftOptions: [...PASTDUE_SHIFT_OPTIONS],
		sorts: [...PASTDUE_SORTS],
		sortOptions: { ...PASTDUE_SORT_OPTIONS },
	},
};

//////////////////////////////////////////////
///// DAILY/HISTORICAL - REASSESS REPORT /////
//////////////////////////////////////////////
const REASSESS_FILTERS = [...BASE_FILTERS];
const REASSESS_FILTER_OPTIONS = [...BASE_FILTER_OPTIONS];
const REASSESS_SHIFT_OPTIONS = [...BASE_SHIFT_OPTIONS];
const REASSESS_SORTS = [...BASE_SORTS];
const REASSESS_SORT_OPTIONS = { ...BASE_SORT_OPTIONS };

const REASSESS_CONFIG = {
	Daily: {
		filters: [...REASSESS_FILTERS],
		filterOptions: [...REASSESS_FILTER_OPTIONS],
		shiftOptions: [...REASSESS_SHIFT_OPTIONS],
		sorts: [...REASSESS_SORTS],
		sortOptions: { ...REASSESS_SORT_OPTIONS },
	},
	Historical: {
		filters: [...REASSESS_FILTERS],
		filterOptions: [...REASSESS_FILTER_OPTIONS],
		shiftOptions: [...REASSESS_SHIFT_OPTIONS],
		sorts: [...REASSESS_SORTS],
		sortOptions: { ...REASSESS_SORT_OPTIONS },
	},
};

//////////////////////////////////////////////
/// DAILY/HISTORICAL - TASK-CREATED REPORT ///
//////////////////////////////////////////////
const TASKCREATED_FILTERS = [
	{
		name: "filterBy",
		id: "Resident",
		label: "By Resident",
	},
	{
		name: "filterBy",
		id: "Facility",
		label: "By Facility",
	},
];
const TASKCREATED_FILTER_OPTIONS = [...BASE_FILTER_OPTIONS];
const TASKCREATED_SHIFT_OPTIONS = [...BASE_SHIFT_OPTIONS];
const TASKCREATED_SORTS = [...BASE_SORTS];
const TASKCREATED_SORT_OPTIONS = { ...BASE_SORT_OPTIONS };

const TASKCREATED_CONFIG = {
	Daily: {
		filters: [...TASKCREATED_FILTERS],
		filterOptions: [...TASKCREATED_FILTER_OPTIONS],
		shiftOptions: [...TASKCREATED_SHIFT_OPTIONS],
		sorts: [...TASKCREATED_SORTS],
		sortOptions: { ...TASKCREATED_SORT_OPTIONS },
	},
	Historical: {
		filters: [...TASKCREATED_FILTERS],
		filterOptions: [...BASE_FILTER_OPTIONS],
		shiftOptions: [...TASKCREATED_SHIFT_OPTIONS],
		sorts: [],
		sortOptions: { ...TASKCREATED_SORT_OPTIONS },
	},
};

//////////////////////////////////////////////
/// DAILY/HISTORICAL - SERVICE-PLAN REPORT ///
//////////////////////////////////////////////
const SERVICEPLAN_FILTERS = [...BASE_FILTERS];
const SERVICEPLAN_FILTER_OPTIONS = [...BASE_FILTER_OPTIONS];
const SERVICEPLAN_SHIFT_OPTIONS = [];
const SERVICEPLAN_SORTS = [...BASE_SORTS];
const SERVICEPLAN_SORT_OPTIONS = { ...BASE_SORT_OPTIONS };

const SERVICEPLAN_CONFIG = {
	Daily: {
		filters: [...SERVICEPLAN_FILTERS],
		filterOptions: [...SERVICEPLAN_FILTER_OPTIONS],
		shiftOptions: [...SERVICEPLAN_SHIFT_OPTIONS],
		sorts: [...SERVICEPLAN_SORTS],
		sortOptions: { ...SERVICEPLAN_SORT_OPTIONS },
	},
	Historical: {
		filters: [...SERVICEPLAN_FILTERS],
		filterOptions: [...BASE_FILTER_OPTIONS],
		shiftOptions: [...SERVICEPLAN_SHIFT_OPTIONS],
		sorts: [],
		sortOptions: { ...SERVICEPLAN_SORT_OPTIONS },
	},
};

// helpers
export { amendDailyConfig, amendHistoricalConfig, amendConfigMany };

export {
	BASE_FILTERS,
	BASE_FILTER_OPTIONS,
	BASE_SHIFT_OPTIONS,
	BASE_SORTS,
	BASE_SORT_OPTIONS,
};

// base/default config
export { COMBINED_CONFIG };

// custom config(s)
export {
	EXCEPTION_CONFIG,
	COMPLETION_CONFIG,
	TASKSTATUS_CONFIG,
	PASTDUE_CONFIG,
	REASSESS_CONFIG,
	TASKCREATED_CONFIG,
	SERVICEPLAN_CONFIG,
};

// REPORT 'CARDS' PREVIEW ASSETS & CONFIG
export { REPORT_PREVIEW_ASSETS, REPORTS_CONFIG };
