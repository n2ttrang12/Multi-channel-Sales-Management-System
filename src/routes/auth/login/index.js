import React, {useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router";

import { useAuth } from "global";
import {Form, Spin} from "components";
import {routerLinks} from "utils";
import { ColumnLogin } from "columns/auth";
import {UserService} from "services/user";

const Page = ({location}) => {
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
        navigate(routerLinks("Dashboard"), {replace: true});
      }
    } catch (err) {
      console.log("Error is:", err);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="intro-x text-4xl mb-3 font-bold">{t("routes.auth.login.title")}</h1>
        <h5 className="intro-x font-medium text-gray-300">{t("routes.auth.login.subTitle")}</h5>
      </div>
      <Spin spinning={loading}>
        <Form
          className="intro-x"
          columns={ColumnLogin({ t })}
          textSubmit={t("routes.auth.login.Log In")}
          handSubmit={submit}
        />
      </Spin>
      <div className="mt-3 intro-x">
        Don't have an account?
        <Link to={routerLinks("Login")}>
          {t("routes.auth.login.Forgot Password")}
        </Link>
      </div>
    </Fragment>
  );
};

export default Page;
