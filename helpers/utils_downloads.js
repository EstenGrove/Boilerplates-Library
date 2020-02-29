import { test } from "./utils_env";
import { downloads } from "./utils_endpoints";

const downloadFile = async (token, id, callback = null) => {
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
		const blob = await new Blob([request]);
		if (callback) return await callback(blob);
		console.log("BLOB", blob);
		return await blob;
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

const startDownload = (blob, filename) => {
	const link = document.createElement("a");
	const url = window.URL.createObjectURL(blob);

	link.href = url;
	link.download = filename;
	document.body.appendChild(link);

	link.click();
	window.URL.revokeObjectURL(url);
	return;
};

export { downloadFile, downloadFileMany };

// UTILS
export { startDownload };
