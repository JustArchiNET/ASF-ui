export default [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('../views/Setup.vue'),
  }
]