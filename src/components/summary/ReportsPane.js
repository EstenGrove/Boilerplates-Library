import React, { useState, useRef, useEffect } from "react";
import styles from "../../css/summary/ReportsPane.module.scss";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";
import sprite from "../../assets/buttons.svg";
import Spinner from "../shared/Spinner";

const ReportPane = ({
	isLoading,
	title,
	size,
	customStyles = {},
	children
}) => {
	const menuRef = useRef();
	const { isOutside } = useOutsideClick(menuRef);
	const [showMenu, setShowMenu] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const sizes = {
		HALF: {
			width: "45%",
			height: isCollapsed ? "auto" : "45%"
		},
		SM: {
			width: "30rem",
			height: isCollapsed ? "auto" : "40rem"
		},
		MD: {
			width: "50rem",
			height: isCollapsed ? "auto" : "60rem"
		},
		LG: {
			width: "100%",
			height: isCollapsed ? "auto" : "100%"
		}
	};

	const custom = {
		...customStyles,
		...sizes[size]
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (isOutside) {
			return setShowMenu(false);
		}
		return () => {
			isMounted = false;
		};
	}, [isOutside]);

	return (
		<article className={styles.ReportPane} style={custom}>
			<section className={styles.ReportPane_top}>
				<div
					className={styles.ReportPane_top_toggle}
					onClick={() => setIsCollapsed(!isCollapsed)}
					title={`Click to ${isCollapsed ? "expand" : "collapse"}`}
				>
					<h4 className={styles.ReportPane_top_toggle_title}>{title}</h4>
					<svg className={styles.ReportPane_top_toggle_icon}>
						<use
							xlinkHref={`${sprite}#icon-${
								isCollapsed ? "arrow_drop_up" : "arrow_drop_down"
							}`}
						></use>
					</svg>
				</div>
				<div className={styles.ReportPane_top_icons}>
					<svg className={styles.ReportPane_top_icons_icon}>
						<use xlinkHref={`${sprite}#icon-print1`}></use>
					</svg>
					<svg
						className={styles.ReportPane_top_icons_icon}
						onClick={() => setShowMenu(true)}
					>
						<use xlinkHref={`${sprite}#icon-settings1`}></use>
					</svg>

					{/* MENU */}
					{/* MENU */}
					{/* MENU */}
					<div className={styles.refWrapper} ref={menuRef}>
						{showMenu && (
							<div className={styles.ReportPane_top_icons_menu}>
								<svg
									className={styles.closeIcon}
									onClick={() => setShowMenu(false)}
								>
									<use xlinkHref={`${sprite}#icon-clearclose`}></use>
								</svg>
								<ul className={styles.ReportPane_top_icons_menu_list}>
									<li className={styles.ReportPane_top_icons_menu_list_item}>
										Print panel report
									</li>
									<li
										className={styles.ReportPane_top_icons_menu_list_item}
										onClick={() => setIsCollapsed(true)}
									>
										<b>-</b> Collapse panel
									</li>
									<li
										className={styles.ReportPane_top_icons_menu_list_item}
										onClick={() => setIsCollapsed(false)}
									>
										<b>+</b> Expand panel
									</li>
								</ul>
							</div>
						)}
					</div>
					{/* MENU */}
					{/* MENU */}
					{/* MENU */}
				</div>
			</section>

			{/* DATA VIZ - RECHARTS GOES BELOW HERE... */}
			{!isCollapsed && (
				<section className={styles.ReportPane_dataViz}>
					{isLoading ? <Spinner /> : children}
				</section>
			)}
			{/* DATA VIZ - RECHARTS GOES ABOVE HERE... */}
		</article>
	);
};

export default ReportPane;

ReportPane.defaultProps = {
	isLoading: false,
	customStyles: {}
};

ReportPane.propTypes = {
	title: PropTypes.string,
	size: PropTypes.string,
	isLoading: PropTypes.bool,
	customStyles: PropTypes.object,
	children: PropTypes.any
};
