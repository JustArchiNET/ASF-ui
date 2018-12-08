import Vue from 'vue';

export const BotStatus = {
	DISABLED: 'disabled',
	OFFLINE: 'offline',
	ONLINE: 'online',
	FARMING: 'farming'
};

export class Bot {
	constructor(data) {
		this.name = data.BotName;
		this.nickname = data.Nickname;
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
		if (!this.active) return BotStatus.DISABLED;
		if (!this.isConnected) return BotStatus.OFFLINE;
		if (this.paused || this.timeRemaining === '00:00:00') return BotStatus.ONLINE;
		if (!this.currentGamesFarming.length) return BotStatus.ONLINE; // Farming module active, something is preventing the bot from farming though
		return BotStatus.FARMING;
	}

	get statusText() {
		const statusText = Vue.i18n.translate(`bot-status-${this.status}`);

		if (this.status === 'farming' && this.currentGamesFarming.length === 1) return `${statusText} - ${this.currentGamesFarming[0].GameName}`;
		if (this.status === 'farming' && this.currentGamesFarming.length > 1) return `${statusText} - ${Vue.i18n.translate('multiple-games')}`;

		return statusText;
	}

	get avatarURL() {
		return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/${this.avatarHash.substr(0, 2)}/${this.avatarHash}_full.jpg`;
	}

	get profileURL() {
		return `https://steamcommunity.com/profiles/${this.steamid}`;
	}

	get cardsRemaining() {
		return this.gamesToFarm.reduce((cardsRemaining, game) => cardsRemaining + game.CardsRemaining, 0);
	}

	get timeRemainingSeconds() {
		return this.timeRemaining
			.split(':')
			.reverse()
			.map((value, index) => value * 60 ** index)
			.reduce((sum, value) => sum + value, 0);
	}

	get games() {
		const currentlyFarming = this.currentGamesFarming.map(game => game.AppID);

		return this.gamesToFarm.map(game => ({
			...game,
			farming: currentlyFarming.includes(game.AppID)
		})).sort((lhs, rhs) => rhs.farming - lhs.farming);
	}

	isVisible(hideFlags) {
		if (this.status === BotStatus.DISABLED && hideFlags & 1 << 0) return false;
		if (this.status === BotStatus.OFFLINE && hideFlags & 1 << 1) return false;
		if (this.status === BotStatus.ONLINE && hideFlags & 1 << 2) return false;
		if (this.status === BotStatus.FARMING && hideFlags & 1 << 3) return false;
		return true;
	}
}
