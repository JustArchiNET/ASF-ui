export default [
  {
    path: '/',
    name: 'statistics',
    component: () => import('../views/Statistics.vue')
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('../views/Setup.vue'),
    meta: { noPasswordRequired: true }
  },
  {
    path: '/ipc-configuration',
    name: 'ipc-configuration',
    component: () => import('../views/IPCConfiguration.vue')
  },
  {
    path: '/bots',
    name: 'bots',
    component: () => import('../views/Bots.vue')
  },
  {
    path: '/commands',
    name: 'commands',
    component: () => import('../views/Commands.vue')
  },
  {
    path: '/log',
    name: 'log',
    component: () => import('../views/Log.vue')
  }
];