import React, { useRef, useEffect } from "react";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { useLockBodyScroll } from "../../utils/useLockBodyScroll";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/ModalLG.module.scss";
import sprite from "../../assets/buttons.svg";

const ModalLG = ({ title, closeModal, children }) => {
	const largeModalRef = useRef();
	const { isOutside } = useOutsideClick(largeModalRef);
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
		<aside className={styles.ModalLG} ref={largeModalRef}>
			<section className={styles.ModalLG_top}>
				<h4 className={styles.ModalLG_top_title}>{title}</h4>
				<svg className={styles.ModalLG_top_icon} onClick={closeModal}>
					<use xlinkHref={`${sprite}#icon-clearclose`}></use>
				</svg>
			</section>
			<section className={styles.ModalLG_main}>{children}</section>
		</aside>
	);
};

export default ModalLG;

ModalLG.propTypes = {
	title: PropTypes.string,
	closeModal: PropTypes.func,
	children: PropTypes.element,
};
