// src/store/modules/favorites.js
const state = {
  favorites: JSON.parse(localStorage.getItem("favoriteBots") || "{}")
};

const getters = {
  isFavorite: state => botName => {
    return !!state.favorites[botName];
  },
  favoriteBots: (state, getters, rootState) => {
    return rootState.bots.bots.filter(bot => state.favorites[bot.name]);
  }
};

const actions = {
  addFavorite({ commit }, botName) {
    commit("ADD_FAVORITE", botName);
  },
  removeFavorite({ commit }, botName) {
    commit("REMOVE_FAVORITE", botName);
  },
  toggleFavorite({ commit, state }, botName) {
    if (state.favorites[botName]) {
      commit("REMOVE_FAVORITE", botName);
    } else {
      commit("ADD_FAVORITE", botName);
    }
  }
};

const mutations = {
  ADD_FAVORITE(state, botName) {
    state.favorites = { ...state.favorites, [botName]: true };
    localStorage.setItem("favoriteBots", JSON.stringify(state.favorites));
  },
  REMOVE_FAVORITE(state, botName) {
    const newFavorites = { ...state.favorites };
    delete newFavorites[botName];
    state.favorites = newFavorites;
    localStorage.setItem("favoriteBots", JSON.stringify(newFavorites));
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
