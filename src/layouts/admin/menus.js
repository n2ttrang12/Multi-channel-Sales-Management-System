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
      {
        name: 'Thuế',
      },
    ],
  },
  roleCode === 'OWNER_STORE' && {
    icon: 'las la-luggage-cart',
    name: 'Quản lý NCC',
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
            name: 'Quản lý chi nhánh',
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
        name: 'Quản lý nhà cung cấp',
      }
    : {
        icon: 'las la-luggage-cart',
        name: 'Quản lý nhà cung cấp',
        child: [
          {
            name: 'Thông tin NCC',
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
  roleCode === 'OWNER_SUPPLIER' && {
    iconSvg: '/images/return.svg',
    name: 'Quản lý trả hàng',
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
  // roleCode === 'OWNER_STORE' && 
  {
    icon: 'las la-clipboard-list',
    name: 'Quản lý kho',
    child: [
      {
        name: 'Quản lý đơn hàng',
      },
      {
        name: 'Nhập hàng KM',
      },
      {
        name: 'Hủy hàng',
      },
      {
        name: 'Trả hàng',
      },
      roleCode === 'OWNER_STORE' && {
        name: 'Tồn kho',
      },
    ],
  },
  roleCode === 'OWNER_STORE' &&  {
    icon: 'las la-ban',
    name: 'Hủy hàng',
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
