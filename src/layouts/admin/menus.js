const Layout = (roleCode) => [
  {
    icon: 'lab la-buffer',
    name: 'Dashboard',
  },
  {
    icon: 'las la-user-friends',
    name: 'Quản lý người dùng',
  },
  {
    icon: 'las la-shopping-cart',
    name: 'Quản lý hàng hóa',
    child: [
      {
        name: 'Sản phẩm',
      },
      {
        name: 'Danh mục',
      },
    ],
  },
  roleCode === 'ADMIN'
    ? {
        icon: 'las la-store-alt',
        name: 'Quản lý cửa hàng',
      }
    : {
        icon: 'las la-store-alt',
        name: 'Quản lý cửa hàng',
        child: [
          {
            name: 'Thông tin cửa hàng',
          },
          {
            name: 'Doanh thu theo SP',
          },
          {
            name: 'Doanh thu theo ĐH',
          },
          {
            name: 'Quản lý kho',
          },
        ],
      },
  roleCode === 'ADMIN'
    ? {
        icon: 'las la-luggage-cart',
        name: 'Quản lý nhà cung ứng',
      }
    : {
        icon: 'las la-luggage-cart',
        name: 'Quản lý nhà cung ứng',
        child: [
          {
            name: 'Thông tin nhà cung ứng',
          },
          {
            name: 'Doanh thu',
          },
          {
            name: 'Chiết khấu',
          },
          {
            name: 'Hợp đồng',
          },
        ],
      },
  roleCode !== 'OWNER_STORE' && {
    icon: 'las la-clipboard-list',
    name: 'Quản lý đơn hàng',
  },
  {
    icon: 'las la-link',
    name: 'Quản lý hợp đồng',
  },
  {
    icon: 'las la-hand-holding-usd',
    name: 'Doanh thu',
  },
  {
    icon: 'las la-boxes',
    name: 'Đặt hàng',
  },
  roleCode === 'OWNER_STORE' && {
    icon: 'las la-clipboard-list',
    name: 'Nhập hàng',
    child: [
      {
        name: 'Quản lý đơn hàng',
      },
      {
        name: 'Nhập hàng KM',
      },
    ],
  },
  {
    icon: 'las la-link',
    name: 'Quản lý kết nối',
    child: [
      { name: 'Kết nối' },
      // { name: 'Hợp đồng' }
    ],
  },
];
export default Layout;


