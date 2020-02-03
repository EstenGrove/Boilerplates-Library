import React, { useRef } from "react";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick.js";
import styles from "../../css/shared/Modal.module.scss";
import sprite from "../../assets/buttons.svg";

const Modal = ({ title, closeModal, children }) => {
  const modalRef = useRef();
  const { isOutside } = useOutsideClick(modalSmRef);

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
    <aside className={styles.Modal} ref={modalRef}>
      <section className={styles.Modal_top}>
        <h4 className={styles.Modal_top_title}>{title}</h4>
        <svg className={styles.Modal_top_icon} onClick={closeModal}>
          <use xlinkHref={`${sprite}#icon-clearclose`}></use>
        </svg>
      </section>
      <section className={styles.Modal_main}>{children}</section>
    </aside>
  );
};

export default Modal;

Modal.propTypes = {
  title: PropTypes.string,
  closeModal: PropTypes.func,
  children: PropTypes.element
};
