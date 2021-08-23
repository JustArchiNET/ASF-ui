import VTooltip from 'v-tooltip';
import { get } from '../utils/storage';

export default {
  install(Vue) {
    if (this.installed) return;
    this.installed = true;

    Vue.use(VTooltip, {
      defaultDelay: {
        show: get('settings:tooltip-delay', 0),
      },
    });
  },
};
