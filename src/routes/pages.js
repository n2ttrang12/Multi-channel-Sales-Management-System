import React from 'react';
import { routerLinks } from 'utils';

export const pages = [
  {
    layout: React.lazy(() => import('../layouts/auth')),
    isPublic: true,
    child: [
      {
        path: routerLinks('Login'),
        component: React.lazy(() => import('./auth/login')),
        title: 'Login',
      },
      {
        path: routerLinks('ForgotPass'),
        component: React.lazy(() => import('./auth/forget-password')),
        title: 'Forgot Password',
      },
      {
        path: routerLinks('ResetPass'),
        component: React.lazy(() => import('./auth/reset-password')),
        title: 'Reset Password',
      },
      {
        path: routerLinks('SendOTP'),
        component: React.lazy(() => import('./auth/send-otp')),
        title: 'Send Otp',
      },
    ],
  },
  {
    layout: React.lazy(() => import('../layouts/admin')),
    isPublic: false,
    child: [
      // {
      //   path: '/',
      //   component: routerLinks("Dashboard"),
      //   title: "Home",
      // },
      {
        path: routerLinks('Dashboard'),
        component: React.lazy(() => import('./admin/dashboard')),
        title: 'Dashboard',
      },
      {
        path: routerLinks('User'),
        component: React.lazy(() => import('./admin/user')),
        title: 'User',
      },
    ], // 💬 generate link to here
  },
];

export const arrayPaths = [];
pages.map((layout) => {
  const paths = [];
  layout.child.map((page) => {
    paths.push(page.path);
    return page;
  });
  arrayPaths.push(paths);
  return layout;
});
