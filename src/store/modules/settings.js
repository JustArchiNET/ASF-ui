import * as storage from '../../utils/storage';

export const state = {
	defaultView: 'home',
	sentryInstalled: false,
	sentryReporting: false
};

export const mutations = {
	setDefaultView: (state, defaultView) => state.defaultView = defaultView,
	setSentryInstalled: (state, sentryInstalled) => state.sentryInstalled = sentryInstalled,
	setSentryReporting: (state, sentryReporting) => state.sentryReporting = sentryReporting
};

export const actions = {
	init({ commit }) {
		commit('setDefaultView', storage.get('settings:default-view', 'home'));
		commit('setSentryInstalled', storage.get('settings:sentry-installed', false));
		commit('setSentryReporting', storage.get('settings:sentry-reporting', false));
	},
	setDefaultView({ commit }, value) {
		storage.set('settings:default-view', value);
		commit('setDefaultView', value);
	},
	setSentryInstalled({ commit }, value) {
		storage.set('settings:sentry-installed', value);
		commit('setSentryInstalled', value);
	},
	setSentryReporting({ commit }, value) {
		storage.set('settings:sentry-reporting', value);
		commit('setSentryReporting', value);
	}
};

export const getters = {
	defaultView: state => state.defaultView,
	sentryInstalled: state => state.sentryInstalled,
	sentryReporting: state => state.sentryReporting
};
