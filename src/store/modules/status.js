import { get } from '../../utils/http';

export const state = {
  memoryUsage: 0,
  startTime: null,
  buildVariant: null,
  version: { Major: 0, Minor: 0, Build: 0, Revision: 0 },
  uptime: '0s'
};

export const mutations = {
  updateMemoryUsage: (state, memoryUsage) => state.memoryUsage = memoryUsage,
  updateStartTime: (state, startTime) => state.startTime = startTime,
  updateVersion: (state, version) => state.version = version,
  updateBuildVariant: (state, buildVariant) => state.buildVariant = buildVariant,
  calculateUptime: (state) => {
    if (!state.startTime) return;

    const difference = (Date.now() - state.startTime.getTime()) / 1000;

    const seconds = Math.floor(difference % 60);
    const minutes = Math.floor(difference / 60 % 60);
    const hours = Math.floor(difference / (60 * 60) % 24);
    const days = Math.floor(difference / (24 * 60 * 60));

    state.uptime = `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes + 'm '}${seconds + 's'}`;
  }
};

export const actions = {
  init: async ({ dispatch, commit }) => {
    await dispatch('update');
    setInterval(() => commit('calculateUptime'), 1000);
    setInterval(() => dispatch('update'), 60000);
  },
  update: async ({ commit }) => {
    const response = await get('ASF');
    commit('updateMemoryUsage', response.MemoryUsage);
    commit('updateStartTime', new Date(response.ProcessStartTime));
    commit('updateVersion', response.Version);
    commit('updateBuildVariant', response.BuildVariant);
  }
};

export const getters = {
  memory: state => `${(state.memoryUsage / 1024).toFixed(2)}MB`,
  uptime: state => state.uptime,
  version: state => `${state.version.Major}.${state.version.Minor}.${state.version.Build}.${state.version.Revision}`,
  buildVariant: state => state.buildVariant
};