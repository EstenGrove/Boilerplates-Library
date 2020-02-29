import { test } from "./utils_env";
import { uploads } from "./utils_endpoints";

////////////////////////////////////
//////// CRUD FILE HELPERS ////////
///////////////////////////////////

/**
 * @description A helper that will save a file registry entry to the DMS, in preparation/in parallel of a file upload.
 * @param {string} token - A base64 encoded auth token
 * @param {object} model - A file registry model with populated date for the file to be saved to the DMS.
 * @param {function} callback - An optional callback function to invoke upon success
 */
const saveFileRegistry = async (token, model, callback = null) => {
	let url = test.base + uploads.saveFileRegistry;

	const registry = JSON.stringify(model);

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: new Headers({
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json; charset=utf+8"
			}),
			body: registry
		});
		const response = await request.json();
		console.log(response);
		callback ? callback(response.Data) : response;
		return response.Data;
	} catch (err) {
		return console.log("An error occured: " + err);
	}
};

export { saveFileRegistry };
