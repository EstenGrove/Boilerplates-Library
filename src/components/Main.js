import React from "react";
import styles from "../css/Main.module.scss";
import { PropTypes } from "prop-types";

const Main = ({ children }) => {
	return <div className={styles.Main}>{children}</div>;
};

export default Main;

Main.defaultProps = {};

Main.propTypes = {};
