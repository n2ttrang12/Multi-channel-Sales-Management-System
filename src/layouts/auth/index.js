import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from "global";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import footerImage from "assets/images/footer.png"
import './index.less'
import logo from "assets/images/logo.png";

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();

  const mount = useRef(false)
  const initFunction = useCallback(async () => {
    // if (!!auth.user?.token) {
    //   await UserService.logout();
    // }
    await logout();
  }, [logout])

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      initFunction();
    }
  }, [mount, initFunction]);
  let imageURL = "";

  switch (location.pathname) {
    case "/auth/login":
      imageURL = "bg-[url('assets/images/bg-login.png')]";
      break;

    default:
      imageURL = "bg-[url('assets/images/bg-login.png')]";
      break;
  }
  return (
    <div className='h-full overflow-scroll'>
      <div className="bg-white bg-cover bg-center h-full relative min-h-[600px] ">
        <div className="block lg:flex  h-full">
          <div className="w-full lg:w-1/2  relative lg:flex justify-between flex-col hidden "
          >
            <div
              className={classNames(
                imageURL,
                "bg-cover bg-center w-full  lg:min-h-full  min-h-[600px] relative overflow-hidden flex justify-between flex-col"
              )}
            >
              <img src={logo} alt="logoUhouse" className="w-10 sm:w-20 p-4" />

            </div>
          </div>
          <div className="mx-auto p-10 flex flex-col ">
            {children}
          </div>
        </div>
        <div className='absolute w-full z-10 bottom-0 h-28'
          style={{ backgroundImage: 'url(' + footerImage + ')', backgroundSize: 'cover' }}
        >
          <div className='absolute -translate-x-1/2  top-1/2 left-1/2 text-white'>
            <p className='hidden sm:block'>Powered By ARI Technology Co ., JSC </p>
          </div>
        </div>
      </div>
    </div>

  );
};
export default Layout;
