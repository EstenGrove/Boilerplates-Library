import { useRef, useEffect } from "react";

export const usePrevious = (newVal, initialPrev = null) => {
	const prevVal = useRef(initialPrev);

	useEffect(() => {
		if (prevVal.current !== newVal) {
			prevVal.current = newVal;
		}
	}, [newVal]);

	return {
		previous: prevVal.current,
	};
};
