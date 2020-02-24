import React from "react";
import { PropTypes } from "prop-types";
import { isEmptyVal } from "../../helpers/utils_types";
import styles from "../../css/summary/ReportsMirror.module.scss";
import sprite from "../../assets/alerts.svg";
import Spinner from "../shared/Spinner";

const sizes = {
	SM: {
		width: "30rem",
		height: "40rem"
	},
	MD: {
		width: "50rem",
		height: "60rem"
	},
	HALF: {
		width: "45%",
		height: "45"
	},
	LG: {
		width: "100%",
		height: "100%"
	}
};

const ReportsMirror = ({
	src = "",
	alt = "",
	title = "",
	size = "LG",
	isLoading = false,
	status = null,
	loadReport
}) => {
	const isReady = () => {
		if (!isEmptyVal(src) && status === "Ready") {
			return true;
		}
		return false;
	};

	return (
		<section className={styles.ReportsMirror} style={sizes[size]}>
			{isReady() && (
				<iframe
					src={src}
					alt={alt}
					title={title}
					className={styles.ReportsMirror_mirror}
				/>
			)}
			{!isLoading && !status && (
				<div className={styles.ReportsMirror_empty}>
					<h2 className={styles.ReportsMirror_empty_heading}>
						No Report Has Been Loaded
					</h2>
					<svg className={styles.ReportsMirror_empty_icon}>
						<use xlinkHref={`${sprite}#icon-warning`}></use>
					</svg>
				</div>
			)}
			{isLoading && !isReady() && <Spinner />}
		</section>
	);
};

export default ReportsMirror;

ReportsMirror.defaultProps = {
	src: "",
	alt: "",
	title: "",
	size: "LG",
	isLoading: false
};

ReportsMirror.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string,
	title: PropTypes.string,
	size: PropTypes.string,
	isLoading: PropTypes.bool,
	loadReport: PropTypes.func
};
