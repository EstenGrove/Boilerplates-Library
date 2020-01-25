import React from "react";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/DropdownSelectSM.module.scss";

const DropdownSelectSM = ({
  label,
  id,
  options = [],
  name,
  val,
  handleChange,
  defaultValue,
  placeholder
}) => {
  return (
    <div className={styles.DropdownSelectSM}>
      <div className={styles.DropdownSelectSM_labelGroup}>
        <label
          htmlFor={id}
          className={styles.DropdownSelectSM_labelGroup_label}
        >
          {label}
        </label>
        <div className={styles.DropdownSelectSM_labelGroup_requiredFlag}>*</div>
      </div>
      <input
        value={val}
        list={id}
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={styles.DropdownSelectSM_input}
      />
      <datalist id={id} className={styles.DropdownSelectSM_list}>
        {options.map((option, index) => (
          <option
            value={option}
            key={index}
            className={styles.DropdownSelectSM_list_option}
          />
        ))}
      </datalist>
    </div>
  );
};
export default DropdownSelectSM;

DropdownSelectSM.defaultProps = {
  options: []
};

DropdownSelectSM.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  val: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};
