import packageJSON from "../../package.json";
import { format } from "date-fns";

/**
 * Update Endpoint & ENV Variables 6/2 at 8:00 AM
 * Azure ENV Endpoint: https://ala-api.azurewebsites.net
 */
const REACT_APP_ENV_AUTH = {
	development: {
		base: "https://localhost:5500/alaservices/v1/",
		user: "x-dev-user",
		password: "J99Hf2i3eY#2pqBj234tD2@H$%",
	},
	production: {
		base: "https://aladvantage.com/alaservices/v1/",
		user: "x-prod-user",
		password: "7U*hg%53^D*@bq-d@k8f2L$^fd4j",
	},
	testing: {
		base: "https://apitest.aladvantage.com/alaservices/v1/",
		user: "x-test-user",
		password: "M9hf^%2HHf3^$(sn@Kd23p#hsq",
	},
};

/**
 * Version Definition:
 * Syntax: "React.Version Date-of-Deploy"
 * XX.XX YYYY-MM-DD
 */
const getReactVersion = (json) => {
	const { dependencies: deps } = json;
	return deps?.react.replace("^", "");
};

// formats the 'Version' number
const getVersion = (reactVersion, timestamp) => {
	let version = `Version: `;
	version += `${reactVersion} `;
	version += timestamp;
	return version;
};

/**
 * - React Version #: 'XX.xx'
 * - Deploy Date: 'YYYY-MM-DD h:mm'
 * - Version #: 'Version: XX.xx YYYY-MM-DD h:mm'
 */
const REACT_APP_ENV_REACT_VERSION = getReactVersion(packageJSON);
const REACT_APP_ENV_DEPLOY_DATE = format(new Date(), "YYYY-MM-DD h:mm");
const REACT_APP_ENV_VERSION_NUMBER = getVersion(
	REACT_APP_ENV_REACT_VERSION,
	REACT_APP_ENV_DEPLOY_DATE
);
const REACT_APP_ENV_RELEASE = REACT_APP_ENV_VERSION_NUMBER;

const {
	development: dev,
	production: prod,
	testing: test,
} = REACT_APP_ENV_AUTH;

export { dev, prod, test };

export {
	REACT_APP_ENV_DEPLOY_DATE as deployDate,
	REACT_APP_ENV_REACT_VERSION as reactVersion,
	REACT_APP_ENV_VERSION_NUMBER as appVersion,
	REACT_APP_ENV_RELEASE as releaseNumber,
};
