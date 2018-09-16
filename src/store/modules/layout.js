export const state = {
  smallNavigation: false,
  sideMenu: false,
  theme: 'red',
  availableThemes: ['blue', 'red', 'teal', 'purple', 'green'],
  boxed: false,
  darkMode: false
};

export const mutations = {
  setSmallNavigation: (state, value) => state.smallNavigation = value,
  toggleNavigation: state => state.smallNavigation = !state.smallNavigation,
  changeTheme: (state, theme) => state.theme = theme,
  toggleSideMenu: state => state.sideMenu = !state.sideMenu,
  toggleBoxed: state => state.boxed = !state.boxed,
  setBoxed: (state, value) => state.boxed = value,
  toggleDarkMode: state => state.darkMode = !state.darkMode,
  setDarkMode: (state, value) => state.darkMode = value
};

export const actions = {
  init: ({ commit }) => {
    const smallNavigation = localStorage.getItem('small-navigation');
    if (smallNavigation) commit('setSmallNavigation', JSON.parse(smallNavigation));

    const theme = localStorage.getItem('theme');
    if (theme) commit('changeTheme', theme);

    const boxed = localStorage.getItem('boxed-layout');
    if (theme) commit('setBoxed', JSON.parse(boxed));

    const darkMode = localStorage.getItem('dark-mode');
    if (theme) commit('setDarkMode', JSON.parse(darkMode));
  },
  toggleNavigation: ({ commit, getters }) => {
    commit('toggleNavigation');
    localStorage.setItem('small-navigation', JSON.parse(getters.smallNavigation));
  },
  toggleSideMenu: ({ commit }) => {
    commit('toggleSideMenu');
  },
  changeTheme: ({ commit }, theme) => {
    commit('changeTheme', theme);
    localStorage.setItem('theme', theme);
  },
  toggleBoxed: ({ commit, getters }) => {
    commit('toggleBoxed');
    localStorage.setItem('boxed-layout', JSON.parse(getters.boxed));
  },
  toggleDarkMode: ({ commit, getters }) => {
    commit('toggleDarkMode');
    localStorage.setItem('dark-mode', JSON.parse(getters.darkMode));
  }
};

export const getters = {
  smallNavigation: state => state.smallNavigation,
  sideMenu: state => state.sideMenu,
  theme: state => state.theme,
  availableThemes: state => state.availableThemes,
  boxed: state => state.boxed,
  darkMode: state => state.darkMode
};