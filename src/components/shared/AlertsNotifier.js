import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import SelfDestruct from "./SelfDestruct";
import Alert from "./Alert";

// PROPS REQUIREMENTS & DETAILS:
// 1. PASS A BOOLEAN VALUE FROM STATE (triggerAlert)
// 2. PASS THE STATE SETTER (resetTrigger)
// 3. PASS AN "ALERTS CONFIG" (alerts) TO HANDLE THE MESSAGES & TYPES
// 4. PASS AN "EXPIRATION DATE" FOR HOW LONG AN ALERT SHOW DISPLAY
// 5. PASS AN "ALERT TYPE" TO TELL THE <AlertsNotifier/> WHICH ALERT TO RENDER

const AlertsNotifier = ({
	triggerAlert = false,
	resetTrigger, // state setter
	type = "ERROR",
	expiry = 3000,
	alerts = {}
}) => {
	const [wasTriggered, setWasTriggered] = useState(false);
	const [killAlert, setKillAlert] = useState(false);

	const renderErrorUI = errorAlert => {
		return (
			<SelfDestruct triggerRender={triggerAlert} expiry={expiry}>
				<Alert
					type="ERROR"
					size="LG"
					heading={errorAlert.heading}
					subheading={errorAlert.subheading}
					closeHandler={() => setKillAlert(true)}
				/>
			</SelfDestruct>
		);
	};
	const renderWarnUI = warnAlert => {
		return (
			<SelfDestruct triggerRender={triggerAlert} expiry={expiry}>
				<Alert
					type="WARN"
					size="LG"
					heading={warnAlert.heading}
					subheading={warnAlert.subheading}
					closeHandler={() => setKillAlert(true)}
				/>
			</SelfDestruct>
		);
	};
	const renderSuccessUI = successAlert => {
		return (
			<SelfDestruct triggerRender={triggerAlert} expiry={expiry}>
				<Alert
					type="SUCCESS"
					size="LG"
					heading={successAlert.heading}
					subheading={successAlert.subheading}
					closeHandler={() => setKillAlert(true)}
				/>
			</SelfDestruct>
		);
	};
	const renderInfoUI = infoAlert => {
		return (
			<SelfDestruct triggerRender={triggerAlert} expiry={expiry}>
				<Alert
					type="INFO"
					size="LG"
					heading={infoAlert.heading}
					subheading={infoAlert.subheading}
					closeHandler={() => setKillAlert(true)}
				/>
			</SelfDestruct>
		);
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (killAlert) {
			setKillAlert(false);
			setWasTriggered(false);
			return resetTrigger(false);
		}

		return () => {
			isMounted = false;
		};
	}, [killAlert, resetTrigger, wasTriggered]);

	// used to keep track of whether an alert was triggered
	// used for knowing when to reset the "alert trigger"
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (triggerAlert) {
			return setWasTriggered(true);
		}

		return () => {
			isMounted = false;
		};
	}, [triggerAlert]);

	//"resetTrigger" is the setter that triggers an alert (passed as props from parent component)
	// this effect will reset the "alert trigger" to a default/ready state after running the alert's cycle
	// this effect prepares the alert to be triggered again after running.
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (triggerAlert && wasTriggered) {
			resetTrigger(false);
			setWasTriggered(false);
		}

		return () => {
			isMounted = false;
		};
	}, [wasTriggered, triggerAlert, resetTrigger]);

	return (
		<>
			{type === "ERROR" && !killAlert && renderErrorUI(alerts.ERROR)}
			{type === "SUCCESS" && !killAlert && renderSuccessUI(alerts.SUCCESS)}
			{type === "WARN" && !killAlert && renderWarnUI(alerts.WARN)}
			{type === "INFO" && !killAlert && renderInfoUI(alerts.INFO)}
		</>
	);
};

export default AlertsNotifier;

AlertsNotifier.defaultProps = {
	triggerAlert: false,
	alerts: {},
	type: "ERROR"
};

AlertsNotifier.propTypes = {
	type: PropTypes.string.isRequired,
	triggerAlert: PropTypes.bool.isRequired,
	resetTrigger: PropTypes.func.isRequired,
	alerts: PropTypes.object.isRequired,
	expiry: PropTypes.number
};
