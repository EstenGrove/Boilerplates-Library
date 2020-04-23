import { useState, useEffect } from "react";
import { useReducer } from "react";
import {
	saveToStorage,
	getFromStorage,
	updateItemInStorage,
	removeFromStorage,
	clearStorage,
} from "../helpers/utils_caching";

/**
 * @description - Helper used to limit an array's length to a certain number.
 * @param {Array} list - Accepts an array of items, and will enforce a "maxLength" by removing the last item in the list.
 * @param {Number} maxLength - The maximum length of an array of items.
 */
const enforceListLength = (list = [], maxLength) => {
	if (list.length >= maxLength) {
		return [...list.slice(0, list.length - 1)];
	} else {
		return [...list];
	}
};

// INITIAL STATE //
// "hasCache": checks localStorage for "recently viewed" records
// "maxLength": max amount of "recently viewed" records
// "recentlyViewed": list of recent items and relevant meta data
// "pendintQueue": list of entries waiting to be added to "recently viewed"

const initialState = {
	hasCache: false,
	maxLength: 5,
	recentlyViewed: [],
	pendingQueue: [],
};

// - ADD_ENTRY: NEW ENTRIES GET ADDED TO FRONT OF THE LIST,
// - REMOVE_ENTRY: OLD ENTRIES GET REMOVED FROM END OF THE LIST
// recentlyViewed = [mostRecent, ..., ..., ..., oldest]

// STILL NEED TO IMPLEMENT "pendingQueue"
const reducer = (state, action) => {
	const { maxLength, recentlyViewed } = state;

	const hasMax = (list) => list.length >= maxLength; // have reached "maxLength" in "recentlyViewed"; purge oldest item
	const hasFreeSpace = (list) => list.length < maxLength; // has available space in "recentlyViewed"; add new item

	switch (action.type) {
		case "INIT_STORE": {
			const { fromCache } = action.data;
			if (!fromCache) {
				return { ...state };
			}
			return {
				...state,
				recentlyViewed: [...fromCache.recentlyViewed],
				pendingQueue: [...fromCache.pendingQueue],
			};
		}
		case "ADD_ENTRY": {
			const { newEntry } = action.data;

			if (hasMax(recentlyViewed)) {
				return {
					...state,
					recentlyViewed: [
						newEntry,
						...recentlyViewed.slice(0, recentlyViewed.length - 1),
					],
				};
			}
			return {
				...state,
				recentlyViewed: [newEntry, ...recentlyViewed],
			};
		}
		case "REMOVE_ENTRY": {
			const { entryID, idType } = action.data;
			return {
				...state,
				recentlyViewed: [
					...recentlyViewed.filter((x) => x[idType] !== entryID),
				],
			};
		}
		case "CLEAR_ALL": {
			return { ...initialState };
		}
		default:
			return { ...state };
	}
};

export const useRecentlyViewed = ({
	maxLength = 5,
	initialRecents = [],
	initialPending = [],
}) => {
	const [state, dispatch] = useReducer(reducer, {
		...initialState,
		maxLength: maxLength,
		recentlyViewed: [...initialRecents],
		pendingQueue: [...initialPending],
	});

	const initStore = (key) => {
		if (!key) return;
		const cache = getFromStorage(key);
		dispatch({
			type: "INIT_STORE",
			data: {
				fromCache: cache,
			},
		});
	};

	const addEntry = (entry) => {
		dispatch({
			type: "ADD_ENTRY",
			data: {
				newEntry: entry,
			},
		});
	};

	const removeEntry = (entryID, idType) => {
		dispatch({
			type: "REMOVE_ENTRY",
			data: {
				entryID: entryID,
				idType: idType,
			},
		});
	};

	const clearAllEntries = () => {
		dispatch({ type: "CLEAR_ALL" });
	};

	return {
		state,
		initStore,
		addEntry,
		removeEntry,
		clearAllEntries,
	};
};
