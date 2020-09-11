import React from "react";
import { PropTypes } from "prop-types";
import { useSelfDestruct } from "../../utils/useSelfDestruct";

const SelfDestruct = ({ triggerRender, expiry = 3000, children }) => {
	const { shouldRender } = useSelfDestruct(triggerRender, expiry);

	if (!shouldRender) {
		return null;
	}
	return <>{children}</>;
};

export default SelfDestruct;

SelfDestruct.defaultProps = {
	expiry: 3000
};

SelfDestruct.propTypes = {
	triggerRender: PropTypes.bool.isRequired,
	expiry: PropTypes.number,
	children: PropTypes.any
};
