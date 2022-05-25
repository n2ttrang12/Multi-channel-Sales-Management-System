import moment from "moment";

const Util = (columns, values, form) => {
  columns.map(item => {
    if (values) {
      if (item.formItem && !item.formItem.notConvert && (!item.formItem.condition || item.formItem.condition(values[item.name],form))) {
        switch (item.formItem.type) {
          case 'switch':
            if (typeof values[item.name] === "undefined") {
              values[item.name] = false;
            }
            break;
          case 'upload':
            if (values[item.name] && item.formItem.action === undefined) {
              values[item.name] = values[item.name].filter(_item => _item.status === "done" || !_item.status).map(_item => _item.response?.data?.id || (_item.uid || _item.id));
            }
            break;
          case 'date':
            if (values[item.name]) {
              values[item.name] = moment(values[item.name]).format('YYYY-MM-DDTHH:mm:ss');
            }
            break;
          case 'date_range':
            if (values[item.name]) {
              values[item.name] = [moment(values[item.name][0]).format('YYYY-MM-DDTHH:mm:ss'),moment(values[item.name][1]).format('YYYY-MM-DDTHH:mm:ss')];
            }
            break;
          default:
            break;
        }

        if (item.formItem && item.formItem.convert) {
          values[item.name] = item.formItem.convert(values[item.name]);
        }
      }
    } else {
      values[item.name] = '';
    }
    return item;
  });
  return values;
};
export default Util;
