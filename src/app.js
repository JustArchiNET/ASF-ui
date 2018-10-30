import Vue from 'vue';
import * as Sentry from '@sentry/browser';

import App from './App.vue';
import router from './router';
import store from './store';

import i18n from './plugins/i18n';
import Notifications from './plugins/notifications';
import Icons from './plugins/icons';

Vue.use(Notifications);
Vue.use(Icons);
Vue.use(i18n, store);

new Vue({
	el: '#app',
	render: h => h(App),
	router,
	store
});

Sentry.init({
	dsn: 'https://e93b07e78df747708403e423ebc5e97e@sentry.io/1312571',
	integrations: [new Sentry.Integrations.Vue({ Vue })]
});

Sentry.configureScope(scope => {
	scope.setTag('commit', COMMITHASH);
});
