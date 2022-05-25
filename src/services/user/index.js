import axios from "axios";

import {routerLinks} from "utils";
import {Message} from "components";
import {keyRefreshToken, keyToken} from "../../variable";

export const UserService = {
  nameLink: "User",
  login: async (values) => {
    try {
      // const { data } = await axios.post(`${routerLinks(UserService.nameLink, "api")}/login`, values);
      return {
        // ...data,
        data: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMSIsInJvbGUiOiJVc2VyIiwibmJmIjoxNjI0MzY5Mjk3LCJleHAiOjE2MjQ0NTU2OTcsImlhdCI6MTYyNDM2OTI5NywiaXNzIjoiaHR0cHM6Ly90cnVuZy5uZXQubGV2aW5jaXRlc3QuY29tL2FwaS8ifQ.bGF2dbIZMwEEKbTuTjRJE_kkEyX0znDSQMji1bpIjQU",
          avatarPath: "https://talkpro.edu.vn/wp-content/uploads/2017/11/avatar-girl-xinh-6.jpg",
          createdBy: 1,
          createdDate: "2021-03-17T16:12:50",
          email: "admin@admin.com",
          employeeId: 1,
          id: 2,
          isDisabled: false,
          name: "Nguyễn Văn A",
        },
      };
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(keyRefreshToken);
      if (refreshToken) {
        const { data } = await axios.post(
          `${routerLinks(UserService.nameLink, "api")}/refresh-token`,
          {}, {params: {refreshToken: "Bearer " + refreshToken}}
        );
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.accessToken;
        localStorage.setItem(keyToken, data.accessToken);
        return data;
      }
      return null
    }catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
  logout: async () => {
    try {
      const { data } = await axios.post(
        `${routerLinks(UserService.nameLink, "api")}/log-out`
      );
      return data;
    }catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
  get: async (params) => {
    try {
      // const { data } = await axios.get(routerLinks(UserService.nameLink, "api"), {
      //   params,
      // });
      // return data;
      return {
        data: [
          {id: 1,name: 'Nguyễn Văn 1', username: 'UserName1', email: 'email1@gmail.com', isActive: false,},
          {id: 2,name: 'Nguyễn Văn 2', username: 'UserName2', email: 'email2@gmail.com', isActive: true,},
          {id: 3,name: 'Nguyễn Văn 3', username: 'UserName3', email: 'email3@gmail.com', isActive: false,},
          {id: 4,name: 'Nguyễn Văn 4', username: 'UserName4', email: 'email4@gmail.com', isActive: true,},
          {id: 5,name: 'Nguyễn Văn 5', username: 'UserName5', email: 'email5@gmail.com', isActive: false,},
          {id: 6,name: 'Nguyễn Văn 6', username: 'UserName6', email: 'email6@gmail.com', isActive: true,},
          {id: 7,name: 'Nguyễn Văn 7', username: 'UserName7', email: 'email7@gmail.com', isActive: false,},
          {id: 8,name: 'Nguyễn Văn 8', username: 'UserName8', email: 'email8@gmail.com', isActive: true,},
          {id: 9,name: 'Nguyễn Văn 9', username: 'UserName9', email: 'email9@gmail.com', isActive: false,},
          {id: 10,name: 'Nguyễn Văn 10', username: 'UserName10', email: 'email10@gmail.com', isActive: true,},
        ],
        count: 20,
      };
    }catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
  getById: async (id) => {
    try {
      // const { data } = await axios.get(
      //   `${routerLinks(UserService.nameLink, "api")}/${id}`
      // );
      // data.data.mtRoleCode = data.data.userRole?.mtRole?.code;
      // data.data.wardId = data.data.ward?.id;
      // data.data.departmentId = data.data.department?.id;
      // return data;
      return {data: {id}};
    }catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
  post: async (values) => {
    console.log(values);
    try {
      // const { data } = await axios.post(
      //   routerLinks(UserService.nameLink, "api"),
      //   values
      // );
      // if (data.message) Message.success(data.message);
      // return data;
      return values;
    }catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
  put: async (values, id) => {
    try {
      // const { data } = await axios.put(
      //   `${routerLinks(UserService.nameLink, "api")}/${id}`,
      //   values
      // );
      // if (data.message) Message.success(data.message);
      // return data;
      return values;
    }catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
  delete: async (id) => {
    try {
      // const { data } = await axios.delete(
      //   `${routerLinks(UserService.nameLink, "api")}/${id}`
      // );
      // if (data.message) Message.success(data.message);
      // return data;
      return {id};
    }catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
};
