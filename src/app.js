import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

import Notifications from './plugins/notifications';
import Icons from './plugins/icons';

Vue.use(Notifications);
Vue.use(Icons);

new Vue({
	el: '#app',
	render: h => h(App),
	router,
	store,
	i18n
});
