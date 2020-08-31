import { login } from "./helpers/utils_auth";

let token;

const btn = document.getElementById("btn"); // download button
const mirror = document.getElementById("mirror"); // iframe mirror

const setAuth = async () => {
	const auth = await login(
		"trainingsb2@aladvantage.com",
		"1Donuts",
		"AdvantageTracker"
	);
	if (auth) {
		token = auth;
		console.log("✅ SUCCESS! YOU ARE LOGGED IN: \n", token);
		return token;
	}
	return console.log("❌ Oops. Login failed. Please try again. \n", token);
};
// window.onload = () => setAuth();

btn.addEventListener("click", e => {
	console.log("Do something here...");
});
