const Util = (name, type) => {
  const array = {
    Login: '/auth/login',
    ForgotPass: '/auth/forgot-password',
    ResetPass: '/auth/reset-password',
    SendOTP: '/auth/send-otp',
    Dashboard: '/',
    User: '/user',
    Category: '/category',
    'Danh mục': '/category',
    CategoryCreate: '/category/create',
    CategoryEdit: '/category/edit',
    CategoryDetail: '/category/detail',
    
  }; // 💬 generate link to here

  const apis = {
    Dashboard: '/dashboard',
    User: '/user-admin',
    StoreSupplier: '/sub-organization',
    Cart: '/cart',
    OrderManagement: '/orders',
  }; // 💬 generate api to here

  switch (type) {
    case 'api':
      return apis[name];
    default:
      return array[name];
  }
};
export default Util;
