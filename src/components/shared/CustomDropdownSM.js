import React, { useRef, useEffect, useState } from "react";
import styles from "../../css/shared/CustomDropdownSM.module.scss";
import sprite from "../../assets/modals-complete.svg";
import { isEmptyArray, isEmptyVal } from "../../helpers/utils_types";
import { PropTypes } from "prop-types";
import { useOutsideClick } from "../../utils/useOutsideClick";

const ENTER = "Enter" || 13;
const ESCAPE = "Escape" || 27;

const OptionsMenuSM = ({
	name,
	closeHandler,
	handleSelection,
	handleSelectionByKey,
	handleFocus,
	hasFocus,
	options = [],
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
		<aside className={styles.CustomDropdownSM_options} ref={menuRef}>
			<ul className={styles.CustomDropdownSM_options_list}>
				{!isEmptyArray(options) &&
					options.map((option, index) => (
						<li
							tabIndex={0}
							key={option}
							onClick={(e) => {
								e.stopPropagation();
								e.nativeEvent.stopPropagation();
								handleSelection(name, option);
							}}
							onFocus={() => handleFocus(option)}
							onKeyDown={handleSelectionByKey}
							className={
								hasFocus === option
									? styles.CustomDropdownSM_options_list_item_focus
									: styles.CustomDropdownSM_options_list_item
							}
						>
							{option}
						</li>
					))}
			</ul>
		</aside>
	);
};

const CustomDropdownSM = ({
	name,
	id,
	label,
	placeholder,
	options = [],
	selection,
	setSelection,
	inputSize = 15,
	customStyles = {},
	isDisabled = false,
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
	const handleFocus = (option) => {
		setHasFocus(option);
	};

	// handles checking for a match
	// setting the selection when an option is focused and the
	// "ENTER" key is pressed
	const handleSelectionByKey = (e) => {
		const currentEl = e.target.textContent;

		const hasMatch = (val) => {
			return listOptions.includes(val);
		};
		if (hasMatch(currentEl) && e.key === ENTER) {
			return handleSelection(name, currentEl);
		}
		if (e.key === ESCAPE) {
			return setShowOptions(false);
		}
		return;
	};

	// handles "onChange" search
	const handleSearch = (e) => {
		const { value } = e.target;
		if (!isEmptyVal(selection)) {
			clearSelection();
			setSearchVal(value);
			return setListOptions([
				...options.filter((x) => x.toLowerCase().includes(value.toLowerCase())),
			]);
		} else {
			setSearchVal(value);
			setListOptions([
				...options.filter((x) => x.toLowerCase().includes(value.toLowerCase())),
			]);
		}
	};

	const clearSelection = (e) => {
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
		<div className={styles.CustomDropdownSM}>
			<label htmlFor={id} className={styles.CustomDropdownSM_label}>
				{label}
			</label>
			<div className={styles.CustomDropdownSM_inputWrapper}>
				<input
					ref={inputRef}
					type="text"
					value={isEmptyVal(selection) ? searchVal : selection}
					name={name}
					id={id}
					placeholder={placeholder}
					onChange={handleSearch}
					onClick={(e) => {
						e.stopPropagation();
						e.nativeEvent.stopPropagation();
						setShowOptions(true);
					}}
					onFocus={() => setShowOptions(true)}
					className={styles.CustomDropdownSM_inputWrapper_input}
					autoComplete="off"
					size={inputSize}
					style={customStyles}
					disabled={isDisabled}
				/>
				{showOptions && (
					<OptionsMenuSM
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
					className={styles.CustomDropdownSM_closeIcon}
					onClick={
						!isEmptyVal(selection)
							? (e) => clearSelection(e)
							: (e) => {
									e.stopPropagation();
									e.nativeEvent.stopPropagation();
									setShowOptions(true);
							  }
					}
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

export default CustomDropdownSM;

CustomDropdownSM.defaultProps = {
	options: [],
};

CustomDropdownSM.propTypes = {
	name: PropTypes.string,
	id: PropTypes.string,
	label: PropTypes.string,
	options: PropTypes.array,
	selection: PropTypes.string.isRequired, // input state value
	setSelection: PropTypes.func.isRequired, // state setter for input
};

OptionsMenuSM.defaultProps = {
	options: [],
	isDisabled: false,
};
OptionsMenuSM.defaultProps = {
	name: PropTypes.string.isRequired,
	closeHandler: PropTypes.func.isRequired, // state setter for closing the menu options dropdown
	handleSelection: PropTypes.func.isRequired, // "onClick" handler for value selection
	handleSelectionKey: PropTypes.func.isRequired, // "onClick" handler for value selection
	handleFocus: PropTypes.func.isRequired, // "onClick" handler for value selection
	hasFocus: PropTypes.bool.isRequired, // "onClick" handler for value selection
	options: PropTypes.array.isRequired, // menu options
	isDisabled: PropTypes.bool,
};
