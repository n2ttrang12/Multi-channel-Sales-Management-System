import axios from "axios";

import { routerLinks } from "utils";
import { Message } from "components";
import { keyRefreshToken, keyToken } from "../../variable";

export const UserService = {
  nameLink: "User",
  login: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(UserService.nameLink, "api")}/sign-in`, values);
      return data;
     
    } catch (e) {
      console.error(e);
      if (e.response.data.message) { Message.error({text:e.response.data.message}) } else {
        Message.error('Có lỗi xảy ra trong quá trình đăng nhập')
      };
      return false;
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(keyRefreshToken);
      if (refreshToken) {
        const { data } = await axios.post(
          `${routerLinks(UserService.nameLink, "api")}/refresh-token`,
          {}, { params: { refreshToken: "Bearer " + refreshToken } }
        );
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.accessToken;
        localStorage.setItem(keyToken, data.accessToken);
        return data;
      }
      return null
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {Message.error({text:e.response.data.message});} else {
        Message.error('Có lỗi xảy ra trong quá trình đăng nhập')
      };
      return false;
    }
  },
  logout: async () => {
    try {
      const { data } = await axios.post(
        `${routerLinks(UserService.nameLink, "api")}/log-out`
      );
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message){ Message.error({text:e.response.data.message})}else {
        Message.error('Có lỗi xảy ra trong quá trình đăng xuất')
      };
      return false;
    }
  },
 
  forgotPass: async (values) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(UserService.nameLink, "api")}/forgot-password`, values
      );
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {Message.error({text:e.response.data.message});}
      else {
        Message.error('Có lỗi xảy ra trong quá trình thao tác')
      };
      return false;
    }
  },

  sendOtp: async (values) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(UserService.nameLink, "api")}/verify-forgot-password`, values
      );
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {Message.error({text:e.response.data.message})}
      else {
        Message.error('Có lỗi xảy ra trong quá trình thao tác')
      };
      return false;
    }
  },

  setPass: async (values) => {
    try {
      console.log(values);
      const { data } = await axios.put(
        `${routerLinks(UserService.nameLink, "api")}/set-password`, values
      );
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {Message.error({text:e.response.data.message})}
      else {
        Message.error('Có lỗi xảy ra trong quá trình thao tác')
      };
      return false;
    }
  },
};
