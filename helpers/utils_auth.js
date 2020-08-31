import { isEmptyVal, isEmptyObj } from "./utils_types";
import { auth } from "./utils_endpoints";
import { test } from "./utils_env";
import { getFromStorage } from "./utils_caching";
import { extractParams } from "./utils_params";
import { differenceInMinutes } from "date-fns";

//////////////////////////////////////////////////////////////////////////
/////////////////////////// AUTH REQUEST UTILS ///////////////////////////
//////////////////////////////////////////////////////////////////////////

/**
 * Various auth-related web-service utils for logging in & out of ALA Services.
 */

/**
 * @description - Login utility for a single user.
 * @param {String} username - A user's username, typically an email address.
 * @param {String} password - A user's password
 * @param {String} appID - An application ID name (ie 'AdvantageTracker')
 * @param {Function} callback - An optional callback function to be invoked upon success.
 */
const login = async (username, password, appID, callback = null) => {
	let url = test.base + auth.login;
	url += "?loginId=" + username;
	url += "&loginPwd=" + password;
	url += "&loginApp=" + appID;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		if (callback) return callback();

		return response.Data;
	} catch (err) {
		console.log("An error has occurred" + err.message);
		return err;
	}
};
/**
 * @description - Logou utility for a single user.
 * @param {String} token - A user's auth token.
 * @returns {Boolean} - Returns 'true' if successful.
 */
const logout = async (token) => {
	let url = test.base + auth.logout;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();

		return response.Data;
	} catch (err) {
		console.log("An error has occurred" + err.message);
		return err;
	}
};
/**
 * @description - Auth utility that checks if a user's session is valid for a given application.
 * @param {String} token - A base54 auth token.
 * @param {String} appID - A string-form application ID name.
 * @param {Function} callback - An optional callback to be invoked upon success.
 * @returns {Boolean} - Returns 'true' if user's auth session is valid.
 */
const checkLoginStatus = async (token, appID, callback = null) => {
	let url = test.base + auth.loginStatus;
	url += "?loginApp=" + appID;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		if (callback) return callback();
		return response.Data;
	} catch (err) {
		console.log("An error occurred in the checkLoginStatus fn", err);
		return err.message;
	}
};
/**
 * @description - Auth util that refreshes a stale or close to expiring token, with a new, fresh token.
 * @param {String} token - An auth security token, that's close to expiry.
 * @returns {String} - Returns a fresh, new string token.
 */
const refreshAuthToken = async (token) => {
	let url = test.base + auth.refreshToken;
	// if no 'token', request is invalid
	if (isEmptyVal(token)) return false;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		console.log(`✅ Success! Auth was 'refreshed'!`, response.Data);
		return response.Data;
	} catch (err) {
		console.log(`❌ Oops! Auth-refresh attempt failed:`, err);
		return err.message;
	}
};
/**
 * @description - Auth utility that validates whether a user's session token is valid or not.
 * @param {String} token - An auth token
 * @returns {Boolean} - Returns 'true' if token is still valid.
 */
const validateAuth = async (token) => {
	let url = test.base + auth.validateToken;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		console.log(`✅ Success! Token is valid.`, response.Data);
		return response.Data;
	} catch (err) {
		console.log(`❌ Oops! Token is invalid`, err);
		return err.message;
	}
};
/**
 * @description - Auth/session util that fetches both application, user, facility and session metadata based off the security token.
 * @param {String} token - Base64 encoded auth token. If coming from 'extractParams()' util, then MUST re-encode the token via "btoa()"
 * @returns {Object} - Returns an object of Application, User, Facility, and Session data.
 * - "response.ApplicationId": unique string-form numeric id, representing the associated ALA app.
 * - "response.ApplicationName": the app name, as a string.
 * - "response.Environment": the current environment associated w/ the token.
 * - "response.FacilityId": the primary facilityID associated w/ the user & token.
 * - "response.FacilityName": the primary facility name.
 * - "response.FacilityTimeZoneId": timezone of the facility.
 * - "response.SecurityToken": the actual refreshed security token.
 * - "response.SessionDate": date & time of the session start time.
 * - "response.SessionTimeoutInMinutes": remaining time in user's session, in minutes.
 * - "response.UserEmail": user's email.
 * - "response.UserFirstName": user's first name.
 * - "response.UserLastName": user's last name.
 * - "response.UserId": user's unique id.
 * - "response.UserPasswordEncrypt": encrypted version of the user's password.
 */
const getSessionDetails = async (token) => {
	let url = test.base + auth.sessionDetails;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		console.log(`✓ Success! Auth was retrieved.`, response.Data);
		return response.Data;
	} catch (err) {
		console.log(`❌ Oops! Auth was NOT found.`, err);
		return err.message;
	}
};
/**
 * @description - Fetches application access details for a user from their email address.
 * @param {String} token - Base64 encoded auth token
 * @param {String} userEmail - Current user's email address.
 * - "response.AccessibleApps": an array of application detail objects:
 * 		- "AccessibleApps.ApplicationId": string-form numeric app id.
 * 		- "AccessibleApps.ApplicationName": string application name.
 * 		- "AccessibleApps.IsAccessible": boolean for user access.
 * - "response.FacilityId": facility id.
 * - "response.FacilityName": string facility name.
 * - "response.FacilityTimeZoneId": time zone description.
 * - "response.IsValidUser": boolean for whether username exists in ALA Services.
 * - "response.PossibleUserMatches": list of username matches, implying typo or incorrect spelling.
 * - "response.UserEmail": user's email address.
 * - "response.UserId": uid.
 * - "response.UserFirstName": user's first name.
 * - "response.UserLastname": user's last name.
 * - "response.UserPasswordEncrypt": encrypted user password.
 */
const getUserAccessByEmail = async (token, userEmail) => {
	let url = test.base + auth.userAccessByEmail;
	url += "?" + new URLSearchParams({ userEmail });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("An error happened", err);
		return err.message;
	}
};
/**
 * @description - Takes the existing 'authData' object, extracts the user credentials and re-authenticates.
 * @param {Object} authData - Auth data such as username & password, used to re-authenticate a user session.
 * @param {Function} callback - An optional callback function to be invoked upon successful authentication.
 * @returns {String|Function} - Returns the token or callback w/ the token, IF a callback is provided.
 */
const reAuth = async (authData, callback = null) => {
	const appID = `AdvantageTracker`;
	const { username, password } = authData;
	const newToken = await login(username, password, appID, null);

	if (!isEmptyVal(newToken)) {
		return !callback ? newToken : callback(newToken);
	} else {
		return newToken;
	}
};

//////////////////////////////////////////////////////////////////////////
////////////////////////// DERIVED AUTH HELPERS //////////////////////////
//////////////////////////////////////////////////////////////////////////

/**
 * @description - Checks for a user's 'authData' in localStorage.
 * @param {String} authKey - A unique key for a user's auth data in localStorage.
 * @returns {Object} - Returns any existing 'authData' or returns an empty {}
 */
const getExistingAuth = (authKey) => {
	const auth = getFromStorage(authKey);
	if (!isEmptyVal(auth?.token)) {
		return { ...auth };
	} else {
		return {};
	}
};
/**
 * @description - Accepts a token & fetches user, application & session data based off that token. Useful for external 'hot-linking'.
 * @param {String} token - A base64 encoded security token.
 * @return {Object} - Returns an object w/ user, app, facility & session data.
 */
const getDerivedAuth = async (token) => {
	if (isEmptyVal(token)) return {};
	const sessionData = await getSessionDetails(btoa(token));

	if (!sessionData || isEmptyObj(sessionData)) {
		return {};
	} else {
		return { ...sessionData };
	}
};
/**
 * @description - Extracts query params from url, checks for 'securityToken', then fetches the auth & session data.
 * @param {URL.href} windowLocation - Accepts the 'window.location' of the current tab.
 * @returns {Object} - Returns an object w/ the user, facility, app & session data; includes 'residentID'.
 */
const getDerivedState = async (windowLocation) => {
	const { href: url } = windowLocation;
	const { token, residentID, facilityID } = extractParams(url, [
		`token`,
		`residentID`,
		`facilityID`,
	]);
	if (!isEmptyVal(token)) {
		console.log(`token:`, token);

		const sessionData = await getDerivedAuth(token);
		return {
			token: token,
			residentID: Number(residentID),
			facilityID: facilityID,
			sessionData: sessionData,
		};
	} else {
		return {
			token: null,
			residentID: null,
			facilityID: null,
			sessionData: {},
		};
	}
};

/**
 * @description - Checks if a user's session 'expiry' is within the allowed range for user sessions.
 * @param {Date} expiry - A date instance (typicall from the 'authData' object) to compare it's age.
 * @param {Number} maxRange - A maximum value for allowed user sessions. Defaults to 30 (mins).
 * @returns {Boolean} - Returns true|false; whether session is active/valid
 */
const isActiveSession = (expiry, maxRange = 30) => {
	const diffToNow = differenceInMinutes(Date.now(), expiry);
	return diffToNow <= maxRange;
};

const hasSession = (appState, authData = {}) => {
	if (!appState.hasLoaded) {
		// check is 'authData' exists
		return isActiveSession(authData?.expiry, 30);
	} else {
		return false;
	}
};

export {
	login,
	logout,
	reAuth,
	refreshAuthToken,
	validateAuth,
	checkLoginStatus,
	getSessionDetails,
	getUserAccessByEmail,
};

export {
	getExistingAuth,
	isActiveSession,
	hasSession,
	getDerivedAuth,
	getDerivedState,
};
