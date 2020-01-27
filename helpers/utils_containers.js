// used for converting sizes passed as props to "Container" components
// PARAMS:
// 1. "sizeVal" - the initial size passed to the component (ie height, width etc)
// 2. "fallback" - the fallback option used when nothing or an invalid value is passed
// FUNCTION:
// it checks if the "sizeVal" is a number or a string
// if it's a string it just returns the string
// if it's a number it converts the size appropriately by multiplying the value by the "BASE"

const convertSizes = (sizeVal = null, fallback) => {
  const BASE = 0.625 * 16; // 10
  if (isNaN(sizeVal) && sizeVal.constructor.name !== "String") {
    return fallback;
  }
  if (sizeVal.constructor.name === "String") {
    return sizeVal;
  }
  return sizeVal * BASE;
};

export { convertSizes };
