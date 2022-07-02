import Vue from 'vue';

const asfCategories = [
  { name: Vue.i18n.translate('basic'), fields: ['SteamOwnerID'] },
  { name: Vue.i18n.translate('trade'), fields: ['MaxTradeHoldDuration'] },
  { name: Vue.i18n.translate('customization'), fields: ['AutoRestart', 'Blacklist', 'CommandPrefix', 'CurrentCulture', 'SteamMessagePrefix'] },
  { name: Vue.i18n.translate('remote-access'), fields: ['Headless', 'IPC', 'IPCPassword', 'IPCPasswordFormat'] },
  { name: Vue.i18n.translate('connection'), fields: ['ConnectionTimeout', 'SteamProtocols', 'WebProxy', 'WebProxyPassword', 'WebProxyUsername'] },
  { name: Vue.i18n.translate('farming'), fields: ['FarmingDelay', 'IdleFarmingPeriod', 'MaxFarmingTime', 'MinFarmingDelayAfterBlock'] },
  { name: Vue.i18n.translate('performance'), fields: ['OptimizationMode', 'ConfirmationsLimiterDelay', 'GiftsLimiterDelay', 'InventoryLimiterDelay', 'LoginLimiterDelay', 'WebLimiterDelay'] },
  { name: Vue.i18n.translate('updates'), fields: ['UpdateChannel', 'UpdatePeriod'] },
  { name: Vue.i18n.translate('advanced'), fields: ['Debug'] },
];

const botCategories = [
  { name: Vue.i18n.translate('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'Paused', 'OnlineStatus', 'BotBehaviour'] },
  { name: Vue.i18n.translate('security'), fields: ['PasswordFormat', 'UseLoginKeys'] },
  { name: Vue.i18n.translate('access'), fields: ['SteamUserPermissions', 'SteamParentalCode'] },
  { name: Vue.i18n.translate('trade'), fields: ['SteamTradeToken', 'AcceptGifts', 'SendTradePeriod', 'SendOnFarmingFinished', 'CompleteTypesToSend', 'TradingPreferences', 'LootableTypes', 'TransferableTypes', 'MatchableTypes'] },
  { name: Vue.i18n.translate('farming'), fields: ['FarmingOrders', 'AutoSteamSaleEvent', 'FarmPriorityQueueOnly', 'SkipRefundableGames', 'FarmOffline', 'ShutdownOnFarmingFinished'] },
  { name: Vue.i18n.translate('customization'), fields: ['RemoteCommunication', 'SteamMasterClanID', 'UserInterfaceMode', 'OnlineFlags', 'RedeemingPreferences', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
  { name: Vue.i18n.translate('performance'), fields: ['HoursUntilCardDrops'] },
];

const newBotCategories = [
  { name: Vue.i18n.translate('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword'] },
];

const uiCategories = [
  { name: Vue.i18n.translate('general'), fields: [Vue.i18n.translate('default-page'), Vue.i18n.translate('notification-position'), Vue.i18n.translate('notify-release'), Vue.i18n.translate('display-categories'), Vue.i18n.translate('tooltip-delay')] },
  { name: Vue.i18n.translate('bots'), fields: [Vue.i18n.translate('bot-nicknames'), Vue.i18n.translate('bot-game-name'), Vue.i18n.translate('bot-order-disabled'), Vue.i18n.translate('bot-fav-buttons')] },
  { name: Vue.i18n.translate('commands'), fields: [Vue.i18n.translate('timestamps')] },
];

export {
  asfCategories,
  botCategories,
  newBotCategories,
  uiCategories,
};
