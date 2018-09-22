import Vue from 'vue';
import VTooltip from 'v-tooltip'

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VTooltip);

import './utils/fontAwesome';

new Vue({
	el: '#app',
	render: h => h(App),
	router,
	store
});

import fetchWiki from './utils/fetchWiki';
window.fetchWiki = fetchWiki;
