import React, { useState } from "react";
import styles from "../../css/shared/PrintPortal.module.scss";
import { PropTypes } from "prop-types";
import { createPortal } from "react-dom";

const SIZES = {
	XSM: {
		width: "10rem",
		height: "8rem",
		fontSize: "1rem"
	},
	SM: {
		width: "20rem",
		height: "16rem",
		fontSize: "1.2rem"
	},
	MD: {
		width: "40rem",
		height: "32rem",
		fontSize: "1.5rem"
	},
	LG: {
		width: "60rem",
		height: "40rem",
		fontSize: "1.8rem"
	},
	XLG: {
		width: "80rem",
		height: "60rem",
		fontSize: "2rem"
	},
	HALF: {
		width: "50%",
		height: "50%",
		fontSize: "1.5rem"
	},
	FULL: {
		width: "100%",
		height: "100%",
		fontSize: "2rem"
	},
	MAX: {
		width: "100vw",
		height: "100vh",
		fontSize: "2rem"
	}
};

const PrintPortal = ({
	id,
	size = "LG",
	customStyles = {},
	handlePrint,
	children,
	...props
}) => {
	const [contentRef, setContentRef] = useState(null);
	const mountNode = contentRef && contentRef.contentWindow.document.body;

	const custom = {
		...SIZES[size],
		...customStyles
	};

	return (
		<iframe
			id={id}
			ref={setContentRef}
			title="Printable Portal"
			className={styles.PrintPortal_iframe}
			style={custom}
			{...props}
		>
			{mountNode && createPortal(React.Children.only(children), mountNode)}
		</iframe>
	);
};

export default PrintPortal;

PrintPortal.defaultProps = {
	size: "LG",
	customStyles: {}
};

PrintPortal.propTypes = {
	id: PropTypes.string.isRequired,
	size: PropTypes.string,
	customStyles: PropTypes.object,
	children: PropTypes.any.isRequired,
	props: PropTypes.any
};
