import {cleanObjectKeyNull} from "utils";

const Util = (obj, skipKeys = []) => {
  const tempObj = cleanObjectKeyNull(obj);
  let size = 0, key;
  for (key in tempObj) {
    if (tempObj.hasOwnProperty(key) && skipKeys.indexOf(key) === -1) size++;
  }
  return size;
};
export default Util;
