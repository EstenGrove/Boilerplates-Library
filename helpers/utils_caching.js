const saveToStorage = (key, items) => {
  return window.localStorage.setItem(key, JSON.stringify(items));
};

const clearStorage = () => window.localStorage.clear();

const getFromStorage = (key = null) => {
  if (!key) {
    const items = { ...localStorage };
    return items;
  }
  return window.localStorage.getItem(key);
};

const updateStorage = (key, items) =>
  window.localStorage.setItem(key, JSON.stringify(items));

export { saveToStorage, clearStorage, getFromStorage, updateStorage };
