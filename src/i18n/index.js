import Vue from 'vue';
import VuexI18n from 'vuex-i18n';
import store from '../store';

import enUS from './locale/default.json';

Vue.use(VuexI18n.plugin, store);
Vue.i18n.add('en-US', enUS);
Vue.i18n.set('en-US');
Vue.i18n.fallback('en-US');
