import store from '../store';
import * as storage from '../utils/storage';

let defaultView = store.getters['settings/defaultView'];
if (defaultView === '_last-visited-page') defaultView = storage.get('last-visited-page', { name: 'home' });

export default [
	{
		path: '/',
		redirect: typeof defaultView === 'string' ? { name: defaultView } : defaultView
	},
	{
		path: '/page/home',
		name: 'home',
		async beforeEnter(to, from, next) {
			const setupComplete = storage.get('setup-complete', false);
			const steamOwnerID = await store.dispatch('asf/getSteamOwnerID');
			const botsDetected = await store.dispatch('bots/detectBots');
			if (!setupComplete && from.name !== 'welcome' && (steamOwnerID === '0' || !botsDetected)) return next({ name: 'welcome' });
			else if (from.name === 'welcome' && steamOwnerID === '0') return next({ name: 'global-config' });
			else if (from.name === 'welcome' && !botsDetected) return next({ name: 'bot-create' });
			else if (steamOwnerID !== '0' || botsDetected) {
				storage.set('setup-complete', true);
				next({ name: 'bots' });
			} else next({ name: 'bots' });
		}
	},
	{
		path: '/page/setup',
		name: 'setup',
		component: () => import('../views/Setup.vue'),
		meta: { noPasswordRequired: true }
	},
	{
		path: '/page/ui-configuration',
		name: 'ui-configuration',
		component: () => import('../views/UIConfiguration.vue')
	},
	{
		path: '/page/welcome',
		name: 'welcome',
		component: () => import('../views/Welcome.vue')
	},
	{
		path: '/page/bots',
		name: 'bots',
		component: () => import('../views/Bots.vue')
	},
	{
		path: '/page/releases',
		name: 'releases',
		component: () => import('../views/Releases.vue')
	},
	{
		path: '/page/plugins',
		name: 'plugins',
		component: () => import('../views/Plugins.vue')
	},
	{
		path: '/page/bot/new',
		name: 'bot-create',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotCreate.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot',
		name: 'bot',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/Bot.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot/config',
		name: 'bot-config',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotConfiguration.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot/bgr',
		name: 'bot-bgr',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotBGR.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot/2fa',
		name: 'bot-2fa',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/Bot2FA.vue')
		},
		meta: { modal: true }
  },
  {
		path: '/page/bot/:bot/input/:type',
		name: 'bot-input',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotInput.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot/delete',
		name: 'bot-delete',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotDelete.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot/copy',
		name: 'bot-copy',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotCopy.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot',
		redirect: { name: 'bots' }
	},
	{
		path: '/page/commands',
		name: 'commands',
		component: () => import('../views/Commands.vue')
	},
	{
		path: '/page/log',
		name: 'log',
		component: () => import('../views/Log.vue')
	},
	{
		path: '/page/config',
		name: 'global-config',
		component: () => import('../views/GlobalConfig.vue')
	},
	{
		path: '/page/mass-editor',
		name: 'mass-editor',
		component: () => import('../views/MassEditor.vue')
	},
	{
		path: '*',
		name: '404',
		redirect: { name: 'home' }
	}
];
