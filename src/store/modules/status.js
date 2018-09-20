import { get } from '../../utils/http';

class Bot {
	constructor(data) {
		this.name = data.BotName;
		this.steamid = data.s_SteamID;
		this.avatarHash = data.AvatarHash || '0b46945851b3d26da93a6ddba3ac961206cc191d';

		this.flags = data.AccountFlags;
		this.isPlayingPossible = data.IsPlayingPossible;
		this.active = data.KeepRunning;
		this.config = data.BotConfig;

		this.paused = data.CardsFarmer.Paused;
		this.gamesToFarm = data.CardsFarmer.GamesToFarm;
		this.timeRemaining = data.CardsFarmer.TimeRemaining;
		this.currentGamesFarming = data.CardsFarmer.CurrentGamesFarming;
	}

	get status() {
		if (!this.active) return 'disabled';
		if (this.steamid === '0') return 'offline';
		if (this.timeRemaining === '00:00:00') return 'online';
		return 'farming';
	}

	get avatarURL() {
		return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/${this.avatarHash.substr(0, 2)}/${this.avatarHash}_full.jpg`;
	}
}

export const state = {
	memoryUsage: 0,
	startTime: null,
	buildVariant: null,
	version: { Major: 0, Minor: 0, Build: 0, Revision: 0 },
	uptime: '00m 00s',
	bots: []
};

export const mutations = {
	updateMemoryUsage: (state, memoryUsage) => state.memoryUsage = memoryUsage,
	updateStartTime: (state, startTime) => state.startTime = startTime,
	updateVersion: (state, version) => state.version = version,
	updateBuildVariant: (state, buildVariant) => state.buildVariant = buildVariant,
	updateBots: (state, bots) => state.bots = bots,
	calculateUptime: (state) => {
		if (!state.startTime) return;

		const difference = (Date.now() - state.startTime.getTime()) / 1000;

		const seconds = Math.floor(difference % 60);
		const minutes = Math.floor(difference / 60 % 60);
		const hours = Math.floor(difference / (60 * 60) % 24);
		const days = Math.floor(difference / (24 * 60 * 60));

		state.uptime = `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${(minutes + 'm ').padStart(4, '0')}${(seconds + 's').padStart(3, '0')}`;
	}
};

export const actions = {
	init: async ({ dispatch, commit }) => {
		setInterval(() => commit('calculateUptime'), 1000);
		setInterval(() => dispatch('updateASF'), 60000);
		setInterval(() => dispatch('updateBots'), 5000);
	},
	onAuth: async ({ dispatch }) => {
		await dispatch('update');
	},
	update: async ({ dispatch, rootGetters }) => {
		if (!rootGetters['auth/validPassword']) return;

		dispatch('updateASF');
		dispatch('updateBots');
	},
	updateASF: async ({ commit, rootGetters }) => {
		if (!rootGetters['auth/validPassword']) return;

		try {
			const response = await get('ASF');
			commit('updateMemoryUsage', response.MemoryUsage);
			commit('updateStartTime', new Date(response.ProcessStartTime));
			commit('updateVersion', response.Version);
			commit('updateBuildVariant', response.BuildVariant);
			commit('calculateUptime');
		} catch (err) {}

	},
	updateBots: async ({ commit, rootGetters }) => {
		if (!rootGetters['auth/validPassword']) return;

		try {
			const response = await get('Bot/ASF');
			commit('updateBots', response.map(data => new Bot(data)));
		} catch (err) {}
	}
};

export const getters = {
	memory: state => `${(state.memoryUsage / 1024).toFixed(2)} MB`,
	uptime: state => state.uptime,
	version: state => `${state.version.Major}.${state.version.Minor}.${state.version.Build}.${state.version.Revision}`,
	buildVariant: state => state.buildVariant,
	bots: state => state.bots,
	botsStatus: state => status => state.bots.filter(bot => bot.status === status),
	botsCount: (state, getters) => status => getters.botsStatus(status).length
};
