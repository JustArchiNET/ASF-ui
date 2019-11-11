import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';

import i18n from './plugins/i18n';
import Notifications from './plugins/notifications';
import Icons from './plugins/icons';
import http, { NotificationError } from './plugins/http';

Vue.use(Notifications);
Vue.use(Icons);
Vue.use(i18n, store);
Vue.use(http);

const app = new Vue({
	el: '#app',
	render: h => h(App),
	router,
	store
});

window.addEventListener('unhandledrejection', err => {
	if (err.reason instanceof NotificationError) {
		app.$error(err.reason.message);
		err.preventDefault();
	}
});
