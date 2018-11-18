import * as http from '../../plugins/http';
import { Bot } from '../../models/Bot';

export const state = {
	bots: {}
};

export const mutations = {
	setBots: (state, bots) => state.bots = bots,
	setBot: (state, bot) => state.bots[bot.name] = bot,
	updateBot: (state, { name, ...changes }) => {
		if (!state.bots[name]) return;
		for (const key of Object.keys(changes)) {
			state.bots[name][key] = changes[key];
		}
	}
};

export const actions = {
	init: async ({ dispatch }) => {
		setInterval(() => dispatch('updateBots'), 2500);
	},
	onAuth: async ({ dispatch }) => {
		dispatch('updateBots');
	},
	updateBots: async ({ commit, rootGetters }) => {
		if (!rootGetters['auth/authenticated']) return;

		try {
			const response = await http.get('bot/ASF');
			commit('setBots', Object.values(response).map(data => new Bot(data)).reduce((bots, bot) => (bots[bot.name] = bot, bots), {}));
		} catch (err) {}
	},
	async updateBot({ commit }, bot) {
		commit('updateBot', bot);

		try {
			const [response] = await http.get(`bot/${bot.name}`);
			commit('setBot', new Bot(response[bot.name]));
		} catch (err) {}
	}
};

export const getters = {
	bots: state => Object.values(state.bots),
	bot: state => name => state.bots[name],
	status: (state, getters) => status => getters.bots.filter(bot => bot.status === status),
	count: (state, getters) => status => getters.status(status).length,
	gamesRemaining: (state, getters) => getters.bots.reduce((gamesRemaining, bot) => gamesRemaining + bot.gamesToFarm.length, 0),
	timeRemaining: (state, getters) => Math.max(...getters.bots.map(bot => bot.timeRemainingSeconds)),
	cardsRemaining: (state, getters) => getters.bots.reduce((cardsRemaining, bot) => cardsRemaining + bot.cardsRemaining, 0)
};
