import * as storage from '../../utils/storage';

export const state = {
  smallNavigation: false,
  sideMenu: false,
  languageMenu: false,
  availableThemes: ['blue', 'red', 'teal', 'purple', 'green', 'orange'],
  boxed: false,
};

export const mutations = {
  setSmallNavigation: (state, value) => (state.smallNavigation = value),
  toggleNavigation: state => (state.smallNavigation = !state.smallNavigation),
  toggleSideMenu: state => (state.sideMenu = !state.sideMenu),
  toggleLanguageMenu: state => (state.languageMenu = !state.languageMenu),
  toggleBoxed: state => (state.boxed = !state.boxed),
  setBoxed: (state, value) => (state.boxed = value),
  setSideMenu: (state, value) => (state.sideMenu = value),
  setLanguageMenu: (state, value) => (state.languageMenu = value),
};

export const actions = {
  init: ({ commit }) => {
    const smallNavigation = storage.get('layout:small-navigation');
    if (typeof smallNavigation === 'boolean') commit('setSmallNavigation', smallNavigation);
    else if (window.innerWidth < 700) commit('setSmallNavigation', true);

    const boxed = storage.get('layout:boxed-layout');
    if (typeof boxed === 'boolean') commit('setBoxed', boxed);
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
  toggleBoxed: ({ commit, getters }) => {
    commit('toggleBoxed');
    storage.set('layout:boxed-layout', getters.boxed);
  },
  setSideMenu: ({ commit, value }) => {
    commit('setSideMenu', value);
  },
};

export const getters = {
  smallNavigation: state => state.smallNavigation,
  sideMenu: state => state.sideMenu,
  languageMenu: state => state.languageMenu,
  availableThemes: state => state.availableThemes,
  boxed: state => state.boxed,
};
