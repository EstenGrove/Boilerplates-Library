import { test } from "./utils_env";
import { downloads } from "./utils_endpoints";

// fetches a file, and starts download
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
		console.log("BLOB", blob);
		return saveFile(blob, filename);
	} catch (err) {
		console.log("There was an error " + err.message);
		return err;
	}
};

// downloads multiple files
const downloadFileMany = async (token, ids) => {
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
		const resClone = await request.clone();
		const resBlob = await resClone.blob();
		console.log("BLOB", resBlob);
		return data.Data;
	} catch (err) {
		console.log("There was an error " + err.message);
		return err;
	}
};

///////////////////////////////
///// FILE DOWNLOAD UTILS /////
///////////////////////////////

// accepts a blob and a mimeType.. 
// and transforms the blob based off the mimeType.
const createBlob = (blob, mimeType = "application/octet-stream") => {
  const fileBlob = new Blob([blob], { type: mimeType });
  return fileBlob;
}

// saves a blob as a file
const saveFile = (blob, filename) => {
	const fileURL = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = fileURL;
	link.download = filename;
	link.click();
	return window.URL.revokeObjectURL(fileURL);
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

const createArrayBuffer = blob => {
	const reader = new FileReader();
	reader.readAsArrayBuffer(blob);

	reader.onload = () => {
		console.log("reader.result", reader.result);
		return reader.result;
	};
};

const createReaderText = blob => {
	const reader = new FileReader();
	reader.readAsText(blob);

	reader.onload = () => {
		console.log("reader.result", reader.result);
		return reader.result;
	};
};

export { downloadFile, downloadFileMany };

// UTILS
export { saveFile, createDataURL, createArrayBuffer, createReaderText };
