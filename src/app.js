import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';

import Notifications from './plugins/notifications';
import Icons from './plugins/icons';

import VueTour from 'vue-tour';

require('vue-tour/dist/vue-tour.css');

Vue.use(Notifications);
Vue.use(Icons);
Vue.use(VueTour);

new Vue({
	el: '#app',
	render: h => h(App),
	router,
	store
});
