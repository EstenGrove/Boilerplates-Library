import { useState } from "react";
import { isEmptyObj, isEmptyVal } from "../helpers/utils_types";

const initialState = {
	values: {},
	touched: {},
	isSubmitting: false
};

export const useForm = ({ ...vals }) => {
	const [formState, setFormState] = useState({
		values: { ...vals },
		touched: {},
		isSubmitting: false
	});

	const handleBlur = e => {
		e.persist();
		const { name } = e.target;
		const { touched } = formState;
		return setFormState({
			...formState,
			touched: { ...touched, [name]: true }
		});
	};

	const handleFocus = inputRef => {
		if (isEmptyObj(inputRef)) return;
		if (isEmptyVal(inputRef?.current)) return;
		return inputRef.current.focus();
	};

	const handleReset = e => {
		e.preventDefault();
		e.persist();
		return setFormState({
			...formState,
			values: { ...vals }
		});
	};

	const handleChange = e => {
		e.persist();
		const { name, value } = e.target;
		const { values } = formState;
		return setFormState({
			...formState,
			values: {
				...values,
				[name]: value
			}
		});
	};

	const handleKeyDown = e => {
		const { name, value } = e.target;
		return setFormState({
			...formState,
			values: {
				...formState.values,
				[name]: value
			}
		});
	};

	const handleCheckbox = e => {
		e.persist();
		const { name, checked } = e.target;
		const { values } = formState;
		setFormState({
			...formState,
			values: {
				...values,
				[name]: checked
			}
		});
	};

	const handleSubmit = (e, callback = null) => {
		e.preventDefault();
		e.persist();
		setFormState({
			...formState,
			isSubmitting: true
		});
		if (!callback) return;
		return callback();
	};

	return {
		formState,
		setFormState,
		handleBlur,
		handleFocus,
		handleReset,
		handleCheckbox,
		handleChange,
		handleKeyDown,
		handleSubmit
	};
};
