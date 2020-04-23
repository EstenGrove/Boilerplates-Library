import { useState, useLayoutEffect } from "react";

// ACCEPTS A CUSTOM MEDIA-QUERY AND RETURNS A BOOLEAN, TRUE|FALSE IF MATCHES
export const useMediaQuery = (mediaQuery = "(max-width: 450px") => {
	const [matches, setMatches] = useState(
		() => window.matchMedia(mediaQuery).matches
	);

	useLayoutEffect(() => {
		let isMounted = true;
		if (isMounted) {
			return;
		}
		const mediaQueryList = window.matchMedia(mediaQuery);
		const listener = (e) => setMatches(e.matches);
		mediaQueryList.addEventListener(listener);

		return () => {
			isMounted = false;
			mediaQueryList.removeListener(listener);
		};
	}, [mediaQuery]);

	return matches;
};
