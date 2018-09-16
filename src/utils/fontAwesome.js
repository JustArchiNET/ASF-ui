import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faWrench, faBars, faLaptop, faUsers, faFileAlt, faTachometerAlt, faHome, faPowerOff, faPause, faCogs, faClock,
  faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faWrench, faBars, faLaptop, faUsers, faFileAlt, faTachometerAlt, faHome, faPowerOff, faPause, faCogs, faClock,
  faTimesCircle, faCheckCircle);

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
Vue.component('font-awesome-icon', FontAwesomeIcon);