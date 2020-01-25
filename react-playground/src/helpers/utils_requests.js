import { getResidentsByUserEmail } from "./utils_residents";
import { getUserProfileByEmail } from "./utils_user";

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

export { getInitialResource, syncResourceToState };
