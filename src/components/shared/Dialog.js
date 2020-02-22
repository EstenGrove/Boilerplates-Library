import React, { useRef, useEffect } from "react";
import styles from "../../css/shared/Dialog.module.scss";
import sprite from "../../assets/modals-complete.svg";
import closeIcon from "../../assets/buttons.svg";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { DIALOG_ICONS as icons, themeColors } from "../../helpers/utils_styles";

// CUSTOM DIALOG W/ PINNED MOBILE STYLES
// CUSTOM ICON OPTIONS: "WARN", "ERROR", "SUCCESS", "INFO"

// CUSTOM STYLES FOR THE ICON WRAPPER (ie background around icon)
const WRAP_COLORS = {
	ERROR: themeColors.flat.red,
	WARN: themeColors.flat.red,
	SUCCESS: themeColors.flat.green,
	INFO: themeColors.flat.purple,
	PRINT: themeColors.blueGreys.main,
	SAVE: themeColors.flat.green,
	CHECKMARK: themeColors.flat.purple,
	SIGNATURE: themeColors.flat.blue,
	ALARM: themeColors.flat.red,
	EDIT: themeColors.flat.orange,
	HELP: themeColors.flat.blue,
	CALENDAR: themeColors.greys.chalk,
	CALENDAR_DONE: themeColors.flat.green,
	CALENDAR_MISSED: themeColors.flat.red,
	USER: themeColors.flat.purple,
	CHART: themeColors.flat.violet,
	SETTINGS: themeColors.flat.purple,
	ALERT: themeColors.flat.red,
	SHOW: themeColors.flat.violet,
	IMAGES: themeColors.flat.purple
};

// CUSTOM STYLES/FILL FOR ICON, BASED OFF ICON TYPE
const ICON_COLORS = {
	ERROR: themeColors.main.red,
	WARN: themeColors.main.red,
	SUCCESS: themeColors.main.green,
	INFO: themeColors.main.main,
	PRINT: themeColors.main.blackBlue,
	SAVE: themeColors.blueGreys.headings,
	CHECKMARK: themeColors.main.main,
	SIGNATURE: themeColors.main.blue,
	ALARM: themeColors.main.red,
	EDIT: themeColors.main.altRed,
	HELP: themeColors.brand.darkBlue,
	CALENDAR: themeColors.main.blackBlue,
	CALENDAR_DONE: themeColors.main.green,
	CALENDAR_MISSED: themeColors.main.red,
	USER: themeColors.main.purple,
	CHART: themeColors.main.violet,
	SETTINGS: themeColors.main.blackBlue,
	ALERT: themeColors.main.red,
	SHOW: themeColors.main.main,
	IMAGES: themeColors.main.main
};

const Dialog = ({
	title,
	heading,
	subheading,
	text,
	closeModal,
	icon = "SUCCESS",
	children
}) => {
	const modalRef = useRef();
	const { isOutside } = useOutsideClick(modalRef);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (isOutside) {
			return closeModal();
		}

		return () => {
			isMounted = false;
		};
	}, [closeModal, isOutside]);

	return (
		<aside className={styles.Dialog} ref={modalRef}>
			<section className={styles.Dialog_top}>
				<div
					className={styles.Dialog_top_iconWrapper}
					style={{ backgroundColor: WRAP_COLORS[icon] }}
				>
					<svg className={styles.Dialog_top_iconWrapper_icon}>
						<use
							xlinkHref={`${sprite}#icon-${icons[icon]}`}
							style={{ fill: ICON_COLORS[icon] }}
						></use>
					</svg>
				</div>
				<h2
					className={styles.Dialog_top_title}
					style={{ color: ICON_COLORS[icon] }}
				>
					{title}
				</h2>
				<svg className={styles.Dialog_top_closeIcon} onClick={closeModal}>
					<use xlinkHref={`${closeIcon}#icon-clearclose`}></use>
				</svg>
			</section>
			<section className={styles.Dialog_inner}>
				<h2 className={styles.Dialog_inner_heading}>{heading}</h2>
				<h6 className={styles.Dialog_inner_subheading}>{subheading}</h6>
				<p className={styles.Dialog_inner_text}>{text}</p>
			</section>
			<section className={styles.Dialog_bottom}>{children}</section>
		</aside>
	);
};

export default Dialog;

Dialog.defaultProps = {};

Dialog.propTypes = {
	title: PropTypes.string,
	heading: PropTypes.string,
	subheading: PropTypes.string,
	text: PropTypes.string,
	closeModal: PropTypes.func.isRequired,
	children: PropTypes.any
};
