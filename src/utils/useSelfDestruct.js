import { useState, useEffect } from "react";

export const useSelfDestruct = (triggerRender = false, expiry = 3000) => {
	const [shouldRender, setShouldRender] = useState(triggerRender); // starts off hidden

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		if (triggerRender) {
			return setShouldRender(true);
		}
		return () => {
			isMounted = false;
		};
	}, [triggerRender]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		let timer;
		if (shouldRender) {
			timer = setTimeout(() => {
				setShouldRender(false);
			}, expiry);
		}

		return () => {
			isMounted = false;
			clearTimeout(timer);
		};
	}, [expiry, shouldRender]);

	return {
		shouldRender,
		setShouldRender
	};
};
