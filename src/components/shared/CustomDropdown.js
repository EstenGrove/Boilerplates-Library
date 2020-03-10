import React, { useRef, useEffect, useState } from "react";
import styles from "../../css/shared/CustomDropdown.module.scss";
import sprite from "../../assets/modals-complete.svg";
import { isEmptyArray, isEmptyVal } from "../../helpers/utils_types";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";

const ENTER = "Enter" || 13;
const ESCAPE = "Escape" || 27;

const OptionsMenu = ({
	name,
	closeHandler,
	handleSelection,
	handleSelectionByKey,
	handleFocus,
	hasFocus,
	options = []
}) => {
	const menuRef = useRef();
	const { isOutside } = useOutsideClick(menuRef);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (isOutside) {
			return closeHandler(false);
		}
		return () => {
			isMounted = false;
		};
	}, [isOutside, closeHandler]);

	return (
		<aside className={styles.CustomDropdown_options} ref={menuRef}>
			<ul className={styles.CustomDropdown_options_list}>
				{!isEmptyArray(options) &&
					options.map((option, index) => (
						<li
							tabIndex={0}
							key={option + index}
							onClick={() => handleSelection(name, option)}
							onFocus={() => handleFocus(option)}
							onKeyDown={handleSelectionByKey}
							className={
								hasFocus === option
									? styles.CustomDropdown_options_list_item_focus
									: styles.CustomDropdown_options_list_item
							}
						>
							{option}
						</li>
					))}
			</ul>
		</aside>
	);
};

const CustomDropdown = ({
	name,
	id,
	label,
	options = [],
	placeholder,
	selection,
	setSelection,
	customStyles = {}
}) => {
	const inputRef = useRef();
	const [showOptions, setShowOptions] = useState(false); // menu options
	const [listOptions, setListOptions] = useState([...options]); // for filtering/searching
	const [hasFocus, setHasFocus] = useState("");
	const [searchVal, setSearchVal] = useState("");

	// handles "click" selection for a menu option
	const handleSelection = (name, option) => {
		setSelection(name, option);
	};

	// sets active focused item
	// allows custom focus styles to be applied
	const handleFocus = option => {
		setHasFocus(option);
	};

	// handles checking for a match
	// setting the selection when an option is focused and the
	// "ENTER" key is pressed
	const handleSelectionByKey = e => {
		const currentEl = e.target.textContent;

		const hasMatch = val => {
			return listOptions.includes(val);
		};
		if (hasMatch(currentEl) && e.key === ENTER) {
			return handleSelection(currentEl);
		}
		if (e.key === ESCAPE) {
			return setShowOptions(false);
		}
		return;
	};

	// handles "onChange" search
	const handleSearch = e => {
		const { value } = e.target;
		setSearchVal(value);
		setListOptions([
			...options.filter(x => x.toLowerCase().includes(value.toLowerCase()))
		]);
	};

	const clearSelection = () => {
		handleSelection(name, "");
		handleFocus("");
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		// close options menu when selection is made
		if (!isEmptyVal(selection)) {
			return setShowOptions(false);
		}

		return () => {
			isMounted = false;
		};
	}, [selection]);

	return (
		<div className={styles.CustomDropdown}>
			<label htmlFor={id} className={styles.CustomDropdown_label}>
				{label}
			</label>
			<div className={styles.CustomDropdown_inputWrapper}>
				<input
					ref={inputRef}
					type="text"
					value={isEmptyVal(selection) ? searchVal : selection}
					name={name}
					id={id}
					placeholder={placeholder}
					onChange={handleSearch}
					onClick={() => setShowOptions(true)}
					onFocus={() => setShowOptions(true)}
					className={styles.CustomDropdown_inputWrapper_input}
					style={customStyles}
					autoComplete="off"
				/>
				{showOptions && (
					<OptionsMenu
						name={name}
						handleSelection={handleSelection}
						handleSelectionByKey={handleSelectionByKey}
						handleFocus={handleFocus}
						hasFocus={hasFocus}
						closeHandler={setShowOptions}
						options={listOptions}
					/>
				)}

				<svg
					className={styles.CustomDropdown_closeIcon}
					onClick={() => clearSelection(name)}
				>
					<use
						xlinkHref={`${sprite}#icon-${
							!isEmptyVal(selection) ? "clearclose" : "caret-down"
						}`}
					/>
				</svg>
			</div>
		</div>
	);
};

export default CustomDropdown;

CustomDropdown.defaultProps = {
	options: []
};

CustomDropdown.propTypes = {
	name: PropTypes.string,
	id: PropTypes.string,
	label: PropTypes.string,
	options: PropTypes.array,
	selection: PropTypes.string.isRequired, // input state value
	setSelection: PropTypes.func.isRequired // state setter for input
};

OptionsMenu.defaultProps = {
	options: []
};
OptionsMenu.defaultProps = {
	name: PropTypes.string.isRequired,
	closeHandler: PropTypes.func.isRequired,
	handleSelection: PropTypes.func.isRequired, // "onClick" handler for value selection
	options: PropTypes.array.isRequired // menu options
};
