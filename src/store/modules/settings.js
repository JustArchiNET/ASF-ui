import * as storage from '../../utils/storage';

export const state = {
	defaultView: 'home',
	notificationPosition: 'rightBottom',
	notifyRelease: 'false',
	nicknames: false,
	gameName: false,
	favButtons: 0,
	displayCategories: true,
	sentryInstalled: false,
	sentryReporting: false,
	selectedBots: []
};

export const mutations = {
	setDefaultView: (state, defaultView) => state.defaultView = defaultView,
	setNotificationPosition: (state, notificationPosition) => state.notificationPosition = notificationPosition,
	setNotifyRelease: (state, notifyRelease) => state.notifyRelease = notifyRelease,
	setNicknames: (state, nicknames) => state.nicknames = nicknames,
	setGameName: (state, gameName) => state.gameName = gameName,
	setFavButtons: (state, favButtons) => state.favButtons = favButtons,
	setDisplayCategories: (state, displayCategories) => state.displayCategories = displayCategories,
	setSentryInstalled: (state, sentryInstalled) => state.sentryInstalled = sentryInstalled,
	setSentryReporting: (state, sentryReporting) => state.sentryReporting = sentryReporting,
	setSelectedBots: (state, selectedBots) => state.selectedBots = selectedBots
};

export const actions = {
	init({ commit }) {
		commit('setDefaultView', storage.get('settings:default-view', 'home'));
		commit('setNotificationPosition', storage.get('settings:notification-position', 'rightBottom'));
		commit('setNotifyRelease', storage.get('settings:notify-release', false));
		commit('setNicknames', storage.get('settings:nicknames', false));
		commit('setGameName', storage.get('settings:game-name', false));
		commit('setFavButtons', storage.get('settings:fav-buttons', 0));
		commit('setDisplayCategories', storage.get('settings:display-categories', true));
		commit('setSentryInstalled', storage.get('settings:sentry-installed', false));
		commit('setSentryReporting', storage.get('settings:sentry-reporting', false));
		commit('setSelectedBots', storage.get('settings:selected-bots', []));
	},
	setDefaultView({ commit }, value) {
		storage.set('settings:default-view', value);
		commit('setDefaultView', value);
	},
	setNotificationPosition({ commit }, value) {
		storage.set('settings:notification-position', value);
		commit('setNotificationPosition', value);
	},
	setNotifyRelease({ commit }, value) {
		storage.set('settings:notify-release', value);
		commit('setNotifyRelease', value);
	},
	setNicknames({ commit }, value) {
		storage.set('settings:nicknames', value);
		commit('setNicknames', value);
	},
	setGameName({ commit }, value) {
		storage.set('settings:game-name', value);
		commit('setGameName', value);
	},
	setFavButtons({ commit }, value) {
		storage.set('settings:fav-buttons', value);
		commit('setFavButtons', value);
	},
	setDisplayCategories({ commit }, value) {
		storage.set('settings:display-categories', value);
		commit('setDisplayCategories', value);
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
	}
};

export const getters = {
	defaultView: state => state.defaultView,
	notificationPosition: state => state.notificationPosition,
	notifyRelease: state => state.notifyRelease,
	nicknames: state => state.nicknames,
	gameName: state => state.gameName,
	favButtons: state => state.favButtons,
	displayCategories: state => state.displayCategories,
	sentryInstalled: state => state.sentryInstalled,
	sentryReporting: state => state.sentryReporting,
	selectedBots: state => state.selectedBots
};
