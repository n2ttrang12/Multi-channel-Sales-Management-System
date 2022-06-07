import React, { useState, Fragment } from "react";
import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Message } from "components";
import { Form, Spin } from "components";
import { routerLinks } from "utils";
import { UserService } from "services/user";
import { ColumnResetPassword } from "columns/auth";
import "./index.less";

const Page = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.setPass({
        ...values,
        email: location.state.email,
        uuid: location.state.uuid,
      });
      if (res.statusCode === 200) {
        Message.success("Đổi mật khẩu thành công!");
        navigate(routerLinks("Login"));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      await Message.error(err.response.data.message);
    }
  };

  return (
    <Fragment>
      <div className="mb-8 mt-14 title-auth">
        <h1>{"Đặt Lại Mật Khẩu"}</h1>
        <h5>
          {
            "Mật khẩu yêu cầu có 8 ký tự trở lên, có ít nhất 1 chữ hoa và 1 chữ số."
          }
        </h5>
      </div>
      <Spin spinning={loading}>
        <Form
          className="w-3/4 mx-auto form-login"
          columns={ColumnResetPassword({ t })}
          textSubmit={"Đổi mật khẩu"}
          handSubmit={submit}
          idSubmit={"submit-btn"}
        />
      </Spin>
      {/* <div className="text-center mt-4"
       >
         {/* absolute xl:absolute */}
      {/* <Link className="text-cyan-700 underline" 
        to={routerLinks("Login")}
        >
          {'Quay trở lại Đăng nhập'}
        </Link>
      </div> */}
    </Fragment>
  );
};

export default Page;
