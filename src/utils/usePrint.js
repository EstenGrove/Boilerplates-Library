import { useState, useEffect } from "react";

export const usePrint = printID => {
	// store the printable DOM element (iframe)
	const [printable, setPrintable] = useState(
		document.querySelector("#" + printID)
	);

	// grabs the iframe's content window
	// then triggers focus and the print events
	const handlePrint = e => {
		const iframe = printable.contentWindow;

		iframe.focus();
		iframe.print();
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}
		// make sure iframe element is set/stored in state when mounted
		setPrintable(document.querySelector("#" + printID));
		return () => {
			isMounted = false;
		};
	}, [printID]);

	return {
		handlePrint
	};
};
