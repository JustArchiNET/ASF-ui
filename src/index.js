import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';

import http from './utils/http';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faWrench, faBars, faLaptop, faUsers, faFileAlt, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faWrench, faBars, faLaptop, faUsers, faFileAlt, faTachometerAlt);

Vue.component('font-awesome-icon', FontAwesomeIcon);

const app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
});

window.http = http;