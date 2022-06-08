import { Collapse } from 'components';
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { routerLinks } from 'utils';
import { useNavigate, useLocation } from 'react-router';
import './index.less';
import listMenu from '../menus';

const Layout = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ul className="menu">
      {listMenu().map((item, index) => {
        if (!item.child) {
          return (
            <li
              key={index}
              className={classNames(
                'text-gray-300 flex items-center px-3 py-1 m-3',
                {
                  'bg-teal-700 text-white rounded-2xl  ':
                    location.pathname === routerLinks(item.name),
                },
              )}
              onClick={() => navigate(routerLinks(item.name))}
            >
              <i className={classNames('text-3xl mr-2.5', item.icon)} />
              <span
                className={classNames(
                  'text-gray-300 text-base  transition-all duration-300 ease-in-out font-bold',
                  {
                    'opacity-100': !isCollapsed,
                    'opacity-0 text-[0]': isCollapsed,
                    '!text-white': location.pathname === routerLinks(item.name),
                  },
                )}
              >
                {item.name}
              </span>
            </li>
          );
        } else {
          return (
            <Collapse
              key={index}
              title={
                <Fragment>
                  <i className={classNames('text-3xl mr-2.5', item.icon)} />
                  <span
                    className={classNames(
                      'text-gray-300 text-base transition-all duration-300 ease-in-out font-bold',
                      {
                        'opacity-100': !isCollapsed,
                        'opacity-0 text-[0]': isCollapsed,
                      },
                    )}
                  >
                    {item.name}
                  </span>
                </Fragment>
              }
              className="flex items-center px-6 py-1"
              showArrow={!isCollapsed}
              popover={isCollapsed}
            >
              <div className="px-4 mx-4">
                {item.child.map((subItem, index) => (
                  <li
                    key={index}
                    className={classNames(
                      'py-2 text-gray-300 my-2 font-bold text-base',
                      {
                        'bg-teal-700 !text-white rounded-2xl text-white ':
                          location.pathname === routerLinks(subItem.name),
                      },
                    )}
                    onClick={() => navigate(routerLinks(subItem.name))}
                  >
                    {subItem.name}
                  </li>
                ))}
              </div>
            </Collapse>
          );
        }
      })}
    </ul>
  );
};
export default Layout;
