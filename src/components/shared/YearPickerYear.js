import React from "react";
import styles from "../../css/shared/YearPickerYear.module.scss";
import { PropTypes } from "prop-types";

const YearPickerYear = ({ isSelected = false, year, handleYear }) => {
	return (
		<div
			className={
				isSelected ? styles.YearPickerYear_isSelected : styles.YearPickerYear
			}
		>
			<time
				className={styles.YearPickerYear_year}
				onClick={() => handleYear(year)}
			>
				{year}
			</time>
		</div>
	);
};

export default YearPickerYear;

YearPickerYear.defaultProps = {
	isSelected: false
};

YearPickerYear.propTypes = {
	isSelected: PropTypes.bool.isRequired,
	year: PropTypes.number.isRequired,
	handleYear: PropTypes.func.isRequired // event/selection handler
};
