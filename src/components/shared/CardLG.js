import React from "react";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/CardLG.module.scss";

const CardLG = ({ children, customStyles }) => {
  return (
    <section className={styles.CardLG} style={customStyles}>
      <div className={styles.CardLG_inner}>{children}</div>
    </section>
  );
};

export default CardLG;

CardLG.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
    PropTypes.array
  ]),
  customStyles: PropTypes.object
};
