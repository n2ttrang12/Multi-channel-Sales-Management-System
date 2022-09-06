import { Collapse } from 'components';
import React, { Fragment, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { routerLinks } from 'utils';
import { useNavigate, useLocation } from 'react-router';
import './index.less';
import listMenu from '../menus';
import { useAuth } from '../../../global';

const Layout = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const refMenu = useRef();
  const { menu, user } = useAuth();

  useEffect(() => {
    import('perfect-scrollbar').then(({ default: PerfectScrollbar }) => {
      new PerfectScrollbar(document.getElementById('menu-sidebar'), {
        suppressScrollX: true,
      });
    });
  }, []);

  useEffect(() => {
    if (isCollapsed) {
      refMenu.current.scrollTop = 0;
    }
  }, [isCollapsed]);
  return (
    <ul className="menu relative h-[calc(100vh-5rem)]" id={'menu-sidebar'} ref={refMenu}>
      {listMenu(user.userInfor && user.userInfor.roleCode === 'ADMIN').filter((item) => menu.filter((subItem) => subItem.pageUrl === routerLinks(item.name)).length)
        // eslint-disable-next-line array-callback-return
        .map((item, index) => {
        if (!item.child) {
          return (
            <li
              key={index}
              className={classNames('text-gray-300 flex items-center px-3 py-1 m-3', {
                'bg-teal-700 text-white rounded-2xl  ': location.pathname === routerLinks(item.name),
              })}
              onClick={() => navigate(routerLinks(item.name))}
            >
              <i className={classNames('text-3xl mr-2.5', item.icon)} />
              <span
                className={classNames('text-gray-300 text-base  transition-all duration-300 ease-in-out font-medium', {
                  'opacity-100': !isCollapsed,
                  'opacity-0 text-[0]': isCollapsed,
                  '!text-white': location.pathname === routerLinks(item.name),
                })}
              >
                {item.name}
              </span>
            </li>
          );
        } else {
            return (
              <Collapse
                key={index}
                classNameParent="py-1 my-2 items-center"
                title={
                  <Fragment>
                    <i
                      className={classNames(
                        'text-3xl mr-2.5',
                        item.icon,
                        // {'text-white ': location.pathname === routerLinks(item.name)},
                      )}
                    />
                    <span
                      className={classNames(
                        'text-gray-300 text-base transition-all duration-300 ease-in-out font-medium',
                        {
                          'opacity-100': !isCollapsed,
                          'opacity-0 text-[0]': isCollapsed,
                          '!text-white ': location.pathname === routerLinks(item.name),
                        },
                      )}
                    >
                      {item.name}
                    </span>
                  </Fragment>
                }
                className="flex items-center px-6 py-1 text-gray-300"
                showArrow={!isCollapsed}
                popover={isCollapsed}
                isExpand={location.pathname.indexOf(routerLinks(item.name)) === 0}
              >
                <div className="px-4 mx-4">
                  {item.child.map((subItem, index) => {
                      let check = false;
                      menu.filter((menuItem) => {
                        return menuItem.children?.filter((childItem) => {
                          if (childItem.pageUrl === routerLinks(subItem.name)) {
                            check = true
                          }
                          return true;
                        })
                      });
                      return check ? (
                        <li
                          key={index}
                          className={classNames('py-2 text-gray-300 my-2 font-medium text-base', {
                            'bg-teal-700 !text-white rounded-2xl  ': location.pathname === routerLinks(subItem.name),
                          })}
                          onClick={() => navigate(routerLinks(subItem.name))}
                        >
                          {subItem.name}
                        </li>
                      ) : ''
                    }
                  )}
                </div>
              </Collapse>
            );
        }
      })}
    </ul>
  );
};
export default Layout;
