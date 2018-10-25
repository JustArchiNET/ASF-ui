import Snotify from 'vue-snotify';

export default {
	install(Vue) {
		if (this.installed) return;
		this.installed = true;

		Vue.use(Snotify, {
			toast: {
				timeout: 3500
			}
		});

		Vue.prototype.$error = function notifyError(message) {
			Vue.prototype.$snotify.error(message, 'Error');
		};

		Vue.prototype.$success = function notifySuccess(message) {
			Vue.prototype.$snotify.success(message, 'Success');
		};

		Vue.prototype.$info = function notifyInfo(message) {
			Vue.prototype.$snotify.info(message, 'Info');
		};
	}
}
