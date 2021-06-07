import Vue from 'vue';

const botCategories = [
  { name: Vue.i18n.translate('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'Paused', 'OnlineStatus', 'BotBehaviour'] },
  { name: Vue.i18n.translate('security'), fields: ['PasswordFormat', 'UseLoginKeys'] },
  { name: Vue.i18n.translate('access'), fields: ['SteamUserPermissions', 'SteamParentalCode'] },
  { name: Vue.i18n.translate('trade'), fields: ['SteamTradeToken', 'AcceptGifts', 'SendTradePeriod', 'SendOnFarmingFinished', 'CompleteTypesToSend', 'TradingPreferences', 'LootableTypes', 'TransferableTypes', 'MatchableTypes'] },
  { name: Vue.i18n.translate('farming'), fields: ['FarmingOrders', 'AutoSteamSaleEvent', 'FarmPriorityQueueOnly', 'FarmNonRefundableGamesOnly', 'FarmOffline', 'ShutdownOnFarmingFinished'] },
  { name: Vue.i18n.translate('customization'), fields: ['SteamMasterClanID', 'UserInterfaceMode', 'RedeemingPreferences', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
  { name: Vue.i18n.translate('performance'), fields: ['HoursUntilCardDrops'] },
];

export default botCategories;
