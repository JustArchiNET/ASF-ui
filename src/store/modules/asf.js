import * as humanizeDuration from 'humanize-duration';
import Vue from 'vue';
import * as http from '../../plugins/http';

const humanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  units: ['d', 'h', 'm', 's'],
  round: true,
  delimiter: ' ',
  languages: {
    shortEn: {
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
    },
  },
});

export const UPDATECHANNEL = {
  NONE: 0,
  STABLE: 1,
  EXPERIMENTAL: 2,
};

export const state = {
  memoryUsage: 0,
  startTime: null,
  buildVariant: null,
  version: null,
  uptime: '0s',
  updateChannel: 1,
  steamOwnerID: '0',
  headless: false,
};

export const mutations = {
  updateMemoryUsage: (state, memoryUsage) => (state.memoryUsage = memoryUsage),
  updateStartTime: (state, startTime) => (state.startTime = startTime),
  updateVersion: (state, version) => (state.version = version),
  updateBuildVariant: (state, buildVariant) => (state.buildVariant = buildVariant),
  updateBots: (state, bots) => (state.bots = bots),
  calculateUptime: state => {
    if (!state.startTime) return;

    const timeDiff = Date.now() - state.startTime.getTime();
    state.uptime = timeDiff > 0 ? humanizer(timeDiff) : Vue.i18n.translate('error');
  },
  updateUpdateChannel: (state, updateChannel) => (state.updateChannel = updateChannel),
  updateSteamOwnerID: (state, steamOwnerID) => (state.steamOwnerID = steamOwnerID),
  updateHeadless: (state, headless) => (state.headless = headless),
};

export const actions = {
  init: async ({ dispatch, commit }) => {
    setInterval(() => commit('calculateUptime'), 1000);
    setInterval(() => dispatch('update'), 60000);
  },
  onAuth: async ({ dispatch }) => {
    await dispatch('update');
  },
  update: async ({ commit, rootGetters }) => {
    if (!rootGetters['auth/authenticated']) return;

    try {
      const response = await http.get('asf');
      commit('updateMemoryUsage', response.MemoryUsage);
      commit('updateStartTime', new Date(response.ProcessStartTime));
      commit('updateVersion', response.Version);
      commit('updateBuildVariant', response.BuildVariant);
      commit('calculateUptime');
      commit('updateUpdateChannel', response.GlobalConfig.UpdateChannel);
      commit('updateSteamOwnerID', response.GlobalConfig.s_SteamOwnerID);
      commit('updateHeadless', response.GlobalConfig.Headless);
    } catch (err) {
      console.warn(err.message);
    }
  },
  getSteamOwnerID: async ({ dispatch, getters }) => {
    await dispatch('update');
    return getters.steamOwnerID;
  },
};

export const getters = {
  memory: state => `${(state.memoryUsage / 1024).toFixed(2)} MB`,
  uptime: state => state.uptime,
  version: state => state.version,
  buildVariant: state => state.buildVariant,
  startTime: state => state.startTime,
  updateChannel: state => state.updateChannel,
  steamOwnerID: state => state.steamOwnerID,
  headless: state => state.headless,
};
