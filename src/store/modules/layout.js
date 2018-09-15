export const state = {
  smallNavigation: false
};

export const mutations = {
  setSmallNavigation: (state, value) => state.smallNavigation = value,
  toggleNavigation: state => state.smallNavigation = !state.smallNavigation
};

export const actions = {
  init: ({ commit }) => {
    const smallNavigation = localStorage.getItem('small-navigation');
    if (smallNavigation) commit('setSmallNavigation', JSON.parse(smallNavigation));
  },
  toggleNavigation: ({ commit, getters }) => {
    commit('toggleNavigation');
    localStorage.setItem('small-navigation', JSON.parse(getters.smallNavigation));
  }
};

export const getters = {
  smallNavigation: state => state.smallNavigation
};