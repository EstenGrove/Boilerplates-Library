import React from "react";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/CardMD.module.scss";

const CardMD = ({ children, customStyles }) => {
  return (
    <section className={styles.CardMD} style={customStyles}>
      <div className={styles.CardMD_inner}>{children}</div>
    </section>
  );
};

export default CardMD;

CardMD.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
    PropTypes.array
  ]),
  customStyles: PropTypes.object
};
