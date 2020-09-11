import React, { useState } from "react";
import styles from "../../css/shared/PasswordInput.module.scss";
import sprite from "../../assets/showhide.svg";

const PasswordInput = ({
	label,
	id,
	name,
	handleChange,
	required = false,
	autoComplete = "off"
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = () => {
		return setShowPassword(!showPassword);
	};

	return (
		<div className={styles.PasswordInput}>
			<label htmlFor={id} className={styles.PasswordInput_label}>
				{label}
			</label>
			<div className={styles.PasswordInput_wrapper}>
				<input
					type={showPassword ? "text" : "password"}
					name={name}
					id={id}
					onChange={handleChange}
					className={styles.PasswordInput_wrapper_input}
					required={required}
					autoComplete={autoComplete}
				/>
				<svg
					className={styles.PasswordInput_wrapper_icon}
					onClick={toggleShowPassword}
				>
					<use
						xlinkHref={`${sprite}#icon-view-${showPassword ? "hide" : "show"}`}
					/>
				</svg>
			</div>
		</div>
	);
};

export default PasswordInput;
