import { test } from "./utils_env";
import { downloads } from "./utils_endpoints";
import { saveFile, serializeWithKey } from "./utils_files";

///////////////////////////////////////////////////
///////////// FILE DOWNLOAD REQUESTS /////////////
/////////////////////////////////////////////////

// fetches and downloads a file from ALA Services
const downloadFile = async (token, id, filename) => {
	let url = test.base + downloads.getFile;
	url += "?id=" + id;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			}
		});
		const blob = await request.blob();
		return saveFile(blob, filename);
	} catch (err) {
		console.log("❌ There was an error " + err.message);
		return err;
	}
};

// downloads multiple files as a zip
const downloadFileMany = async (token, ids, zipName) => {
	let url = test.base + downloads.getFile;
	url += "?" + serializeWithKey(ids, "id");

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token
			}
		});
		const blob = await request.blob();
		return saveFile(blob, zipName);
	} catch (err) {
		console.log("There was an error " + err.message);
		return err;
	}
};

/**
 * @description - A utility for download PDFs, specifically from ALA Services.
 * @param {String} token - A base64 encoded auth token.
 * @param {Number} id - A "FileRegistryID" that refers to a file, in numeric form.
 * @param {String} filename - A custom filename to be used for naming the file when it's downloaded either locally, or to the user's machine.
 * @returns {Blob} - Returns a file blob that immediately starts downloading the file.
 */
const downloadPDF = async (token, id, filename = "Report.pdf") => {
	let url = test.base + downloads.getFile;
	url += "?id=" + id;

	try {
		const request = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Basic " + btoa(test.user + ":" + test.password),
				SecurityToken: token,
				"Content-Type": "application/json"
			}
		});
		const pdfBlob = await request.blob();
		return saveFile(pdfBlob, filename);
	} catch (err) {
		console.log("There was an error " + err.message);
		return err;
	}
};

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
				"Content-Type": "application/json"
			}
		});
		const blob = await request.blob();
		return blob;
	} catch (err) {
		console.log("❌ Oops. Your 'downloadPDF' request failed: " + err);
		return err.message;
	}
};

export { downloadFile, downloadFileMany, downloadPDF, getFileBlob };
