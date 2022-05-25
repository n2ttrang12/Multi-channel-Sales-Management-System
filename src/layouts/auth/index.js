import React, {useEffect, useRef, useCallback} from 'react';
import {Select} from "antd";
import {useTranslation} from "react-i18next";
import {useAuth} from "global";

import logo from "assets/images/logo.svg";
import us from "assets/svg/us.svg";
import vn from "assets/svg/vn.svg";

import './index.less';

const Layout = ({children}) => {
  const { t, i18n } = useTranslation();
  const {changeLanguage, logout} = useAuth();

  const mount = useRef(false)
  const initFunction = useCallback(async () => {
    // if (!!auth.user?.token) {
    //   await UserService.logout();
    // }
    await logout();
  }, [logout])

  useEffect(() => {
    if(!mount.current) {
      mount.current = true;
      initFunction();
    }
  }, [mount, initFunction]);

  if (['en', 'vi'].indexOf(i18n.language) === -1) {
    if (i18n.language === 'vi-VN') {
      changeLanguage('vi');
    } else {
      changeLanguage('en');
    }
  }

  return (
    <div className="layout-auth bg-cover bg-center p-20 relative z-10">
      <div className="container mx-auto block lg:flex bg-white rounded-xl overflow-hidden">
        <div className="w-full lg:w-3/5 p-10 into relative z-10 overflow-hidden flex justify-between flex-col">
          <div className="mb-5">
            <h2 className="font-bold text-3xl -intro-x">
              <a href="/" className="flex items-center text-white hover:text-yellow-500">
                <img className="w-14 mr-3 brightness-0 invert" src={logo} alt=""/> Admin
              </a>
            </h2>
          </div>
          <div className="">
            <h2 className="-intro-x font-bold text-3xl text-white mb-3">Welcome To Admin</h2>
            <p className="-intro-x text-white mb-4">It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters</p>
            <div className="-intro-x mb-4">
              <a href="/"
                 className="bg-blue-300 bg-opacity-50 text-white rounded-md py-2 px-3 inline-block leading-none mr-2">
                <i className="lab la-facebook-f text-xl" />
              </a>
              <a href="/"
                 className="bg-blue-300 bg-opacity-50 text-white rounded-md py-2 px-3 inline-block leading-none mr-2">
                <i className="lab la-twitter text-xl" />
              </a>
              <a href="/"
                 className="bg-blue-300 bg-opacity-50 text-white rounded-md py-2 px-3 inline-block leading-none">
                <i className="lab la-linkedin-in text-xl" />
              </a>
            </div>
            <p className="-intro-x text-white">Copyright © Designed &amp; Developed by <a
              href="https://reactjs.org/">react</a></p>
          </div>
        </div>
        <div className="w-full lg:w-2/5 p-10 flex justify-center flex-col">
          {children}
          <div className="intro-x text-center mt-5">
            <Select value={i18n.language} onChange={(value) => changeLanguage(value)}>
              <Select.Option value="en"><img src={us} alt="US" className="mr-1 w-4 inline-block relative -top-0.5"/> {t('routes.admin.Layout.English')}</Select.Option>
              <Select.Option value="vi"><img src={vn} alt="VN" className="mr-1 w-4 inline-block relative -top-0.5"/> {t('routes.admin.Layout.Vietnam')}</Select.Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
