export const state = {
  smallNavigation: false,
  theme: 'red'
};

export const mutations = {
  setSmallNavigation: (state, value) => state.smallNavigation = value,
  toggleNavigation: state => state.smallNavigation = !state.smallNavigation,
  changeTheme: (state, theme) => state.theme = theme
};

export const actions = {
  init: ({ commit }) => {
    const smallNavigation = localStorage.getItem('small-navigation');
    if (smallNavigation) commit('setSmallNavigation', JSON.parse(smallNavigation));

    const theme = localStorage.getItem('theme');
    if (theme) commit('changeTheme', theme);
  },
  toggleNavigation: ({ commit, getters }) => {
    commit('toggleNavigation');
    localStorage.setItem('small-navigation', JSON.parse(getters.smallNavigation));
  }
};

export const getters = {
  smallNavigation: state => state.smallNavigation,
  theme: state => state.theme
};