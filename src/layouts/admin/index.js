import React, { useState, useEffect } from 'react';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router';
import classNames from 'classnames';

import logo from 'assets/images/logo.png';
import arrow from 'assets/images/arrow.svg';
import back from 'assets/images/return.png';
import menu from 'assets/images/menuIcon.png';
import avatar from 'assets/images/avatar.jpeg';
import { useTranslation } from 'react-i18next';

// import menus from "./menus";
import './index.less';
import { useAuth } from 'global';
import { routerLinks } from 'utils';
import { Avatar } from 'components';
import Menu from './menu';

const Layout = ({ children }) => {
  // menuVertical, permission,
  const { changeLanguage } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isCollapsed, set_isCollapsed] = useState(window.innerWidth < 1025);
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 767);
  const [isCheckMenu,setIsCheckMenu]= useState(false)
  console.log(isCheckMenu)
  useEffect(() => {
    if (window.innerWidth < 1024 && !isCollapsed) {
      setTimeout(() => {
        set_isCollapsed(true);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth > 1024) {
      import('perfect-scrollbar').then(({ default: PerfectScrollbar }) => {
        new PerfectScrollbar(document.getElementById('root'), {
          suppressScrollX: true,
        });
      });
    }
    function handleResize() {
      if (window.innerWidth < 1025 && !isCollapsed) {
        set_isCollapsed(true);
      }
      set_isDesktop(window.innerWidth > 767);
    }
    window.addEventListener('resize', handleResize, true);
    changeLanguage('vi');

    return () => window.removeEventListener('resize', handleResize, true);
  }, []);

  const Header = ({ isCollapsed, isDesktop }) => (
    <header
      className={classNames(
        'sm:bg-gray-100 bg-white w-full header h-18 transition-all duration-300 ease-in-out sticky top-0 block z-10 mb-2',
        {
          'pl-72': !isCollapsed && isDesktop,
          'pl-32': isCollapsed && isDesktop,
          'pl-28': !isDesktop,
        },
      )}
    >
      {/* <div className="flex items-center justify-end px-5 h-16"> */}
      {/* <Select value={i18n.language} onChange={(value) => changeLanguage(value)}>
          <Select.Option value="en"><img src={us} alt="US" className="mr-1 w-4 inline-block relative -top-0.5"/> {t('routes.admin.Layout.English')}</Select.Option>
          <Select.Option value="vi"><img src={vn} alt="VN" className="mr-1 w-4 inline-block relative -top-0.5"/> {t('routes.admin.Layout.Vietnam')}</Select.Option>
        </Select> */}
      <div className="flex items-center justify-end px-5 h-20">
        <div className="flex items-center">
          <div className="mr-5 relative flex group">
            <div className="rounded-full text-white w-5 h-5 bg-blue-400 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
              1
            </div>
            <i className="las la-bell text-4xl text-gray-500" />
          </div>
          {/* <div className="mr-5 relative flex group">
            <div className="rounded-full text-white w-5 h-5 bg-yellow-500 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
              76
            </div>
            <i className="las la-comment text-4xl text-gray-500" />
          </div> */}
          <Dropdown
            trigger={['hover', 'click']}
            overlay={
              <ul className="bg-blue-50">
                <li className="p-2 hover:bg-blue-100" onClick={() => navigate(routerLinks('Login'), { replace: true })}>
                  Sign Out
                </li>
              </ul>
            }
            placement="bottomRight"
          >
            <section className="flex items-center" id={'dropdown-profile'}>
              <Avatar src={avatar} size={10} />
            </section>
          </Dropdown>
        </div>
      </div>
    </header>
  );
  return (
    <main>
      <Header isCollapsed={isCollapsed} isDesktop={isDesktop} />
      {/* <div className={`${isCollapsed ? 'nav_overlay' : ''}`}>
      </div> */}
      <div
        className={classNames(
          't-10 sm:rounded-tr-3xl flex items-center text-gray-800 hover:text-gray-500 h-20 fixed top-0 left-0 px-5 font-bold transition-all duration-300 ease-in-out z-10',
          {
            'sm:w-72 justify-between': !isCollapsed && isDesktop,
            'sm:w-[64px] justify-center': isCollapsed,
            'bg-teal-900': isDesktop ,
            'bg-blue-50': !isDesktop,
          },
        )}
      >
        <div>
          <a href="/" className="flex items-center">
            <img
              className={classNames('w-12 rounded ml-2', {
                hidden: !!isCollapsed || !isDesktop,
              })}
              src={logo}
              alt=""
            />
            <div
              id={'name-application'}
              className={classNames(
                'transition-all text-white duration-300 ease-in-out absolute left-16 w-40 overflow-ellipsis overflow-hidden ml-7',
                {
                  'opacity-100 text-3xl': !isCollapsed && !!isDesktop,
                  'opacity-0 text-[0px] invisible': !!isCollapsed || !isDesktop,
                },
              )}
            >
              BALANCE
            </div>
          </a>
        </div>
        {/* className={classNames("hamburger", )} */}
        {isDesktop ? (
          <div
            onClick={() => {
              set_isCollapsed(!isCollapsed);
              // set_isDesktop(!isDesktop);
            }}
          >
            <img
              className={classNames('w-4 cursor-pointer', {
                'rotate-180': (!isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
              })}
              src={arrow}
              alt=""
            ></img>
          </div>
        ) : (
          <div
            onClick={() => {
              set_isCollapsed(!isCollapsed);
              setIsCheckMenu(!isCheckMenu)
              // set_isDesktop(!isDesktop);
            }}
          >
            
            <img
              className={classNames('w-8 cursor-pointer text-teal-400', 
              // {
              //   'rotate-180': (isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
              // }
              )
            }
              src={!isCheckMenu ? menu : back}
              alt=""
            ></img>
          </div>
        )}
      </div>
      <div
        className={classNames('fixed z-10 top-20 sm:left-0 h-screen bg-teal-900 transition-all duration-300 ease-in-out', {
          'w-72': !isCollapsed,
          'w-[64px]': isCollapsed,
          '-left-20': isCollapsed && !isDesktop,
        })}
      >
        <Menu isCollapsed={isCollapsed} />
      </div>
      <div
        className={classNames('bg-gray-100 sm:px-5 px-2 transition-all duration-300 ease-in-out z-10', {
          'sm:ml-72': !isCollapsed && isDesktop,
          'ml-14 sm:ml-20 md:ml-14 ': isCollapsed && isDesktop,
        })}
      >
        {children}
        <footer className="text-center bg-blue-50 mt-10 -mx-5">
          {t('layout.footer', { year: new Date().getFullYear() })}
        </footer>
      </div>
      <div className="hidden h-7 w-7 leading-7" />
    </main>
  );
};
export default Layout;
