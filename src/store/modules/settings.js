import * as storage from '../../utils/storage';

export const state = {
	defaultView: 'home',
	nicknames: false,
	sentryInstalled: false,
	sentryReporting: false,
	selectedBots: []
};

export const mutations = {
	setDefaultView: (state, defaultView) => state.defaultView = defaultView,
	setNicknames: (state, nicknames) => state.nicknames = nicknames,
	setSentryInstalled: (state, sentryInstalled) => state.sentryInstalled = sentryInstalled,
	setSentryReporting: (state, sentryReporting) => state.sentryReporting = sentryReporting,
	setSelectedBots: (state, selectedBots) => state.selectedBots = selectedBots
};

export const actions = {
	init({ commit }) {
		commit('setDefaultView', storage.get('settings:default-view', 'home'));
		commit('setNicknames', storage.get('settings:nicknames', false));
		commit('setSentryInstalled', storage.get('settings:sentry-installed', false));
		commit('setSentryReporting', storage.get('settings:sentry-reporting', false));
		commit('setSelectedBots', storage.get('settings:selected-bots', []));
	},
	setDefaultView({ commit }, value) {
		storage.set('settings:default-view', value);
		commit('setDefaultView', value);
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
	},
	setSelectedBots({ commit }, value) {
		storage.set('settings:selected-bots', value);
		commit('setSelectedBots', value);
	},
};

export const getters = {
	defaultView: state => state.defaultView,
	nicknames: state => state.nicknames,
	sentryInstalled: state => state.sentryInstalled,
	sentryReporting: state => state.sentryReporting,
	selectedBots: state => state.selectedBots
};
