export default [
	{
		path: '/',
		redirect: { name: 'home' }
	},
	{
		path: '/page/home',
		name: 'home',
		component: () => import(/* webpackChunkName: 'home' */ '../views/Home.vue')
	},
	{
		path: '/page/setup',
		name: 'setup',
		component: () => import(/* webpackChunkName: 'setup' */ '../views/Setup.vue'),
		meta: { noPasswordRequired: true }
	},
	{
		path: '/page/ipc-configuration',
		name: 'ipc-configuration',
		component: () => import(/* webpackChunkName: 'ipc-configuration' */ '../views/IPCConfiguration.vue')
	},
	{
		path: '/page/bots',
		name: 'bots',
		component: () => import(/* webpackChunkName: 'bots' */ '../views/Bots.vue')
	},
	{
		path: '/page/bot/new',
		name: 'bot-create',
		components: {
			default: () => import(/* webpackChunkName: 'bots' */ '../views/Bots.vue'),
			modal: () => import(/* webpackChunkName: 'bot-create' */ '../views/modals/BotCreate.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot',
		name: 'bot',
		components: {
			default: () => import(/* webpackChunkName: 'bots' */ '../views/Bots.vue'),
			modal: () => import(/* webpackChunkName: 'bot' */ '../views/modals/Bot.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot/config',
		name: 'bot-config',
		components: {
			default: () => import(/* webpackChunkName: 'bots' */ '../views/Bots.vue'),
			modal: () => import(/* webpackChunkName: 'bot-configuration' */ '../views/modals/BotConfiguration.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot/bgr',
		name: 'bot-bgr',
		components: {
			default: () => import(/* webpackChunkName: 'bots' */ '../views/Bots.vue'),
			modal: () => import(/* webpackChunkName: 'bot-bgr' */ '../views/modals/BotBGR.vue')
		},
		meta: { modal: true }
	},
	{
		path: '/page/bot/:bot/delete',
		name: 'bot-delete',
		components: {
			default: () => import(/* webpackChunkName: 'bots' */ '../views/Bots.vue'),
			modal: () => import(/* webpackChunkName: 'bot-delete' */ '../views/modals/BotDelete.vue')
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
		component: () => import(/* webpackChunkName: 'commands' */ '../views/Commands.vue')
	},
	{
		path: '/page/log',
		name: 'log',
		component: () => import(/* webpackChunkName: 'log' */ '../views/Log.vue')
	},
	{
		path: '/page/config',
		name: 'global-config',
		component: () => import(/* webpackChunkName: 'global-config' */ '../views/GlobalConfig.vue')
	},
	{
		path: '*',
		name: '404',
		redirect: { name: 'home' }
	}
];
