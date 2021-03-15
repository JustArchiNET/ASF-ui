import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
});

// Automatically run the `init` action for every module,
// if one exists.
Object.keys(modules).forEach(moduleName => {
  if (modules[moduleName].actions && modules[moduleName].actions.init) {
    store.dispatch(`${moduleName}/init`);
  }
});

store.watch((state, getters) => getters['auth/authenticated'], authenticated => {
  if (authenticated) {
    Object.keys(modules).forEach(moduleName => {
      if (modules[moduleName].actions && modules[moduleName].actions.onAuth) {
        store.dispatch(`${moduleName}/onAuth`);
      }
    });
  }
});

export default store;
