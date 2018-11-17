import * as storage from '../../utils/storage';

export const state = {
	defaultView: 'home',
	hideBots: 0,
	nicknames: false,
	sentryInstalled: false,
	sentryReporting: false
};

export const mutations = {
	setDefaultView: (state, defaultView) => state.defaultView = defaultView,
	setHideBots: (state, hideBots) => state.hideBots = hideBots,
	setNicknames: (state, nicknames) => state.nicknames = nicknames,
	setSentryInstalled: (state, sentryInstalled) => state.sentryInstalled = sentryInstalled,
	setSentryReporting: (state, sentryReporting) => state.sentryReporting = sentryReporting
};

export const actions = {
	init({ commit }) {
		commit('setDefaultView', storage.get('settings:default-view', 'home'));
		commit('setHideBots', storage.get('settings:hide-bots', 0));
		commit('setNicknames', storage.get('settings:nicknames', false));
		commit('setSentryInstalled', storage.get('settings:sentry-installed', false));
		commit('setSentryReporting', storage.get('settings:sentry-reporting', false));
	},
	setDefaultView({ commit }, value) {
		storage.set('settings:default-view', value);
		commit('setDefaultView', value);
	},
	setHideBots({ commit }, value) {
		storage.set('settings:hide-bots', value);
		commit('setHideBots', value);
	},
	setNicknames({ commit }, value) {
		storage.set('settings:nicknames', value);
		commit('setNicknames', value);
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
	hideBots: state => state.hideBots,
	nicknames: state => state.nicknames,
	sentryInstalled: state => state.sentryInstalled,
	sentryReporting: state => state.sentryReporting
};
