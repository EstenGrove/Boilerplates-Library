import { test } from "./utils_env";
import { generic } from "./utils_endpoints";
import { getResidentsByUserEmail } from "./utils_residents";
import { getUserProfileByEmail } from "./utils_user";

///////////////////////////////////////
/////// GENERIC REQUEST HELPERS ///////
///////////////////////////////////////

const genericGet = async (token, params) => {
	let url = test.base + generic.get;
	url += "?" + new URLSearchParams(params);

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			}
		});
		const response = await request.json();
		console.log("✅ Success! ", response.Data);
		return response.Data;
	} catch (err) {
		console.log("❌ ERROR: 'getFacilityList' had an error", err);
		return err.message;
	}
};

const getInitialResource = async (auth, state, dispatch) => {
	const { token, username } = auth;
	const residentData = await getResidentsByUserEmail(token, username);
	const profileData = await getUserProfileByEmail(token, username);

	const { ADVUSER } = profileData;
	const userProfile = ADVUSER[0];
	const residents = residentData.Data;

	return {
		residents: residents,
		userProfile: userProfile,
		auth: auth
	};
};

const syncResourceToState = (resource, state, dispatch) => {
	const { authData, userProfile, residents } = resource; // fetched from APIs
	if (residents && residents.length) {
		return dispatch({
			type: "SUCCESS",
			data: {
				newState: {
					...state,
					user: {
						...state.user,
						firstName: userProfile.strFirstName,
						lastName: userProfile.strLastName,
						facilityID: userProfile.guidFacility,
						userID: userProfile.guidUser,
						username: authData.username,
						password: authData.password,
						token: authData.token,
						isAdmin: userProfile.alaAdmin
					},
					globals: {
						...state.globals,
						residents: residents
					}
				}
			}
		});
	}
};

// GENERIC REQUEST HELPERS //
export { genericGet };

export { getInitialResource, syncResourceToState };
