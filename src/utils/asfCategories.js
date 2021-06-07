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

export default asfCategories;
