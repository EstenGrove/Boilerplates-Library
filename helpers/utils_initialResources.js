import { getResidentsByUserEmail } from "./utils_residents";
import { getUserProfileByEmail, hasMultiFacility } from "./utils_user";
import {
	fetchDailyResidentData,
	getResidentLOA,
	isLOA,
} from "./utils_residentData";
import { sortResidentsBy } from "./utils_residents";
import { getUnscheduledTasks } from "./utils_unscheduled";
import { handleEmpties, isEmptyVal } from "./utils_types";
import { getFacilitiesByUserEmail } from "./utils_facility";
import { groupBy } from "./utils_processing";

const initialFacility = {
	communityName: null,
	facilityID: null,
	parentID: null,
	residents: [],
	shifts: [],
	address: {},
	exceptionTypes: [],
};

// called 1st upon successful auth
// - updated to run 'in-parallel'
// - updated 6/9/2020 3:05 PM
// fetches list of residents and user profile when authenticated
const getInitialResource = async (auth) => {
	if (isEmptyVal(auth?.token) || isEmptyVal(auth?.username)) return;

	const { token, username } = auth;
	const [facilityList, residentData, profileData] = await Promise.all([
		getFacilitiesByUserEmail(token, username),
		getResidentsByUserEmail(token, username),
		getUserProfileByEmail(token, username),
	]);

	const { ADVUSER } = profileData;
	const userProfile = ADVUSER[0];
	const residents = residentData.Data;

	return {
		facilityList: facilityList,
		residents: residents,
		userProfile: userProfile,
		auth: auth,
	};
};
// called 2nd upon successful auth
const syncResourceToState = (resource, state, dispatch) => {
	const { authData, userProfile, residents, facilityList } = resource; // fetched from APIs

	// sets facility for NON-ADMIN users
	const getFacilityByUserType = (facilityList) => {
		const isAdmin = hasMultiFacility(facilityList);
		if (isAdmin) {
			return { ...initialFacility };
		} else {
			const [currentFacility] = facilityList;
			const {
				CommunityName,
				FacilityId,
				ParentFacilityId,
				Address,
				Shifts,
			} = currentFacility;

			const resByFacility = groupBy(residents, (x) => x.FacilityId)[FacilityId];

			return {
				communityName: CommunityName,
				facilityID: FacilityId,
				parentID: ParentFacilityId,
				residents: [...resByFacility],
				shifts: [...Shifts],
				address: {
					street: Address.Street,
					city: Address.City,
					state: Address.State,
					zip: Address.Zip,
				},
			};
		}
	};

	if (residents && residents.length) {
		return dispatch({
			type: "SUCCESS",
			data: {
				newState: {
					...state,
					user: {
						...state.user,
						facilities: handleEmpties(facilityList),
						firstName: userProfile?.strFirstName,
						lastName: userProfile?.strLastName,
						facilityID: userProfile?.guidFacility,
						userID: userProfile?.guidUser,
						title: userProfile?.strTitle,
						username: authData?.username,
						password: authData?.password,
						token: authData?.token,
						isSuperUser: userProfile?.superUser,
						isAdmin: userProfile?.bitFacilityAdministrator,
						hasMultiFacility: hasMultiFacility(facilityList),
					},
					globals: {
						...state.globals,
						residents: [...sortResidentsBy(residents, "Name")],
						residentsByFacility: { ...groupBy(residents, (x) => x.FacilityId) },
						currentFacility: getFacilityByUserType(facilityList),
					},
				},
			},
		});
	}
};

const mergeDailyResidentData = async (token, residentID, day = new Date()) => {
	const dailyData = await fetchDailyResidentData(token, residentID, day);
	const unscheduledTasks = await getUnscheduledTasks(token, residentID);
	const l_o_a = await getResidentLOA(token, residentID); // leave_of_absence

	const merged = {
		...dailyData,
		UnscheduledTasks: unscheduledTasks,
		LOA: [l_o_a],
		ResidentID: residentID,
	};
	return { ...merged };
};

const populateState = (data, state) => {
	const {
		ADL,
		ADLCareTask,
		ADLCareTaskHistory,
		ADLCareTaskFuture,
		ADLCareLevel,
		Resident,
		ResidentID, // comes from API - LEAVE ALONE!!!
		AssessmentTrackingTask,
		AssessmentTrackingTaskNote,
		AssessmentFacilityException,
		Charts,
		Vitals,
		UnscheduledTasks,
		UnscheduledTasksRaw,
		ADLCategory,
		LOA,
		Medications,
	} = data;
	const [resident] = Resident;

	const newState = {
		...state,
		globals: {
			...state.globals,
			currentFacility: {
				...state.globals.currentFacility,
				exceptions: handleEmpties(AssessmentFacilityException),
			},
			currentResident: {
				...resident,
				ResidentID: ResidentID,
				isLOA: isLOA(LOA[0]),
				Meds: handleEmpties(Medications),
			},
			adlDescriptions: handleEmpties(ADL),
			unscheduledTasks: handleEmpties(UnscheduledTasks),
			unscheduledTasksRaw: handleEmpties(UnscheduledTasksRaw),
			scheduledTasks: handleEmpties(ADLCareTask),
			scheduledTaskNotes: handleEmpties(AssessmentTrackingTaskNote),
			scheduledTasksHistory: handleEmpties(ADLCareTaskHistory),
			scheduledTasksFuture: handleEmpties(ADLCareTaskFuture),
			trackingTasks: handleEmpties(AssessmentTrackingTask),
			categories: handleEmpties(ADLCareLevel),
			activeCategories: handleEmpties(ADLCategory),
			charting: handleEmpties(Charts),
			vitals: handleEmpties(Vitals),
			loa: handleEmpties(LOA),
		},
	};

	return { ...newState };
};

export { populateState };

export { getInitialResource, syncResourceToState, mergeDailyResidentData };
