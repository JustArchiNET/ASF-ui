import * as storage from '../../utils/storage';

export const state = {
  defaultView: 'bots',
  notificationPosition: 'rightBottom',
  notifyRelease: true,
  nicknames: false,
  gameName: false,
  favButtons: 0,
  displayCategories: true,
  selectedBots: [],
  timestamps: false,
  tooltipDelay: 0,
  orderDisabledBotsLast: false,
  previousAmount: 10,
  logInformation: 13,
  logTimestamp: 'timeOnlyEu',
};

export const mutations = {
  setDefaultView: (state, defaultView) => (state.defaultView = defaultView),
  setNotificationPosition: (state, notificationPosition) => (state.notificationPosition = notificationPosition),
  setNotifyRelease: (state, notifyRelease) => (state.notifyRelease = notifyRelease),
  setNicknames: (state, nicknames) => (state.nicknames = nicknames),
  setGameName: (state, gameName) => (state.gameName = gameName),
  setFavButtons: (state, favButtons) => (state.favButtons = favButtons),
  setDisplayCategories: (state, displayCategories) => (state.displayCategories = displayCategories),
  setSelectedBots: (state, selectedBots) => (state.selectedBots = selectedBots),
  setTimestamps: (state, timestamps) => (state.timestamps = timestamps),
  setTooltipDelay: (state, delay) => (state.tooltipDelay = delay),
  setOrderDisabledBotsLast: (state, orderDisabledBotsLast) => (state.orderDisabledBotsLast = orderDisabledBotsLast),
  setPreviousAmount: (state, previousAmount) => (state.previousAmount = previousAmount),
  setLogInformation: (state, logInformation) => (state.logInformation = logInformation),
  setLogTimestamp: (state, logTimestamp) => (state.logTimestamp = logTimestamp),
};

export const actions = {
  init({ commit }) {
    commit('setDefaultView', storage.get('settings:default-view', 'bots'));
    commit('setNotificationPosition', storage.get('settings:notification-position', 'rightBottom'));
    commit('setNotifyRelease', storage.get('settings:notify-release', true));
    commit('setNicknames', storage.get('settings:nicknames', false));
    commit('setGameName', storage.get('settings:game-name', false));
    commit('setFavButtons', storage.get('settings:fav-buttons', 0));
    commit('setDisplayCategories', storage.get('settings:display-categories', true));
    commit('setSelectedBots', storage.get('settings:selected-bots', []));
    commit('setTimestamps', storage.get('settings:timestamps', false));
    commit('setTooltipDelay', storage.get('settings:tooltip-delay', 0));
    commit('setOrderDisabledBotsLast', storage.get('settings:orderDisabledBotsLast', false));
    commit('setPreviousAmount', storage.get('settings:previousAmount', 10));
    commit('setLogInformation', storage.get('settings:logInformation', 13));
    commit('setLogTimestamp', storage.get('settings:logTimestamp', 'timeOnlyEu'));
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
  setSelectedBots({ commit }, value) {
    storage.set('settings:selected-bots', value);
    commit('setSelectedBots', value);
  },
  setTimestamps({ commit }, value) {
    storage.set('settings:timestamps', value);
    commit('setTimestamps', value);
  },
  setTooltipDelay({ commit }, value) {
    storage.set('settings:tooltip-delay', value);
    commit('setTooltipDelay', value);
  },
  setOrderDisabledBotsLast({ commit }, value) {
    storage.set('settings:orderDisabledBotsLast', value);
    commit('setOrderDisabledBotsLast', value);
  },
  setPreviousAmount({ commit }, value) {
    storage.set('settings:previousAmount', value);
    commit('setPreviousAmount', value);
  },
  setLogInformation({ commit }, value) {
    storage.set('settings:logInformation', value);
    commit('setLogInformation', value);
  },
  setLogTimestamp({ commit }, value) {
    storage.set('settings:logTimestamp', value);
    commit('setLogTimestamp', value);
  },
};

export const getters = {
  defaultView: state => state.defaultView,
  notificationPosition: state => state.notificationPosition,
  notifyRelease: state => state.notifyRelease,
  nicknames: state => state.nicknames,
  gameName: state => state.gameName,
  favButtons: state => state.favButtons,
  displayCategories: state => state.displayCategories,
  selectedBots: state => state.selectedBots,
  timestamps: state => state.timestamps,
  tooltipDelay: state => state.tooltipDelay,
  orderDisabledBotsLast: state => state.orderDisabledBotsLast,
  previousAmount: state => state.previousAmount,
  logInformation: state => state.logInformation,
  logTimestamp: state => state.logTimestamp,
};
