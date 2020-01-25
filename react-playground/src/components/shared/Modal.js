import React from "react";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/Modal.module.scss";
import sprite from "../../assets/buttons.svg";

const Modal = ({ title, closeModal, children }) => {
  return (
    <aside className={styles.Modal}>
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
