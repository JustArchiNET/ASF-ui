import Vue from 'vue';

const timeSpanRegex = /(?:(\d+).)?(\d{2}):(\d{2}):(\d{2})(?:.?(\d{7}))?/;

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
		const [, days, hours, minutes, seconds] = timeSpanRegex.exec(this.timeRemaining);

		let time = 0;

		if (days) time += parseInt(days, 10) * 24 * 60 * 60;
		if (hours) time += parseInt(hours, 10) * 60 * 60;
		if (minutes) time += parseInt(minutes, 10) * 60;
		if (seconds) time += parseInt(seconds, 10);

		return time;
	}

	get games() {
		const currentlyFarming = this.currentGamesFarming.map(game => game.AppID);

		return this.gamesToFarm.map(game => ({
			...game,
			farming: currentlyFarming.includes(game.AppID)
		})).sort((lhs, rhs) => rhs.farming - lhs.farming);
	}

	isVisible(selectedBots) {
		let visible = false;
		if (selectedBots.length === 0) visible = true;
		if (this.status === BotStatus.DISABLED && selectedBots.includes('disabled')) visible = true;
		if (this.status === BotStatus.OFFLINE && selectedBots.includes('offline')) visible = true;
		if (this.status === BotStatus.ONLINE && selectedBots.includes('online')) visible = true;
		if (this.status === BotStatus.FARMING && selectedBots.includes('farming')) visible = true;
		return visible;
	}
}
