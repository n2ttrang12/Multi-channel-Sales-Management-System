const Layout = (isAdmin) => [
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
  isAdmin ? {
    icon: "las la-store-alt",
    name: 'Quản lý cửa hàng',
  } : {
    icon: "las la-store-alt",
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
  isAdmin ? {
    icon: 'las la-luggage-cart',
    name: 'Quản lý nhà cung ứng',
  } : {
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
    ]
  },
  {
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
    name: 'Nhập hàng',
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
