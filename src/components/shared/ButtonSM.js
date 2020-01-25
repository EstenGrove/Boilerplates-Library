import React from "react";
import styles from "../../css/shared/ButtonSM.module.scss";
import { PropTypes } from "prop-types";

const ButtonSM = ({
  isDisabled = false,
  handleClick,
  handleSubmit,
  children,
  customStyles
}) => {
  return (
    <button
      className={styles.ButtonSM}
      disabled={isDisabled}
      onClick={handleClick}
      onSubmit={handleSubmit}
      style={customStyles}
    >
      {children}
    </button>
  );
};

export default ButtonSM;

ButtonSM.defaultProps = {
  isDisabled: false
};

ButtonSM.propTypes = {
  isDisabled: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ]),
  customStyles: PropTypes.object
};
