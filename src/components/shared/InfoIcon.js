import React, { useState } from "react";
import styles from "../../css/shared/InfoIcon.module.scss";
import sprite from "../../assets/modals-complete.svg";
import { PropTypes } from "prop-types";
import { debounce } from "../../helpers/utils_processing";

// info-with-circle

const SIZES = {
	XSM: {
		width: "1.4rem",
		height: "1.4rem",
	},
	SM: {
		width: "2rem",
		height: "2rem",
	},
	MD: {
		width: "3rem",
		height: "3rem",
	},
	LG: {
		width: "4rem",
		height: "4rem",
	},
	XLG: {
		width: "5rem",
		height: "5rem",
	},
};

const InfoIcon = ({ hoverText, size = "SM", customStyles = {} }) => {
	const [showHoverText, setShowHoverText] = useState(false);
	const custom = {
		...SIZES[size],
		...customStyles,
	};

	return (
		<aside
			className={styles.InfoIcon}
			onMouseEnter={() => debounce(setShowHoverText(true), 800)}
			onMouseLeave={() => debounce(setShowHoverText(false), 800)}
		>
			<svg className={styles.InfoIcon_icon} style={custom}>
				<use xlinkHref={`${sprite}#icon-info-with-circle`}></use>
			</svg>

			{showHoverText && (
				<div className={styles.InfoIcon_tooltip}>
					<div className={styles.InfoIcon_tooltip_text}>{hoverText}</div>
				</div>
			)}
		</aside>
	);
};

export default InfoIcon;

InfoIcon.defaultProps = {};

InfoIcon.propTypes = {
	hoverText: PropTypes.string.isRequired,
};
