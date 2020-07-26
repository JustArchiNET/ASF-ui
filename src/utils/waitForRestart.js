import Vue from 'vue';
import delay from './delay';
import store from '../store';

export default async function waitForRestart(timeout = 120000) {
  const timeStarted = Date.now();

  while (timeStarted > Date.now() - timeout) {
    await store.dispatch('asf/update');
    if (Date.now() - store.getters['asf/startTime'].getTime() < 10000) return;
    await delay(1000);
  }

  throw new Error(Vue.i18n.translate('restart-failure'));
}
