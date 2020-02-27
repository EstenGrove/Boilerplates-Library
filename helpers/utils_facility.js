import { test } from "./utils_env";
import { facility, generic } from "./utils_endpoints";

const getFacilityList = async (token, index = 0, rows = 20) => {
	let url = test.base + facility.get.facilityList;
	url += "?" + new URLSearchParams({ index: index, rows: rows });

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
		console.log("✅ Success! ", response.Data);
		return response.Data;
	} catch (err) {
		console.log("❌ ERROR: 'getFacilityList' had an error", err);
		return err.message;
	}
};

const getFacilityDetails = async (token, params) => {
	let url = test.base + generic.get;
	url +=
		"?" +
		new URLSearchParams({
			"db-meta": "Advantage",
			source: "FACILITY",
			...params
		});

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
		return response.Data[0];
	} catch (err) {
		console.log("❌ ERROR: 'getFacilityList' had an error", err);
		return err.message;
	}
};

export { getFacilityList, getFacilityDetails };
