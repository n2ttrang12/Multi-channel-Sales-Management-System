import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "global";
import { Form, Spin } from "components";
import { routerLinks } from "utils";
import { ColumnLogin } from "columns/auth";
import { UserService } from "services/user";
import "./index.less";

const Page = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const submit = async (values) => {
    try {
      setLoading(true);
      console.log(values);
      const res = await UserService.login({
        ...values,
        username: values.email,
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
      <div className="mb-8 mt-14 title-auth">
        <h1>{"Đăng nhập"}</h1>
        <h5>
          {
            "Vui lòng đăng nhập bằng tài khoản được cung cấp bởi quản lý hệ thống"
          }
        </h5>
      </div>
      <Spin spinning={loading}>
        <Form
          className="w-3/4 mx-auto form-login"
          columns={ColumnLogin({ t })}
          textSubmit={"Đăng nhập"}
          handSubmit={submit}
          idSubmit={"submit-btn"}
        />
      </Spin>
      <div
        className="intro-x pt-1 -mt-28 bottom-16 right-12 sm:right-[6rem] lg:right-16 
       md:mt-1 absolute xl:absolute  xl:pt-1 xl:-mt-32"
      >
        <Link
          className="text-cyan-700 underline"
          id="reset-pass-link"
          to={routerLinks("ForgotPass")}
        >
          {"Quên mật khẩu"}
        </Link>
      </div>
    </div>
  );
};
// to={routerLinks("ForgotPass")}
export default Page;
