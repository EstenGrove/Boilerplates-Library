import { test } from "./utils_env";
import { getFileRegistry } from "./utils_endpoints";

////////////////////////////////////
////////// GET FILE LIST //////////
///////////////////////////////////

const getFileRegistryByFacility = async (token, facilityID) => {
	let url = test.base + getFileRegistry.byFacility;
	url += "?facilityId=" + facilityID;

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
		console.log(response.Data);
		return response.Data;
	} catch (err) {
		console.log("An error has occurred " + err.message);
		return err;
	}
};

const getFileRegistryByResident = async (token, residentID) => {
	let url = test.base + getFileRegistry.byResident;
	url += "?residentId=" + residentID;

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
		console.log(response.Data);
		return response.Data;
	} catch (err) {
		console.log("An error has occurred " + err.message);
		return err;
	}
};

const getFileRegistryByUser = async (token, userID) => {
	let url = test.base + getFileRegistry.byUser;
	url += "?userId=" + userID;

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
		console.log(response.Data);
		return response.Data;
	} catch (err) {
		console.log("An error has occurred " + err.message);
		return err;
	}
};

// EXTRACT IMAGE TO FILES (RESIDENT PHOTOS) //
/**
 * @description - Helper that generates a file and saves it to the ALA DMS from a base64-encoded dataURI in the database.
 * @param {string} token - A base64 encoded auth token.
 * @param {number} residentID - A numeric version of a unique foreign key for a resident
 */
const extractResidentImgToFile = async (token, residentID) => {
	let url = test.base + getFileRegistry.byResident;
	url += "?residentId=" + residentID;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token
			}
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log(
			"❌ Oops. Your 'extractResidentImgToFile' request failed: ",
			err
		);
		return err.message;
	}
};

/**
 * @description - A encoder helper for formatting a list of ids for use as query params.
 * @param {array} paramsList - An array of query param values to be encoded
 * @param {string} customKey - A custom key used to join to each param in "paramsList"
 */
const serializeWithKey = (paramsList, customKey) => {
	if (isEmptyArray(paramsList)) return console.warn("NO paramsList PROVIDED");
	return paramsList
		.map(
			param => encodeURIComponent(customKey) + "=" + encodeURIComponent(param)
		)
		.join("&");
};

const serializer = params => {
	if (!params) return console.log("Empty params data", params);
	return Object.keys(params)
		.map((key, index) => {
			return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
		})
		.join("&");
};

// FETCHING LIST OF FILES BY *
export {
	extractResidentImgToFile,
	getFileRegistryByFacility,
	getFileRegistryByResident,
	getFileRegistryByUser
};

// QUERY PARAM UTILS
export { serializer, serializeWithKey };
