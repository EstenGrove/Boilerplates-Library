import React from "react";
import styles from "../../css/shared/ImgWithFallback.module.scss";
import { PropTypes } from "prop-types";

const SIZES = {
	XSM: {
		width: "5rem",
		height: "10rem",
	},
	SM: {
		width: "10rem",
		height: "20rem",
	},
	MD: {
		width: "20rem",
		height: "30rem",
	},
	LG: {
		width: "30rem",
		height: "30rem",
	},
	XLG: {
		width: "45rem",
		height: "45rem",
	},
	FULL: {
		width: "100%",
		height: "100%",
	},
	HALF: {
		width: "50%",
		height: "50%",
	},
	CUSTOM: {},
};

const ImgWithFallback = ({
	src,
	alt,
	type = "image/webp",
	fallback,
	size = "FULL",
	fit = "contain",
	...imgProps
}) => {
	const custom = {
		...SIZES[size],
		objectFit: fit,
	};

	return (
		<picture className={styles.ImgWithFallback}>
			<source srcSet={src} type={type} />
			<img src={fallback} alt={alt} {...imgProps} style={custom} />
		</picture>
	);
};

export default ImgWithFallback;

ImgWithFallback.defaultProps = {
	type: "image/webp",
	size: "MD",
	fit: "contain",
};
ImgWithFallback.propTypes = {
	fallback: PropTypes.string, // fallback image/png
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	size: PropTypes.string,
	fit: PropTypes.string,
	imgProps: PropTypes.any,
};
