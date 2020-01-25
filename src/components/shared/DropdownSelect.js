import React from "react";
import { PropTypes } from "prop-types";
import styles from "../../css/shared/DropdownSelect.module.scss";

const DropdownSelect = ({
  label,
  id,
  options = [],
  name,
  val,
  handleChange,
  placeholder
}) => {
  return (
    <div className={styles.DropdownSelect}>
      <div className={styles.DropdownSelect_labelGroup}>
        <label htmlFor={id} className={styles.DropdownSelect_labelGroup_label}>
          {label}
        </label>
        <div className={styles.DropdownSelect_labelGroup_requiredFlag}>*</div>
      </div>
      <input
        value={val}
        list={id}
        name={name}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.DropdownSelect_input}
      />
      <datalist id={id} className={styles.DropdownSelect_list}>
        {options.map((option, index) => (
          <option
            value={option}
            key={index}
            className={styles.DropdownSelect_list_option}
          />
        ))}
      </datalist>
    </div>
  );
};
export default DropdownSelect;

DropdownSelect.defaultProps = {
  options: []
};

DropdownSelect.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  val: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};
