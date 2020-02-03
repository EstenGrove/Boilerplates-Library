import React from "react";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick.js";
import styles from "../../css/shared/ModalSM.module.scss";
import sprite from "../../assets/buttons.svg";

const ModalSM = ({ title, closeModal, children }) => {
  const modalSMRef = useRef();
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
    <aside className={styles.ModalSM} ref={modalSMRef}>
      <header className={styles.ModalSM_header}>
        <h2 className={styles.ModalSM_header_title}>{title}</h2>
        <svg className={styles.ModalSM_header_closeIcon} onClick={closeModal}>
          <use xlinkHref={`${sprite}#icon-clearclose`}></use>
        </svg>
      </header>
      <section className={styles.ModalSM_main}>{children}</section>
    </aside>
  );
};

export default ModalSM;

ModalSM.defaultProps = {};

ModalSM.propTypes = {
  title: PropTypes.string,
  closeModal: PropTypes.func,
  children: PropTypes.element
};
