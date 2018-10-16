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
		this.isConnected = data.IsConnectedAndLoggedOn;

		this.paused = data.CardsFarmer.Paused;
		this.gamesToFarm = data.CardsFarmer.GamesToFarm;
		this.timeRemaining = data.CardsFarmer.TimeRemaining;
		this.currentGamesFarming = data.CardsFarmer.CurrentGamesFarming;
	}

	get status() {
		if (!this.active) return 'disabled';
		if (!this.isConnected) return 'offline';
		if (this.paused || this.timeRemaining === '00:00:00') return 'online';
		return 'farming';
	}

	get statusText() {
		switch (this.status) {
			case 'disabled':
				return 'Disabled';
			case 'offline':
				return 'Offline';
			case 'online':
				return this.timeRemaining === '00:00:00' ? 'Online' : 'Paused';
			case 'farming':
				return `Farming${this.currentGamesFarming.length ? ' - ' + this.currentGamesFarming.map(game => game.GameName).join() : ''}`;
		}
	}

	get avatarURL() {
		return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/${this.avatarHash.substr(0, 2)}/${this.avatarHash}_full.jpg`;
	}

	get profileURL() {
		return `https://steamcommunity.com/profiles/${this.steamid}`;
	}
}

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
		if (!rootGetters['auth/validPassword']) return;

		try {
			const response = await get('bot/ASF');
			commit('setBots', Object.values(response).map(data => new Bot(data)).reduce((bots, bot) => (bots[bot.name] = bot, bots), {}));
		} catch (err) {}
	},
	async updateBot({ commit }, bot) {
		commit('updateBot', bot);

		try {
			const [response] = await get(`bot/${bot.name}`);
			commit('setBot', new Bot(response[bot.name]));
		} catch (err) {}
	}
};

export const getters = {
	bots: state => Object.values(state.bots),
	bot: state => name => state.bots[name],
	status: (state, getters) => status => getters.bots.filter(bot => bot.status === status),
	count: (state, getters) => status => getters.status(status).length
};
