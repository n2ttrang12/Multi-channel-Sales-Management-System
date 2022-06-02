import React, {useState,  Fragment} from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {Message} from "components";
import {Form, Spin} from "components";
import {routerLinks} from "utils";
// import { UserService } from "services/user";
import { ColumnSendOtp } from "columns/auth";
import { Link } from "react-router-dom";

const Page = ({location}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);


  const submit = async (values) => {
    try {
      // setLoading(true); 
      // const res = await UserService.forgotPass({
      //   ...values,
      //   // isRemember: values.isRemember !== undefined,
      // });
      // if (res.data.uuid) {
      //   setLoading(false);
      // }
      // Message.success('', () =>  );
      navigate(routerLinks("ResetPass"),)
    } catch (err) {
      setLoading(false);
      await Message.error(err.response.data.message);
    }
  };

  return (
    <Fragment>
      <div className="mb-8 mt-14 title-auth">
        <h1>{'Quên Mật Khẩu'}</h1>
        <h5>{'Vui lòng nhập mã OTP đã gửi đến email của bạn'}</h5>
      </div>
      <Spin spinning={loading}>
        <Form
          className="mx-auto form-login"
          columns={ColumnSendOtp({ t })}
          textSubmit={'Gửi OTP'}
          handSubmit={submit}
          idSubmit={'submit-btn'}

        />
      </Spin>
      <div className="text-center mt-4"
       
       >
        <Link className="text-cyan-700 underline" 
        to={routerLinks("Login")}
        >
          {'Quay trở lại Đăng nhập'}
        </Link>
      </div>
    </Fragment>
  );
};

export default Page;
