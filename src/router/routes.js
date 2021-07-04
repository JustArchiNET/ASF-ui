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
		path: '/home',
		name: 'home',
		async beforeEnter(to, from, next) {
			const setupComplete = storage.get('setup-complete', false);

			const steamOwnerID = await store.dispatch('asf/getSteamOwnerID');
			const botsDetected = await store.dispatch('bots/detectBots');

      if (!setupComplete && from.name !== 'welcome' && (steamOwnerID === '0' || !botsDetected)) {
        return next({ name: 'welcome' });
      } else if (from.name === 'welcome' && steamOwnerID === '0') {
        return next({ name: 'asf-config' });
      } else if (from.name === 'welcome' && !botsDetected) {
        return next({ name: 'bot-create' });
      } else if (steamOwnerID !== '0' || botsDetected) {
        storage.set('setup-complete', true);
        let defaultView = store.getters['settings/defaultView'];
        if (defaultView === '_last-visited-page') defaultView = storage.get('last-visited-page', { name: 'bots' });
        const page = (typeof defaultView === 'string') ? { name: defaultView } : defaultView;
        return next(page);
      }

      return next({ name: 'bots' });
		}
	},
	{
		path: '/setup',
		name: 'setup',
		component: () => import('../views/Setup.vue'),
		meta: { noPasswordRequired: true },
    params: {
      restart: false,
      update: false,
    }
	},
	{
		path: '/ui-config',
		name: 'ui-config',
		component: () => import('../views/UIConfig.vue')
	},
	{
		path: '/welcome',
		name: 'welcome',
		component: () => import('../views/Welcome.vue')
	},
	{
		path: '/bots',
		name: 'bots',
		component: () => import('../views/Bots.vue')
	},
	{
		path: '/releases',
		name: 'releases',
		component: () => import('../views/Releases.vue')
	},
	{
		path: '/plugins',
		name: 'plugins',
		component: () => import('../views/Plugins.vue')
	},
	{
		path: '/bot/new',
		name: 'bot-create',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotCreate.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/bot/:bot',
		name: 'bot',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/Bot.vue')
		},
		meta: { modal: true, arrows: true }
	},
	{
		path: '/bot/:bot/config',
		name: 'bot-config',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotConfig.vue')
		},
		meta: { modal: true, arrows: true }
	},
	{
		path: '/bot/:bot/bgr',
		name: 'bot-bgr',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotBGR.vue')
		},
		meta: { modal: true, arrows: true }
	},
	{
		path: '/bot/:bot/2fa',
		name: 'bot-2fa',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/Bot2FA.vue')
		},
		meta: { modal: true, arrows: true }
  },
  {
		path: '/bot/:bot/input/:type',
		name: 'bot-input',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotInput.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/bot/:bot/delete',
		name: 'bot-delete',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotDelete.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/bot/:bot/copy',
		name: 'bot-copy',
		components: {
			default: () => import('../views/Bots.vue'),
			modal: () => import('../views/modals/BotCopy.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/bot',
		redirect: { name: 'bots' }
	},
	{
		path: '/commands',
		name: 'commands',
		component: () => import('../views/Commands.vue')
	},
	{
		path: '/log',
		name: 'log',
		component: () => import('../views/Log.vue')
	},
	{
		path: '/asf-config',
		name: 'asf-config',
		component: () => import('../views/ASFConfig.vue')
	},
	{
		path: '/mass-editor',
		name: 'mass-editor',
		component: () => import('../views/MassEditor.vue')
	},
	{
		path: '*',
		name: '404',
		redirect: { name: 'home' }
	}
];
