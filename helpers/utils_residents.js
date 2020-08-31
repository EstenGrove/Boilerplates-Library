import { residents } from "./utils_endpoints";
import { test } from "./utils_env";
import { isEmptyArray, isEmptyVal, isEmptyObj } from "./utils_types";
import { addEllipsis } from "./utils_processing";
import { format } from "date-fns";

const getResidentsByUserEmail = async (token, email) => {
	let url = test.base + residents.byUserEmail;
	url += "?" + new URLSearchParams({ userEmail: email }); // params: { userEmail: "someEmail@example.com" }

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			},
		});
		const response = await request.json();
		return response;
	} catch (err) {
		console.log("An error occurred " + err);
		return err.message;
	}
};

const getResidentsByFacility = async (token, facilityID) => {
	let url = test.base + residents.byFacility;
	url += "?facilityId=" + facilityID;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			}),
		});
		const response = await request.json();
		return response;
	} catch (err) {
		console.log("An error occured: " + err);
		return err.message;
	}
};

// RESIDENT FORMATTING HELPERS //

// formats residents for <ResidentDropdown/> menu options (ie string)
const formatResidents = (residents) => {
	if (isEmptyArray(residents)) return;
	return residents.map(
		({ FirstName, LastName, ResidentID }) =>
			`${FirstName} ${LastName} ~ ALA ID: ${ResidentID}`
	);
};

// formats a "single" resident for the <ResidentDropdown/> string
const formatResidentOnly = (resident) => {
	if (isEmptyObj(resident) || isEmptyVal(resident.ResidentID)) return;
	const { FirstName, LastName, ResidentID } = resident;
	return `${FirstName} ${LastName} ~ ALA ID: ${ResidentID}`;
};

const formatResidentNameLast = (resident) => {
	const firstName = resident?.ResidentFirstName ?? resident.FirstName;
	const lastName = resident?.ResidentLastName ?? resident.LastName;
	return `${lastName}, ${firstName}`;
};

// used specifically for handling the LOA return date.
// DOES NOT accept an actual date but rather a stringifyied date
const formatLOAReturnDate = (returnDate) => {
	if (isEmptyVal(returnDate)) return `Unknown Return Date`;
	return format(returnDate, "M/D/YYYY");
};

const formatLOALeaveDate = (leaveDate) => {
	if (isEmptyVal(leaveDate)) return `Unknown`;
	const newLeave = new Date(leaveDate);
	return `on ${format(newLeave, "M/D/YYYY")}`;
};

const formatLOANotice = (loaList = []) => {
	if (isEmptyArray(loaList)) return;
	const [currentLOA] = loaList[0];
	const { LeaveDate, ReturnDate } = currentLOA;
	const leaveDate = formatLOALeaveDate(LeaveDate);
	const returnDate = formatLOAReturnDate(ReturnDate);

	let loaMsg = `On Leave of Absence Starting `;
	loaMsg += `${leaveDate} `;
	loaMsg += `and Returning ${returnDate}`;
	return loaMsg;
};

// parses the resident selection string using a separator (ie ":")
// extracts the resident's first, last name and residentID
const parseResidentSelection = (resident, separator = ":") => {
	// if (resident.length < 7) return;
	if (!resident.includes("~ ALA ID:")) return;
	const first = resident.split(" ")[0].trim();
	const last = resident.split(" ")[1].trim();
	const id = resident.split(separator)[1].trim();

	return {
		firstName: first,
		lastName: last,
		residentID: id,
	};
};

// takes a string (ie from <CustomDropdown/>) & extracts the ResidentID
const getResidentID = (str) => {
	return Number(str.split("ALA ID:")[1].trim());
};

const formatResidentName = (currentResident) => {
	if (isEmptyVal(currentResident.ResidentID)) return "";
	const { FirstName, LastName } = currentResident;
	return `${FirstName} ${LastName}`;
};

const formatResName = (currentResident) => {
	if (isEmptyVal(currentResident.ResidentID)) return "";
	const { FirstName, LastName } = currentResident;
	return `${FirstName} ${LastName}`;
};

// sorts by 'LastName' & formats as string for <CustomDropdown/>
const formatAndSortResidents = (residents = []) => {
	return residents
		.sort((a, b) => {
			return a.LastName.localeCompare(b.LastName);
		})
		.map(({ FirstName, LastName, ResidentID }) => {
			return `${FirstName} ${LastName} ~ ALA ID: ${ResidentID}`;
		});
};

// formats name: 'FirstName LastName'
// used <DailySummaryCard/>
const getResidentName = (resident) => {
	if (isEmptyObj(resident)) return "Please load a resident";
	const { FirstName, LastName } = resident;
	return `${FirstName} ${LastName}`;
};

// removes extra string characters and ONLY returns resident name (first & last)
const trimResidentName = (str) => {
	if (isEmptyVal(str)) return;
	return str.split(" ~")[0];
};
const trimResidentID = (str) => {
	if (isEmptyVal(str)) return;
	return Number(str.split("ALA ID:")[1].trim());
};

// accepts a list of residents and a sortBy value to sort wiht
// THIS IS WHERE FILTERING, SORTING, AND SEARCHING SHOULD BE CONTROLLED FROM
// accepts a list of residents and a sortBy value to sort wiht
const sortResidentsBy = (residents = [], sortBy) => {
	switch (sortBy) {
		case "Name": {
			return [...residents].sort((a, b) => {
				return a.LastName.localeCompare(b.LastName);
			});
		}
		case "Floor Unit": {
			return [...residents].sort((a, b) => {
				// handles empty vals
				if (isEmptyVal(a?.FloorUnit) || isEmptyVal(b?.FloorUnit)) return;
				return a?.FloorUnit.localeCompare(b?.FloorUnit);
			});
		}
		case "Room #": {
			return [...residents].sort((a, b) => {
				// handles empty vals
				if (isEmptyVal(a?.RoomNum) || isEmptyVal(b?.RoomNum)) return;
				return a?.RoomNum.localeCompare(b?.RoomNum);
			});
		}
		case "ALA ID": {
			return [...residents].sort((a, b) => {
				return b.ResidentID - a.ResidentID;
			});
		}
		case "Age": {
			return [...residents].sort((a, b) => {
				return a.Age - b.Age;
			});
		}
		default:
			return [...residents];
	}
};

// prevents text-overflow in <ResidentTable/>
const enforceNameLength = (resident, maxLength = 20) => {
	if (isEmptyObj(resident)) return "Unknown";
	const { FirstName, LastName } = resident;
	const name = `${FirstName} ${LastName}`;

	return addEllipsis(name, maxLength);
};

// USED IN <ResidentTable/> to get the selected residentIDs from the resident's arrat
const getSelected = (residents = []) => {
	if (isEmptyArray(residents)) return [];
	return residents.map(({ ResidentID }) => ResidentID);
};

// check for 'currentResident'; not just selected resident
const noResidentLoaded = (currentResident = {}) => {
	if (isEmptyObj(currentResident) || isEmptyVal(currentResident?.ResidentID)) {
		return true;
	}
	return false;
};

// compares 'currentResident' from global state w/ the dropdown selection
// returns true if they match, otherwise false
// used for showing/hiding daily cards
const isSameResident = (selectedVal, currentResident = {}) => {
	if (isEmptyVal(selectedVal) || isEmptyObj(currentResident)) return false;
	const id = getResidentID(selectedVal);
	const { ResidentID } = currentResident;
	if (id === ResidentID) {
		return true;
	}
	return false;
};

const matchResidentByID = (residentID, residents) => {
	return residents.reduce((match, cur) => {
		if (cur.ResidentID === residentID) {
			match = { ...cur };
			return match;
		}
		return match;
	}, {});
};

/**
 * @description - Finds the matching resident record from a selected resident string.
 * @param {Object} resByFacility - An object of residents grouped by facility; each facilityID is an object key.
 * @param {String} curFacilityID - The current facility's ID.
 * @param {String} residentStr - The selected resident string to be parsed (ie 'JOHN DOE ~ ALA ID: 123456')
 * @returns {Object} - Returns the matching resident record obj.
 */
const getResidentObj = (resByFacility, curFacilityID, residentStr) => {
	const residentID = getResidentID(residentStr);
	const residents = resByFacility[curFacilityID];
	const currentRes = matchResidentByID(residentID, residents);
	return { ...currentRes };
};

/**
 * @description - Iterates thru each resident & groups them by 'FacilityId' as the keys in the obj.
 * @param {Array} residentList - An array of resident records w/ FacilityId.
 * @returns {Object} - Returns an object w/ each key being a 'FacilityId' with the list of residents as the value.
 * { 'ekd3-8djj2-kanq11-pwos9': [...] }
 */
const groupResByFacilityID = (residentList = []) => {
	if (isEmptyArray(residentList)) return {};
	return residentList.reduce((byFacility, resident) => {
		const { FacilityId } = resident;
		if (!byFacility[FacilityId]) {
			byFacility[FacilityId] = [resident];
			return byFacility;
		}
		byFacility[FacilityId].push({ ...resident });
		return byFacility;
	}, {});
};

export { getResidentsByUserEmail, getResidentsByFacility };

export {
	trimResidentID,
	trimResidentName,
	formatResidentOnly, // identical to formatResidents except for single resident ONLY
	formatResidents,
	formatResidentNameLast, // lastName, firstName
	formatResName, // uses local state option (ie ResidentID instead of ResidentId)
	formatAndSortResidents, // used for ALASelector
	formatResidentName,
	formatLOALeaveDate,
	formatLOAReturnDate,
	formatLOANotice,
	parseResidentSelection,
	getResidentID,
	getResidentName,
	sortResidentsBy,
	groupResByFacilityID,
};

// get selected resident
export { matchResidentByID, getResidentObj };

// processing helpers
export { getSelected, enforceNameLength };

// checks if resident is loaded;
// used for showing / hiding the daily task cards
export { noResidentLoaded, isSameResident };
