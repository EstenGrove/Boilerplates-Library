import { isEmptyObj } from "./utils_types";

const saveToStorage = (key, val) => {
	return window.localStorage.setItem(key, JSON.stringify(val));
};

const getFromStorage = (key = null) => {
	const items = { ...localStorage };
	if (!key) {
		return items;
	} else {
		return isEmptyObj(items) ? {} : JSON.parse(items[key]);
	}
};

const updateItemInStorage = (key, val) => {
	return window.localStorage.setItem(key, JSON.stringify(val));
};

const removeFromStorage = key => {
	return window.localStorage.removeItem(key);
};

const clearStorage = () => {
	return window.localStorage.clear();
};

export {
	saveToStorage,
	getFromStorage,
	updateItemInStorage,
	removeFromStorage,
	clearStorage
};
