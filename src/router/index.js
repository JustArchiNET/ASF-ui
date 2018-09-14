import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import routes from './routes';

export default new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});
