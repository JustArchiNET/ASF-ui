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
	const noPasswordRequired = routeTo.matched.every(route => route.meta.noPasswordRequired);
	if (noPasswordRequired || await store.dispatch('auth/validate')) return next();

	// const steamOwnerID = await store.dispatch('asf/getSteamOwnerID');
	// const botsDetected = await store.dispatch('bots/detectBots');
	// if (steamOwnerID !== '0' && botsDetected) storage.set('setup-complete', true);

	if (storage.get('first-time', true) && routeTo.name !== 'welcome') return next({ name: 'welcome' });

	return next({ name: 'setup' });
});

router.afterEach((to, from) => {
	storage.set('last-visited-page', { name: to.name, query: to.query, params: to.params });
});

router.onError(err => {
	if (err.type === 'missing') window.location.reload(true);
	else throw err;
});

export default router;
