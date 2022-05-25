const Util = (obj) => {
  for (let propName in obj) {
    if (obj.hasOwnProperty(propName)) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
  }
  return obj;
};
export default Util;
