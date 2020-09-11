import React from "react";
import { PropTypes } from "prop-types";
import { statusReducer } from "../../helpers/utils_styles";
import Badge from "./Badge";

// STATUS OPTIONS
// PENDING, NOT-COMPLETE, MISSED-EVENT, COMPLETE, IN-PROGRESS

const StatusBadge = ({ size = "SM", status = "NOT-COMPLETE", children }) => {
	const custom = statusReducer(status);
	return (
		<Badge size={size} customStyles={custom}>
			{children}
		</Badge>
	);
};

export default StatusBadge;

StatusBadge.defaultProps = {
	size: "SM",
	status: "PENDING",
};

StatusBadge.propTypes = {
	size: PropTypes.string,
	status: PropTypes.string,
	children: PropTypes.any, // used for the text content
};
