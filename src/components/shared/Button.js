import React, { useState } from "react";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/Button.module.scss";
import sprite from "../../assets/buttons.svg";

const ICONS = {
  close: "clearclose",
  edit: "createmode_editedit",
  archive: "inventory",
  alarm: "access_alarmalarm",
  attachment: "attachment21",
  save: "save11",
  openBook: "open-book",
  upload: "cloud_uploadbackup",
  download: "cloud_download",
  cloud: "cloud5",
  chartDark: "insert_chartpollassessment",
  chartLight: "insert_chart_outlined",
  print: "print1",
  logout: "log-out",
  login: "login",
  search: "magnifying-glass",
  menu: "menu1111",
  lockOpen: "lock-open111",
  lockClosed: "lock11",
  add: "plus21",
  minus: "minus21",
  news: "news",
  tuner: "sound-mix",
  stopwatch: "stopwatch",
  arrowLeft: "arrow_left",
  arrowRight: "arrow_right",
  arrowDown: "arrow_drop_down",
  arrowUp: "arrow_drop_up",
  checkWithCircle: "check_circle",
  checkbox: "check_box"
};

const Button = ({
  text,
  bgcolor = "hsla(242, 89%, 64%, 1)",
  addIcon = false,
  icon,
  enableBtn = false,
  handleClick,
  customStyles = {}
}) => {
  const [isDisabled, setIsDisabled] = useState(enableBtn);

  const clickHandler = e => {
    e.persist();
    return handleClick(e);
  };

  const userStyles = {
    ...customStyles,
    backgroundColor: bgcolor
  };

  return (
    <button
      className={isDisabled ? styles.Button_isDisabled : styles.Button}
      style={userStyles}
      disabled={isDisabled}
      onClick={clickHandler}
    >
      {addIcon && (
        <svg className={styles.Button_icon}>
          <use xlinkHref={`${sprite}#icon-${ICONS[icon]}`}></use>
        </svg>
      )}
      {text}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  bgcolor: "hsla(242, 89%, 64%, 1)",
  addIcon: false,
  enableBtn: false
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  bgcolor: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  addIcon: PropTypes.bool,
  icon: PropTypes.string,
  enableBtn: PropTypes.bool
};
