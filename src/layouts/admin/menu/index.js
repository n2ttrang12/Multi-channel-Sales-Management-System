import {Collapse} from "components";
import React, {Fragment} from "react";
import classNames from "classnames";
import {routerLinks} from "utils";
import {useNavigate, useLocation} from "react-router";
import './index.less';
import listMenu from '../menus'

const Layout = ({isCollapsed = false}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ul className="menu">
      {listMenu().map((item, index) => {
        if (!item.child) {
          return (
            <li
              key={index}
              className={classNames("flex items-center px-3 py-1 m-3", {'bg-white text-blue-500 rounded-2xl': location.pathname === routerLinks(item.name)})}
              onClick={() => navigate(routerLinks(item.name))}
            >
              <i className={classNames('text-3xl mr-2.5', item.icon)} />
              <span className={classNames('transition-all duration-300 ease-in-out font-bold', {'opacity-100': !isCollapsed, 'opacity-0 text-[0]': isCollapsed})}>
                {item.name}
              </span>
            </li>
          )
        } else {
          return (
            <Collapse
              key={index}
              title={(
                <Fragment>
                  <i className={classNames('text-3xl mr-2.5', item.icon)} />
                  <span className={classNames('transition-all duration-300 ease-in-out font-bold', {'opacity-100': !isCollapsed, 'opacity-0 text-[0]': isCollapsed})}>
                    {item.name}
                  </span>
                </Fragment>
              )}
              className="flex items-center px-6 py-1"
              showArrow={!isCollapsed}
              popover={isCollapsed}
            >
              <Fragment>
                {item.child.map((subItem, index) => (
                    <li key={index} className="py-2" onClick={() => navigate(routerLinks(subItem.name))}>{subItem.name}</li>
                ))}
              </Fragment>
            </Collapse>
          )
        }
      })}
    </ul>
  );
};
export default Layout;
