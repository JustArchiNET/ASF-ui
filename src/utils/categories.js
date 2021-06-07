import Vue from 'vue';

const asfCategories = [
  { name: Vue.i18n.translate('basic'), fields: ['SteamOwnerID'] },
  { name: Vue.i18n.translate('trade'), fields: ['MaxTradeHoldDuration'] },
  { name: Vue.i18n.translate('customization'), fields: ['AutoRestart', 'Blacklist', 'CommandPrefix', 'CurrentCulture', 'Statistics', 'SteamMessagePrefix'] },
  { name: Vue.i18n.translate('remote-access'), fields: ['Headless', 'IPC', 'IPCPassword', 'IPCPasswordFormat'] },
  { name: Vue.i18n.translate('connection'), fields: ['ConnectionTimeout', 'SteamProtocols', 'WebProxy', 'WebProxyPassword', 'WebProxyUsername'] },
  { name: Vue.i18n.translate('farming'), fields: ['FarmingDelay', 'IdleFarmingPeriod', 'MaxFarmingTime'] },
  { name: Vue.i18n.translate('performance'), fields: ['OptimizationMode', 'ConfirmationsLimiterDelay', 'GiftsLimiterDelay', 'InventoryLimiterDelay', 'LoginLimiterDelay', 'WebLimiterDelay'] },
  { name: Vue.i18n.translate('updates'), fields: ['UpdateChannel', 'UpdatePeriod'] },
  { name: Vue.i18n.translate('advanced'), fields: ['Debug'] },
];

const botCategories = [
  { name: Vue.i18n.translate('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'Paused', 'OnlineStatus', 'BotBehaviour'] },
  { name: Vue.i18n.translate('security'), fields: ['PasswordFormat', 'UseLoginKeys'] },
  { name: Vue.i18n.translate('access'), fields: ['SteamUserPermissions', 'SteamParentalCode'] },
  { name: Vue.i18n.translate('trade'), fields: ['SteamTradeToken', 'AcceptGifts', 'SendTradePeriod', 'SendOnFarmingFinished', 'CompleteTypesToSend', 'TradingPreferences', 'LootableTypes', 'TransferableTypes', 'MatchableTypes'] },
  { name: Vue.i18n.translate('farming'), fields: ['FarmingOrders', 'AutoSteamSaleEvent', 'FarmPriorityQueueOnly', 'FarmNonRefundableGamesOnly', 'FarmOffline', 'ShutdownOnFarmingFinished'] },
  { name: Vue.i18n.translate('customization'), fields: ['SteamMasterClanID', 'UserInterfaceMode', 'RedeemingPreferences', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
  { name: Vue.i18n.translate('performance'), fields: ['HoursUntilCardDrops'] },
];

export {
  asfCategories,
  botCategories,
};
