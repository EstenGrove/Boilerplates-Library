import React from "react";
import styles from "../../css/shared/CheckboxSM.module.scss";

const CheckboxSM = ({
  label,
  name,
  id,
  val,
  defaultChecked = false,
  handleCheckbox,
  isDisabled = false,
  addStrike = false
}) => {
  return (
    <div className={styles.CheckboxSM}>
      <input
        type="checkbox"
        name={name}
        id={id}
        defaultChecked={defaultChecked}
        value={val}
        checked={val}
        onChange={handleCheckbox}
        className={styles.CheckboxSM_checkbox}
        disabled={isDisabled}
      />
      <label
        aria-labelledby={id}
        htmlFor={id}
        className={
          val && addStrike
            ? `${styles.CheckboxSM_label} ${styles.strike}`
            : styles.CheckboxSM_label
        }
      >
        {label}
      </label>
    </div>
  );
};

export default CheckboxSM;
