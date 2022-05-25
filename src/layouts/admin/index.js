import React, {useState, useEffect} from "react";
import {Select, Dropdown} from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import classNames from "classnames";

import { useAuth } from "global";
import logo from "assets/images/logo.svg";
import avatar from "assets/images/avatar.jpeg";
import us from "assets/svg/us.svg";
import vn from "assets/svg/vn.svg";

// import menus from "./menus";
import "./index.less";
import {routerLinks} from "utils";
import {Avatar} from "components";
import Menu from './menu'

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  // menuVertical, permission,
  const {user, changeLanguage} = useAuth();
  const navigate = useNavigate();

  const [isCollapsed, set_isCollapsed] = useState(window.innerWidth < 1024);
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 767);

  useEffect(() => {

    function handleResize() {
      if (window.innerWidth < 1024 && !isCollapsed) {
        set_isCollapsed(true);
      }
      if (window.innerWidth > 767 && !isDesktop) {
        set_isDesktop(true);
      } else if (window.innerWidth <= 767 && isDesktop) {
        set_isDesktop(false);
      }
    }
    window.addEventListener("resize", handleResize, true);
    import("perfect-scrollbar").then(({default: PerfectScrollbar}) => {
      new PerfectScrollbar(document.getElementById('root'), {
        suppressScrollX: true,
      });
    });

    return () => window.removeEventListener("resize", handleResize, true);
  }, [isCollapsed, isDesktop]);

/*  let _menus = menus();

  const arrayTitle = history.location.pathname
    .substring(1, history.location.pathname.length)
    .split("/")
    .map((str) => str[0].toUpperCase() + str.substring(1, str.length).toLowerCase());
  let tempTitle = "";*/

  const Header = ({isCollapsed, isDesktop}) => (
    <header
      className={classNames("bg-blue-50 w-full header h-20 transition-all duration-300 ease-in-out sticky top-0 block z-10", {
        'pl-80': !isCollapsed && isDesktop, 'pl-32': isCollapsed && isDesktop, 'pl-28': !isDesktop
      })}>
      <div className="flex items-center justify-end sm:justify-between px-5 h-20">
        <Select value={i18n.language} onChange={(value) => changeLanguage(value)}>
          <Select.Option value="en"><img src={us} alt="US" className="mr-1 w-4 inline-block relative -top-0.5"/> {t('routes.admin.Layout.English')}</Select.Option>
          <Select.Option value="vi"><img src={vn} alt="VN" className="mr-1 w-4 inline-block relative -top-0.5"/> {t('routes.admin.Layout.Vietnam')}</Select.Option>
        </Select>
        <div className="flex items-center">
          <div className="mr-5 relative flex group">
            <div
              className="rounded-full text-white w-5 h-5 bg-blue-400 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">4
            </div>
            <i className="las la-bell text-4xl text-gray-500" />
          </div>
          <div className="mr-5 relative flex group">
            <div
              className="rounded-full text-white w-5 h-5 bg-yellow-500 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">76
            </div>
            <i className="las la-comment text-4xl text-gray-500" />
          </div>
          <Dropdown
            trigger={['hover','click']}
            overlay={<ul className="bg-blue-50">
            <li className="p-2 hover:bg-blue-100" onClick={() => navigate(routerLinks("Login"), {replace: true})}>
              Sign Out
            </li>
          </ul>} placement="bottomRight">
            <section
              className="flex items-center"
              id={'dropdown-profile'}
            >
              <div className="text-right leading-none mr-3 hidden sm:block">
                <div className="font-bold text-black text-lg leading-snug mb-0.5">{user?.name}</div>
                <div className="text-gray-500">admin@admin.com</div>
              </div>
              <Avatar src={avatar} size={10} />
            </section>
          </Dropdown>

        </div>
      </div>
    </header>
  );
  return (
    <main>
      <Header isCollapsed={isCollapsed} isDesktop={isDesktop}/>
      <div
        className={classNames(
          "flex items-center justify-between text-gray-800 hover:text-gray-500 h-20 fixed top-0 left-0 px-5 font-bold transition-all duration-300 ease-in-out z-10",
          {
            'w-80': !isCollapsed && isDesktop,
            'w-20': isCollapsed,
            'bg-blue-100': isDesktop,
            'bg-blue-50': !isDesktop
          })}
      >
        <div>
          <a href="/" className="flex items-center">
            <img className="w-10" src={logo} alt=""/>
            <div
              id={'name-application'}
              className={classNames(
              'transition-all duration-300 ease-in-out absolute left-16 w-48 overflow-ellipsis overflow-hidden ml-2',
              {
                'opacity-100 text-3xl': !isCollapsed && !!isDesktop,
                'opacity-0 text-[0px] invisible': !!isCollapsed || !isDesktop
              })}
            >
              Admin
            </div>
          </a>
        </div>

        <div className={classNames("hamburger", {'is-active': (isCollapsed && isDesktop) || (!isCollapsed && !isDesktop)})} onClick={() => set_isCollapsed(!isCollapsed)}>
          <span className="line" /><span className="line" /><span className="line" />
        </div>
      </div>
      <div
        className={classNames("fixed z-10 top-20 left-0 h-screen bg-blue-100 transition-all duration-300 ease-in-out",
          {'w-80': !isCollapsed, 'w-20': isCollapsed, '-left-20': isCollapsed && !isDesktop})}
      >

        <Menu isCollapsed={isCollapsed}/>

      </div>
      <div className={classNames("ml-80 px-5 transition-all duration-300 ease-in-out z-10",
        {'ml-80': !isCollapsed && isDesktop, 'ml-20': isCollapsed && isDesktop})}>
        {children}
        <div className="text-center bg-blue-50 mt-10">
          React Software Ltd. ©{new Date().getFullYear()}
        </div>
      </div>
      <div className="hidden h-7 w-7 leading-7" />
    </main>
  );
};
export default Layout;
