import { test } from "./utils_env";
import { isEmptyVal, isEmptyObj, isEmptyArray } from "./utils_types";
import { getFileRegistry, downloads } from "./utils_endpoints";

////////////////////////////////////////////////////////
///////////////// FILE REQUEST HELPERS /////////////////
////////////////////////////////////////////////////////

/**
 * @description - Fetches a PDF file from ALA Services, and inits a PDF mirror via an embed element
 * @param {String} token - A base64 encoded auth token.
 * @param {Number} id - A "FileRegistryID" that refers to a file record in the ALA DMS.
 * @returns {Blob} - Returns a converted response object as a "Blob" instance. Used for embeddable content, mirror, file downloads etc.
 */
const getFileBlob = async (token, id) => {
	let url = test.base + downloads.getFile;
	url += "?id=" + id;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json",
			},
		});
		const blob = await request.blob();
		return blob;
	} catch (err) {
		console.log("❌ Oops. Your 'downloadPDF' request failed: " + err);
		return err.message;
	}
};

const getFileRegistryByFacility = async (token, facilityID) => {
	let url = test.base + getFileRegistry.byFacility;
	url += "?" + new URLSearchParams({ facilityId: facilityID });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			},
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("❌ Oops. Your 'downloadPDF' request failed: " + err);
		return err.message;
	}
};
const getFileRegistryByResident = async (token, residentID) => {
	let url = test.base + getFileRegistry.byResident;
	url += "?" + new URLSearchParams({ residentId: residentID });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			},
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("❌ Oops. Your 'downloadPDF' request failed: " + err);
		return err.message;
	}
};
const getFileRegistryByUser = async (token, userID) => {
	let url = test.base + getFileRegistry.byUser;
	url += "?" + new URLSearchParams({ userId: userID });

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
			},
		});
		const response = await request.json();
		return response.Data;
	} catch (err) {
		console.log("❌ Oops. Your 'downloadPDF' request failed: " + err);
		return err.message;
	}
};

/**
 * @description - Downloads then saves a file. Requires the correct file type in the 'filename'. (ie 'Photo.png' NOT just 'Photo')
 * @param {String} token - Auth token.
 * @param {Number|String} fileID - A valid 'FileRegistryID' or filename w/ the correct filepath preceding the filename (ie 'Resident/148471/images/ResidentPhoto.png')
 * @param {String} filename - A custom filename to save the file as.
 */
const fetchAndSaveFile = async (
	token,
	fileID,
	filename = `${Date.now().toString()}.png`
) => {
	const fileBlob = await getFileBlob(token, fileID);
	return saveFile(fileBlob, filename);
};

////////////////////////////////////////////////////////
/////////////// FILE PROCESSING HELPERS ///////////////
////////////////////////////////////////////////////////

/**
 * @description - A encoder helper for formatting a list of ids for use as query params.
 * @param {array} paramsList - An array of query param values to be encoded
 * @param {string} customKey - A custom key used to join to each param in "paramsList"
 */
const serializeWithKey = (paramsList, customKey) => {
	if (isEmptyArray(paramsList)) return console.warn("NO paramsList PROVIDED");
	return paramsList
		.map(
			(param) => encodeURIComponent(customKey) + "=" + encodeURIComponent(param)
		)
		.join("&");
};

/**
 * @description - A helper for converting data into a file blob w/ a custom mimetype.
 * @param {Blob|Response Object} data - Any transformable data type that can be converted to a blob. Typically a response object or blob.
 * @param {String} mimeType - A custom mimetype used to set the new Blob instance to.
 * @returns {Blob} - returns a file blob, w/ a custom mimetype.
 */
const createBlob = (data, mimeType = "application/octet-stream") => {
	return new Blob([data], { type: mimeType });
};

/**
 * @description - Utility that accepts a file blob and creates an object URL.
 * @param {Blob} blob - A file blob to be used for an object URL.
 */
const createURL = (blob) => {
	const fileURL = window.URL.createObjectURL(blob);
	return fileURL;
};

/**
 * @description - A utility for creating an object URI to trigger a file download to a user's machine.
 * @param {Blob} blob - A file blob, typically transformed from the HTTP response object
 * @param {String} filename - A custom filename used for saving the file to a user's machine.
 * @returns {Blob} - Returns a fileblob that's immediately downloaded to a user's machine.
 */
const saveFile = (blob, filename) => {
	const fileURL = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = fileURL;
	link.download = filename;
	link.click();
	return window.URL.revokeObjectURL(fileURL);
};

/**
 * @description - Fetches a file blob, converts it to pdf and creates the blobURL for mirroring.
 * @param {String} token - Auth token
 * @param {Number|String} fileID - A file's unique identifier or filename (w/ complete path)
 */
const getPDFSource = async (token, fileID) => {
	const blob = await getFileBlob(token, fileID);
	const pdfBlob = createBlob(blob, "application/pdf");
	const pdfURL = createURL(pdfBlob);

	return pdfURL;
};
const getIMGSource = async (token, fileID) => {
	const blob = await getFileBlob(token, fileID);
	const url = createURL(blob);
	return url;
};

///////////////////////////////////////////////
///////// GET FILE ATTRIBUTES/VALUES /////////
//////////////////////////////////////////////

// converts bytes to kb
const getFileSize = (bytes) => {
	if (isEmptyVal(bytes)) return 0;
	const size = (bytes / 1024).toFixed(2);
	return `${size} kb`;
};

// checks is a file is "ready" (ie for download/saving locally)
const isFileReady = (file) => {
	if (isEmptyObj(file)) return false;
	if (file.Status === "ready") return true;
	return false;
};

// converts x bytes to any unit between bytes-gb
const convertBytes = (bytes, to = "KB") => {
	switch (to) {
		case "B": {
			return `${bytes} b`;
		}
		case "KB": {
			const size = (bytes / 1024).toFixed(2);
			return `${size} KB`;
		}
		case "MB": {
			const size = (bytes / 1024 / 1024).toFixed(2);
			return `${size} MB`;
		}
		case "GB": {
			const size = (bytes / 1024 / 1024 / 1024).toFixed(4);
			return `${size} GB`;
		}
		default:
			return `${bytes} b`;
	}
};

const getFileID = (registryRecord) => {
	const { FileRegistryID } = registryRecord;
	return FileRegistryID;
};

// FILE PROCESSING HELPERS //
export { serializeWithKey, createBlob, createURL, saveFile, fetchAndSaveFile };

// REUQEST HELPERS
export {
	getFileBlob,
	getPDFSource,
	getIMGSource,
	getFileRegistryByFacility,
	getFileRegistryByResident,
	getFileRegistryByUser,
};

export { getFileSize, isFileReady, convertBytes };

export { getFileID };
