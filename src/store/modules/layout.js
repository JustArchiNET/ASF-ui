import * as storage from '../../utils/storage';

export const state = {
  smallNavigation: false,
  sideMenu: false,
  languageMenu: false,
  theme: 'blue',
  availableThemes: ['blue', 'red', 'teal', 'purple', 'green', 'orange'],
  boxed: false,
  darkMode: false,
};

export const mutations = {
  setSmallNavigation: (state, value) => (state.smallNavigation = value),
  toggleNavigation: state => (state.smallNavigation = !state.smallNavigation),
  changeTheme: (state, theme) => (state.theme = theme),
  toggleSideMenu: state => (state.sideMenu = !state.sideMenu),
  toggleLanguageMenu: state => (state.languageMenu = !state.languageMenu),
  toggleBoxed: state => (state.boxed = !state.boxed),
  setBoxed: (state, value) => (state.boxed = value),
  toggleDarkMode: state => (state.darkMode = !state.darkMode),
  setDarkMode: (state, value) => (state.darkMode = value),
  setSideMenu: (state, value) => (state.sideMenu = value),
  setLanguageMenu: (state, value) => (state.languageMenu = value),
};

export const actions = {
  init: ({ commit }) => {
    const smallNavigation = storage.get('layout:small-navigation');
    if (typeof smallNavigation === 'boolean') commit('setSmallNavigation', smallNavigation);
    else if (window.innerWidth < 700) commit('setSmallNavigation', true);

    const theme = storage.get('layout:theme');
    if (theme) commit('changeTheme', theme);

    const boxed = storage.get('layout:boxed-layout');
    if (typeof boxed === 'boolean') commit('setBoxed', boxed);

    const darkMode = storage.get('layout:dark-mode');
    if (typeof darkMode === 'boolean') commit('setDarkMode', darkMode);
  },
  toggleNavigation: ({ commit, getters }) => {
    commit('toggleNavigation');
    storage.set('layout:small-navigation', getters.smallNavigation);
  },
  toggleSideMenu: ({ commit, getters }) => {
    if (getters.languageMenu) commit('setLanguageMenu', false);
    commit('toggleSideMenu');
  },
  toggleLanguageMenu: ({ commit, getters }) => {
    if (getters.sideMenu) commit('setSideMenu', false);
    commit('toggleLanguageMenu');
  },
  changeTheme: ({ commit }, theme) => {
    commit('changeTheme', theme);
    storage.set('layout:theme', theme);
  },
  toggleBoxed: ({ commit, getters }) => {
    commit('toggleBoxed');
    storage.set('layout:boxed-layout', getters.boxed);
  },
  toggleDarkMode: ({ commit, getters }) => {
    commit('toggleDarkMode');
    storage.set('layout:dark-mode', getters.darkMode);
  },
  setSideMenu: ({ commit, value }) => {
    commit('setSideMenu', value);
  },
};

export const getters = {
  smallNavigation: state => state.smallNavigation,
  sideMenu: state => state.sideMenu,
  languageMenu: state => state.languageMenu,
  theme: state => state.theme,
  availableThemes: state => state.availableThemes,
  boxed: state => state.boxed,
  darkMode: state => state.darkMode,
};
