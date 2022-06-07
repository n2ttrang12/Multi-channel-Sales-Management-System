const Column = ({ t }) => {
  return [
    {
      name: "email",
      title: "Tên đăng nhập",
      formItem: {
        placeholder: "Nhập tên đăng nhập",
        rules: [{ type: "required" }],
      },
    },
    {
      name: "password",
      title: "Mật khẩu",
      formItem: {
        placeholder: "Nhập mật khẩu",
        type: "password",
        rules: [{ type: "required" }, { type: "minLength", value: 6 }],
      },
    },
  ];
};
export default Column;
