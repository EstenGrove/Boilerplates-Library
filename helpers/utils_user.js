import { user } from "./utils_endpoints";
import { test } from "./utils_env";
import { isEmptyArray } from "./utils_types";

const getUserProfile = async (token, userID) => {
	let url = test.base + user.getProfile;
	url += "?userId=" + userID;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			}),
		});
		const response = await request.json();
		const profile = await JSON.parse(response.Data);
		return profile;
	} catch (err) {
		console.log("An error occured: " + err);
		return err.message;
	}
};

const getUserProfileByEmail = async (token, email) => {
	let url = test.base + user.getProfileByEmail;
	url += "?" + new URLSearchParams({ userEmail: email });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			}),
		});
		const response = await request.json();
		const profile = response.Data[0];
		return profile;
	} catch (err) {
		return console.log("An error occured: " + err);
	}
};

// user field related helpers

// checks if user has access to multiple facilities
const hasMultiFacility = (facilityList = []) => {
	if (isEmptyArray(facilityList) || facilityList.length <= 1) {
		return false;
	}
	return true;
};

// FORMATTING HELPERS
// formats user's name: LastName, FirstName
const formatUserNameLast = (task) => {
	const firstName = task?.EntryUserFirstName ?? task?.UserFirstName;
	const lastName = task?.EntryUserLastName ?? task?.UserLastName;

	if (task?.TaskStatus === `AUTO-COMPLETED`) {
		return `${firstName} ${lastName}`;
	}

	return `${lastName}, ${firstName}`;
};
const formatUserNameLastSvcPlan = (record) => {
	const { UpdatedBy } = record;

	return formatUserNameLast(UpdatedBy);
};

export { getUserProfile, getUserProfileByEmail };

// user-field utils
export { hasMultiFacility };

// formatting utils
export { formatUserNameLast, formatUserNameLastSvcPlan };
