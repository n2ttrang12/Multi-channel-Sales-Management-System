const Column = ({ t }) => {
  return [
    {
      name: 'password',
      title: 'Mật khẩu',
      formItem: {
        placeholder: 'Nhập mật khẩu',
        type: 'password',
        rules: [
          {
            type: "custom", validator: (form) => ({
              validator: async (rule, value) => {
                if (form.getFieldValue('rePassword') && ( value !== form.getFieldValue('rePassword'))) {
                  return Promise.reject(
                    'Xác nhận mật khẩu không chính xác'
                  );
                }
                if (!!value && value.trim() !== "" && value.length >= 8) {
                  let countvalidator = 0;
                  if (
                    (new RegExp(/\s/).test(value))
                  )
                    return Promise.reject(
                      'Mật khẩu không được có khoảng trắng'
                    );
                  else countvalidator++;
                  if (
                    !(new RegExp(/^(?=.*?[0-9])(?=.*?[A-Z])(?=.*[a-z]).*$/).test(value))
                  )
                    return Promise.reject(
                      'Mật khẩu chưa đạt yêu cầu'
                    );
                  else countvalidator++;
                  if (countvalidator === 2) return Promise.resolve();
                } else return Promise.resolve();
              },
            })
          }

          , { type: "required" }, { type: "password" },
        ],
      }
    },
    {
      name: 'rePassword',
      title: 'Xác nhận mật khẩu',
      formItem: {
        placeholder: 'Xác nhận mật khẩu',
        type: 'password',
        rules: [
          {
            type: "custom", validator: (form) => ({
              validator: async (rule, value) => {
                if (value !== form.getFieldValue('password')) {
                  return Promise.reject(
                    'Xác nhận mật khẩu không chính xác'
                  );
                }
                if (!!value && value.trim() !== "" && value.length >= 8) {
                  let countvalidator = 0;
                  if (
                    (new RegExp(/\s/).test(value))
                  )
                    return Promise.reject(
                      'Mật khẩu không được có khoảng trắng'
                    );
                  else countvalidator++;
                  if (
                    !(new RegExp(/^(?=.*?[0-9])(?=.*?[A-Z])(?=.*[a-z]).*$/).test(value))
                  )
                    return Promise.reject(
                      'Mật khẩu chưa đạt yêu cầu'
                    );
                  else countvalidator++;
                  if (countvalidator === 2) return Promise.resolve();
                } else return Promise.resolve();
              },
            })
          },
          { type: 'required' },
        ]
      }
    },
  ];
};

export default Column;
