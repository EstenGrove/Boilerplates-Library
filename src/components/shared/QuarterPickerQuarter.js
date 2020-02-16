import React from "react";
import styles from "../../css/shared/QuarterPickerQuarter.module.scss";
import { PropTypes } from "prop-types";
import { quarterRange } from "../../utils/useDates";

const QuarterPickerQuarter = ({
	quarter,
	isSelected = false,
	handleQuarter
}) => {
	return (
		<div
			className={
				isSelected
					? styles.QuarterPickerQuarter_isSelected
					: styles.QuarterPickerQuarter
			}
			onClick={() => handleQuarter(quarter)}
		>
			<time className={styles.QuarterPickerQuarter_quarter}>{quarter}</time>
			<div
				className={styles.QuarterPickerQuarter_range}
				style={isSelected ? { color: "#ffffff" } : null}
			>
				{quarterRange[quarter][0]} - {quarterRange[quarter][2]}
			</div>
		</div>
	);
};

export default QuarterPickerQuarter;

QuarterPickerQuarter.defaultProps = {};

QuarterPickerQuarter.propTypes = {
	quarter: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	handleQuarter: PropTypes.func.isRequired
};
