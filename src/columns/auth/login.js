const Column = ({ t }) => {
  return [
    {
      name: 'email',
      title: 'Tên đăng nhập',
      formItem: {
        placeholder: 'Nhập tên đăng nhập',
        rules: [{ type: 'required' }, { type: 'email' }],
      },
    },
    {
      name: 'password',
      title: 'Mật khẩu',
      formItem: {
        placeholder: 'Nhập mật khẩu',
        type: 'password',
        rules: [{ type: 'required' }, { type: 'min', value: 6 }],
      },
    },
  ];
};
export default Column;
