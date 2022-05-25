import {Popover} from "antd";
import React from "react";

const Util = (text) => {
  return typeof text !== "string" || text.length < 50 ? text :
    <span>{text.substr(0, 40)}
      <Popover trigger="click" overlayClassName="table-tooltip" content={text}><i className="las la-lg la-comment-dots link-click"/></Popover>
    </span>;
};
export default Util;
