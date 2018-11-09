import * as http from '../../plugins/http';
import { timeDifference } from '../../utils/timeDifference';

export const state = {
	memoryUsage: 0,
	startTime: null,
	buildVariant: null,
	version: { Major: 0, Minor: 0, Build: 0, Revision: 0 },
	uptime: '00m 00s'
};

export const mutations = {
	updateMemoryUsage: (state, memoryUsage) => state.memoryUsage = memoryUsage,
	updateStartTime: (state, startTime) => state.startTime = startTime,
	updateVersion: (state, version) => state.version = version,
	updateBuildVariant: (state, buildVariant) => state.buildVariant = buildVariant,
	updateBots: (state, bots) => state.bots = bots,
	calculateUptime: (state) => {
		if (!state.startTime) return;

		const timeDiff = Date.now() - state.startTime.getTime();
		if (timeDiff < 0) {
			state.uptime = 'Error';
			return;
		}

		const uptime = timeDifference(state.startTime.getTime(), Date.now());

		let uptimeString = uptime.days > 0 ? uptime.days + 'd ' : '';
		uptimeString += uptime.hours > 0 ? uptime.hours + 'h ' : '';
		uptimeString += (uptime.minutes + 'm ').padStart(4, '0');
		uptimeString += (uptime.seconds + 's').padStart(3, '0');

		state.uptime = uptimeString;
	}
};

export const actions = {
	init: async ({ dispatch, commit }) => {
		setInterval(() => commit('calculateUptime'), 1000);
		setInterval(() => dispatch('updateASF'), 60000);
	},
	onAuth: async ({ dispatch }) => {
		await dispatch('updateASF');
	},
	updateASF: async ({ commit, rootGetters }) => {
		if (!rootGetters['auth/authenticated']) return;

		try {
			const response = await http.get('ASF');
			commit('updateMemoryUsage', response.MemoryUsage);
			commit('updateStartTime', new Date(response.ProcessStartTime));
			commit('updateVersion', response.Version);
			commit('updateBuildVariant', response.BuildVariant);
			commit('calculateUptime');
		} catch (err) {}
	}
};

export const getters = {
	memory: state => `${(state.memoryUsage / 1024).toFixed(2)} MB`,
	uptime: state => state.uptime,
	version: state => `${state.version.Major}.${state.version.Minor}.${state.version.Build}.${state.version.Revision}`,
	buildVariant: state => state.buildVariant,
	startTime: state => state.startTime
};
