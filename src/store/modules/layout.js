export const state = {
  smallNavigation: false
};

export const mutations = {
  toggleNavigation: state => state.smallNavigation = !state.smallNavigation
};

export const getters = {
  smallNavigation: state => state.smallNavigation
};