import React, { useState } from "react";
import styles from "../../css/shared/AccordionSection.module.scss";
import sprite from "../../assets/carets-arrows.svg";
import { PropTypes } from "prop-types";

const notRotated = {
	transform: "rotate(0)",
};

const rotated = {
	transform: "rotate(90deg)",
};

const AccordionSection = ({ label, defaultState = false, children }) => {
	const [isOpen, setIsOpen] = useState(defaultState);

	return (
		<div className={styles.AccordionSection}>
			<section className={styles.AccordionSection_top}>
				<button
					className={styles.AccordionSection_top_btn}
					onClick={() => setIsOpen(!isOpen)}
				>
					<span>{label}</span>
					<svg
						className={styles.AccordionSection_top_btn_icon}
						style={!isOpen ? notRotated : rotated}
					>
						<use xlinkHref={`${sprite}#icon-caret-right`}></use>
					</svg>
				</button>
			</section>
			{isOpen && (
				<section className={styles.AccordionSection_content}>
					{children}
				</section>
			)}
		</div>
	);
};

export default AccordionSection;

AccordionSection.defaultProps = {
	defaultState: false,
};

AccordionSection.propTypes = {
	defaultState: PropTypes.bool,
	label: PropTypes.string,
	children: PropTypes.any,
};
