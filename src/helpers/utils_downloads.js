import { test } from "./utils_env";
import { downloads } from "./utils_endpoints";

//////////////////////////////////////////////////////
/////////////// FILE DOWNLOAD HELPERS ///////////////
//////////////////////////////////////////////////////

/**
 * @description - A download helper that fetches a file from an API, transforms the response to a file blob, then triggers a "saveAs" dialog to save the file locally.
 * @param {string} token - A base64-encoded auth token.
 * @param {number} id - A numeric FileRegistryID, that points to a file in the ALA DMS repo.
 * @param {string} filename - A complete filename including the file extension.
 */
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
		console.log("✅ SUCCESS! BLOB was downloaded", blob);
		return saveFile(blob, filename);
	} catch (err) {
		console.log("❌ Oops. Your 'downloadFile' request failed: " + err);
		return err.message;
	}
};


/////////////////////////////////////////////////////////
////////////////// FILE DOWNLOAD UTILS //////////////////
/////////////////////////////////////////////////////////


/**
 * @description - A download helper that triggers a file download by creating a download link and clicking it programmatically.
 * @param {blob} blob - A file blob(from the response object).
 * @param {string} filename - A custom filename including the file extension.
 */
const saveFile = (blob, filename) => {
	const fileURL = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = fileURL;
	link.download = filename;
	link.click();
	return window.URL.revokeObjectURL(fileURL);
};

// creates an objectURL used for embedding content or triggering a file download
// creates minor memory leak, since the URL isn't cleaned up after
// use with discretion
// consider storing the fileURL in state in order to "revokeObjectURL" when it's no longer needed.
const createURL = blob => {
	const fileURL = window.URL.createObjectURL(blob);
	return fileURL;
};

///////////////////////////////////////////////
///////////// FILE READER HELPERS /////////////
///////////////////////////////////////////////

// accepts a blob and a mimeType..
// and transforms the blob based off the mimeType.
const createBlob = (blob, mimeType = "application/octet-stream") => {
	const fileBlob = new Blob([blob], { type: mimeType });
	return fileBlob;
};
// inits a new "FileReader" instance.
// invokes the "readAsDataURL" method
// listens for the result, which can be used for embedding in an <embed/> element
const createDataURL = blob => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);

	return (reader.onload = () => {
		console.log("reader.result", reader.result);
		return reader.result;
	});
};
// accepts a blob, creates an array buffer and returns the result
const createArrayBuffer = blob => {
	const reader = new FileReader();
	reader.readAsArrayBuffer(blob);

	reader.onload = () => {
		console.log("reader.result", reader.result);
		return reader.result;
	};
};
// accepts a blob and read binary data as text
const createReaderText = blob => {
	const reader = new FileReader();
	reader.readAsText(blob);

	reader.onload = () => {
		console.log("reader.result", reader.result);
		return reader.result;
	};
};


// DOWNLOAD REQUEST UTILS //
export { downloadFile, downloadFileMany };

// FILE/DOWNLOAD PROCESSING UTILS //
export {
	createURL,
	createBlob,
	saveFile,
	createDataURL,
	createArrayBuffer,
	createReaderText
};
