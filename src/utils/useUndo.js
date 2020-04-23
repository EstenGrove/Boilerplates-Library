import { useReducer, useCallback } from "react";

// UNDO: returns the "last" entry from "history" (ie the last element or last index or "state.length - 1")
// REDO: remove the "first" entry from "history", as it's the most recent activity

// REDUCER ACTION TYPES
const UNDO = "UNDO";
const REDO = "REDO";
const SET = "SET";
const RESET = "RESET";

const initialState = {
	past: [],
	present: null,
	future: [],
};

const reducer = (state, action) => {
	const { past, present, future } = state;

	switch (action.type) {
		case "UNDO": {
			// return the previous state (last entry in "past" array)
			// remove the last entry from "history", since it's been used (ie is the "present" state)
			const previous = past[past.length - 1];
			const newPast = past.slice(0, past.length - 1);

			return {
				past: newPast,
				present: previous,
				future: [present, ...future],
			};
		}

		case "REDO": {
			const next = future[0];
			const newFuture = future.slice(1);

			return {
				past: [...past, present],
				present: next,
				future: newFuture,
			};
		}

		case "SET": {
			const { newPresent } = action.data;

			if (newPresent === present) {
				return state;
			}
			return {
				past: [...past, present],
				present: newPresent,
				future: [],
			};
		}

		case "RESET": {
			const { newPresent } = action.data;

			return {
				past: [],
				present: newPresent,
				future: [],
			};
		}
		default:
			return { ...state };
	}
};

const useUndo = (initialPresent) => {
	const [state, dispatch] = useReducer(reducer, {
		...initialState,
		present: initialPresent,
	});

	const canUndo = state.past.length !== 0;
	const canRedo = state.future.length !== 0;

	// removes entry from present, moves entry to past???
	const undo = useCallback(() => {
		if (canUndo) {
			dispatch({ type: "UNDO" });
		}
	}, [canUndo]);

	// moves entry from future to present???
	const redo = useCallback(() => {
		if (canRedo) {
			dispatch({ type: "REDO" });
		}
	}, [canRedo]);

	// prevents duplicate renders
	const set = useCallback(
		(newPresent) =>
			dispatch({
				type: "SET",
				data: {
					newPresent,
				},
			}),
		[]
	);

	// resets back to initial state
	const reset = useCallback(
		(newPresent) =>
			dispatch({
				type: "RESET",
				data: {
					newPresent,
				},
			}),
		[]
	);

	return {
		state,
		set, // state setter - sets the "present state"
		reset,
		undo,
		redo,
		canUndo,
		canRedo,
	};
};

export default useUndo;
