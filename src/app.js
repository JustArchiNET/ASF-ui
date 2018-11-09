import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';

import i18n from './plugins/i18n';
import Notifications from './plugins/notifications';
import Icons from './plugins/icons';
import http from './plugins/http';
import sentry from './plugins/sentry'

Vue.use(Notifications);
Vue.use(Icons);
Vue.use(i18n, store);
Vue.use(http);
Vue.use(sentry);

new Vue({
	el: '#app',
	render: h => h(App),
	router,
	store
});
