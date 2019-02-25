import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import store from '../store';
import * as storage from '../utils/storage';

import routes from './routes';

Vue.use(VueRouter);
Vue.use(VueMeta);

const router = new VueRouter({
	routes,
	base: window.__BASE_PATH__ ? window.__BASE_PATH__ : '/',
	mode: 'history'
});

router.beforeEach(async (routeTo, routeFrom, next) => {
	if (!storage.get('welcome') && routeTo.name !== 'welcome') return next({ name: 'welcome' });

	const noPasswordRequired = routeTo.matched.every(route => route.meta.noPasswordRequired);
	if (noPasswordRequired || await store.dispatch('auth/validate')) return next();

	return next({ name: 'setup' });
});

router.afterEach((to, from) => {
	storage.set('last-visited-page', { name: to.name, query: to.query, params: to.params });
});

router.onError(err => {
	if (err.type === 'missing') location.reload(true);
	else throw err;
});

export default router;
