import React, { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "global";
import { Form, Spin } from "components";
import { routerLinks } from "utils";
import { ColumnLogin } from "columns/auth";
import { UserService } from "services/user";
import './index.less'

const Page = ({ location }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.login({
        ...values,
        isRemember: values.isRemember !== undefined,
      });
      setLoading(false);
      if (res.data) {
        auth.login(res.data);
        navigate(routerLinks("Dashboard"), { replace: true });
      }
    } catch (err) {
      console.log("Error is:", err);
      setLoading(false);
    }
  };

  return (
    <div className="relative bottom-0 right-0">
      
      <div className="mb-8 mt-14 ">
        <h1 className=" text-4xl mb-8 font-bold text-cl text-center text-cyan-900">{'Đăng nhập'}</h1>
        <h5 className=" font-medium  text-center text-cyan-900">{'Vui lòng đăng nhập bằng tài khoản được cung cấp bởi quản lý hệ thống'}</h5>
      </div>
      <Spin spinning={loading}>
        <Form
          className=" w-3/4 mx-auto form-login"
          columns={ColumnLogin({ t })}
          textSubmit={t("routes.auth.login.Log In")}
          handSubmit={submit}
          idSubmit={'submit-login'}
        />
      </Spin>
      <div className="intro-x pt-1 -mt-28 bottom-16 right-12 sm:right-[6rem] lg:right-16  md:mt-1 absolute xl:absolute  xl:pt-1 xl:-mt-32">
        <p className="text-cyan-700 underline" >
          {'Quên mật khẩu'}
        </p>
      </div>
    </div>
  );
};
// to={routerLinks("ForgotPass")}
export default Page;
