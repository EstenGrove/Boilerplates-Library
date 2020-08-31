import { test } from "./utils_env";
import { generic } from "./utils_endpoints";
import { genericCount as genericCountParams } from "./utils_params";

/**
 * @description - A helper for fetching a count of records from a given table in the database.
 * @param {Atring} token - Base64 encoded auth token.
 * @param {Object} params - An object of query string params, to stringify to the url.
 * @param {String} type - The 'type' of count to fetch (ie all residents, tasks etc.)
 * @returns {Number} - Returns a number representing the counted table's records.
 */
const getGenericCount = async (token, params, type = "residents") => {
	let url = test.base + generic.count;
	url +=
		"?" +
		new URLSearchParams({
			...genericCountParams[type],
			...params,
		});

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
		console.log("An error occurred ", err);
		return err.message;
	}
};
/**
 * @description - A helper for fetching a count of records from a given table in the database.
 * @param {Atring} token - Base64 encoded auth token.
 * @param {Object} params - An object of query string params, to stringify to the url.
 * @param {String} type - The 'type' of count to fetch (ie all residents, tasks etc.)
 * @returns {Number} - Returns a number representing the counted table's records.
 */
const genericCount = async (token, params, type = "residents") => {
	let url = test.base + generic.count;
	url +=
		"?" +
		new URLSearchParams({
			...genericCountParams[type],
			...params,
		});

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
		console.log("An error occurred ", err);
		return err.message;
	}
};

/**
 * @description - Generic GET2 API helper for fetching specific datasets raw from a given table.
 * @param {String} token - Auth token
 * @param {Object} params - Query params, that are required for defining the 'database name' & the 'table name' to fetch data from.
 */
const genericGet = async (token, params) => {
	let url = test.base + generic.get2;
	url += "?" + new URLSearchParams({ ...params });

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
		console.log(`✅ Success! Generic 'GET2':`, response);
		return response.Data;
	} catch (err) {
		console.log(`❌ Oops!. Generic 'GET2' failed:`, err);
		return err.message;
	}
};

// COUNTS
export { getGenericCount, genericCount };
// GETS
export { genericGet };
