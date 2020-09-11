import React, { useRef, useEffect } from "react";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { useLockBodyScroll } from "../../utils/useLockBodyScroll";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/ModalFull.module.scss";
import sprite from "../../assets/buttons.svg";

// FULLSCREEN MODAL W/ "CLICK-OUTSIDE-TO-CLOSE" & "LOCK-BODY-ON-OPEN" FUNCTIONALITY BUILT-IN
// ✅ - "CLICK-OUTSIDE-TO-CLOSE"
// ✅ - "LOCK-BODY-SCROLL-WHEN-OPEN"

const ModalFull = ({ title, closeModal, children }) => {
	const fullModalRef = useRef();
	const { isOutside } = useOutsideClick(fullModalRef);
	useLockBodyScroll();

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
	}, [isOutside, closeModal]);
	return (
		<aside className={styles.ModalFull} ref={fullModalRef}>
			<section className={styles.ModalFull_top}>
				<h4 className={styles.ModalFull_top_title}>{title}</h4>
				<svg className={styles.ModalFull_top_icon} onClick={closeModal}>
					<use xlinkHref={`${sprite}#icon-clearclose`}></use>
				</svg>
			</section>
			<section className={styles.ModalFull_main}>{children}</section>
		</aside>
	);
};

export default ModalFull;

ModalFull.propTypes = {
	title: PropTypes.string,
	closeModal: PropTypes.func,
	children: PropTypes.element,
};
