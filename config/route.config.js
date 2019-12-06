export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/demo',
            name: 'demo',
            icon: 'database', // component: './demo',
          },
          {
            path: '/user',
            name: 'user',
            icon: 'user',
            component: './user/list',
          },
          {
            path: '/system',
            name: 'system',
            icon: 'setting',
            routes: [
              {
                path: '/system/menu',
                name: 'menu',
                icon: 'menu',
                component: './system/menu',
              },
              {
                path: '/system/role',
                name: 'role',
                icon: 'user',
                component: './system/role',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
