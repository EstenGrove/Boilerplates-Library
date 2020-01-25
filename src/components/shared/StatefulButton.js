import React, { useRef, useState, useEffect } from "react";
import styles from "../../css/shared/StatefulButton.module.scss";

const StatefulButton = ({
  action,
  text,
  isEnabled,
  callback,
  customStyles
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(!isEnabled);
  const btnRef = useRef();

  const handleClick = e => {
    e.preventDefault();
    if (!callback) {
      btnRef.current.setAttribute("disabled", true);
      return setIsLoading(true);
    }
    btnRef.current.setAttribute("disabled", true);
    setIsLoading(true);
    return callback(e); // optional callback
  };

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsDisabled(false);
        setIsLoading(false);
        btnRef.current.removeAttribute("disabled", false);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    setIsDisabled(isEnabled);
  }, [isEnabled]);

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={
        isLoading || isDisabled ? styles.Button_disabled : styles.Button
      }
      disabled={isDisabled}
      style={customStyles}
    >
      {isLoading ? action : text}
    </button>
  );
};
export default StatefulButton;
