import React from "react";
import styles from "../../css/shared/Alert.module.scss";
import sprite from "../../assets/alerts.svg";
import { PropTypes } from "prop-types";
import { BORDERS, ICONS, FILLS } from "../../helpers/utils_styles";

// <AlertIcon/> HELPERS
const ICONSIZES = {
	XSM: styles.AlertIcon_icon_XSM,
	SM: styles.AlertIcon_icon_SM,
	MD: styles.AlertIcon_icon_MD,
	LG: styles.AlertIcon_icon_LG,
	XLG: styles.AlertIcon_icon_XLG,
};
// <Alert/> HELPERS
const SIZES = {
	XSM: styles.Alert_XSM,
	SM: styles.Alert_SM,
	MD: styles.Alert_MD,
	LG: styles.Alert_LG,
	XLG: styles.Alert_XLG,
};
// <AlertHeadings/> HELPERS
const HEADINGS = {
	XSM: styles.AlertHeadings_heading_XSM,
	SM: styles.AlertHeadings_heading_SM,
	MD: styles.AlertHeadings_heading_MD,
	LG: styles.AlertHeadings_heading_LG,
	XLG: styles.AlertHeadings_heading_XLG,
};
const SUBHEADINGS = {
	XSM: styles.AlertHeadings_subheading_XSM,
	SM: styles.AlertHeadings_subheading_SM,
	MD: styles.AlertHeadings_subheading_MD,
	LG: styles.AlertHeadings_subheading_LG,
	XLG: styles.AlertHeadings_subheading_XLG,
};

const AlertHeadings = ({ heading, subheading, text, size = "MD" }) => {
	return (
		<hgroup className={styles.AlertHeadings}>
			<h3 className={HEADINGS[size]}>{heading}</h3>
			<h6 className={SUBHEADINGS[size]}>{subheading}</h6>
			<p className={styles.AlertHeadings_text}>{text}</p>
		</hgroup>
	);
};

const AlertIcon = ({ type = "SUCCESS", size = "MD" }) => {
	return (
		<div className={styles.AlertIcon}>
			<svg className={ICONSIZES[size]}>
				<use xlinkHref={`${sprite}#icon-${ICONS[type]}`} fill={FILLS[type]} />
			</svg>
		</div>
	);
};

const Alert = ({
	heading,
	subheading,
	text,
	size = "MD",
	type = "ERROR",
	closeHandler,
}) => {
	return (
		<aside className={SIZES[size]}>
			<div className={styles.Alert_left} style={{ borderLeft: BORDERS[type] }}>
				<AlertIcon type={type} size={size} />
			</div>
			<div className={styles.Alert_group}>
				<AlertHeadings
					size={size}
					heading={heading}
					subheading={subheading}
					text={text}
				/>
			</div>
			<div className={styles.Alert_close}>
				<svg className={styles.Alert_close_icon} onClick={closeHandler}>
					<use xlinkHref={`${sprite}#icon-close-outline`} />
				</svg>
			</div>
		</aside>
	);
};

// ALERT PROPTYPES
Alert.defaultProps = {
	type: "INFO",
};
Alert.propTypes = {
	heading: PropTypes.string.isRequired,
	subheading: PropTypes.string,
	text: PropTypes.string,
	type: PropTypes.string,
};

// ALERTHEADINGS PROPTYPES
AlertHeadings.defaultProps = {
	size: "MD",
};
AlertHeadings.propTypes = {
	heading: PropTypes.string.isRequired,
	subheading: PropTypes.string,
	text: PropTypes.string,
};

// ALERTICON PROPTYPES
AlertIcon.defaultProps = {
	size: "MD",
	type: "SUCCESS",
};
AlertIcon.propTypes = {
	type: PropTypes.string,
	size: PropTypes.string,
};

// EXPORTS //

export default Alert;
export { AlertIcon, AlertHeadings };
