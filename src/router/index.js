import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Meta from 'vue-meta';

Vue.use(VueRouter);
Vue.use(Meta);

import routes from './routes';

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

router.beforeEach(async (routeTo, routeFrom, next) => {
  const noPasswordRequired = routeTo.matched.every(route => route.meta.noPasswordRequired);
  if (noPasswordRequired) return next();

  const validPassword = store.getters['auth/validPassword'] || await store.dispatch('auth/validate');
  if (validPassword) return next();

  return next({ name: 'setup' });
});

export default router;