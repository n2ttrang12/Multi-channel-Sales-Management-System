const Column = ({ t }) => {
  return [
    {
      name: "username",
      title: 'Tên đăng nhập',
      formItem: {
        placeholder: t("columns.auth.login.Enter Username"),
        rules: [{ type: "required" }],
      },
    },
    {
      name: "password",
      title: 'Mật khẩu',
      formItem: {
        placeholder: t("columns.auth.login.Enter Password"),
        type: "password",
        rules: [{ type: "required" }, { type: "minLength", value: 6 }],
      },
    },
  ];
};
export default Column;
