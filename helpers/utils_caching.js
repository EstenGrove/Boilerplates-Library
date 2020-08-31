import { isEmptyObj } from "./utils_types";
import { differenceInMinutes } from "date-fns";

const saveToStorage = (key, val) => {
	return window.localStorage.setItem(key, JSON.stringify(val));
};

// fetches items (w/ key) from localStorage
// if items exist, parse and return; else return {}
const getFromStorage = (key = null) => {
	const storageValues = window.localStorage.getItem(key);
	return storageValues !== null ? JSON.parse(storageValues) : null;
};

const updateItemInStorage = (key, val) => {
	return window.localStorage.setItem(key, JSON.stringify(val));
};

const removeFromStorage = (key) => {
	return window.localStorage.removeItem(key);
};

const clearStorage = () => {
	return window.localStorage.clear();
};

///////////////////////////////////////////////////////////////////////////
/////////////////////// LOCALSTORAGE/CACHE HELPERS ///////////////////////
///////////////////////////////////////////////////////////////////////////

// checks localStorage based off a 'key';
// if cache is empty return false; otherwise return the cache
const hasCache = (key = null) => {
	if (!key) return false;
	const cache = getFromStorage(key);
	if (!isEmptyObj(cache) && !isStale(cache.timestamp, Date.now())) {
		return cache;
	} else {
		return false;
	}
};

// accepts two dates, and compares if they're 30 mins apart
// if >= 30 mins apart; then true, else false
const isStale = (comparator, now = Date.now()) => {
	if (Math.abs(differenceInMinutes(now, comparator)) >= 30) {
		return true;
	} else {
		return false;
	}
};

// returns "true" if the cache is older than 30mins OR empty
const isStaleOrEmpty = (key = null) => {
	if (!key) return true; // cache is empty
	if (hasCache(key)) {
		const cache = getFromStorage(key);
		return isStale(cache.timestamp, Date.now());
	} else {
		return true;
	}
};

export {
	saveToStorage,
	getFromStorage,
	updateItemInStorage,
	removeFromStorage,
	clearStorage,
};

// "useCache" helpers
export { hasCache, isStale, isStaleOrEmpty };
