export default [
	{
		path: '/',
		redirect: { name: 'home' }
	},
	{
		path: '/page/home',
		name: 'home',
		component: () => import('../views/Home.vue')
	},
	{
		path: '/page/setup',
		name: 'setup',
		component: () => import('../views/Setup.vue'),
		meta: { noPasswordRequired: true }
	},
	{
		path: '/page/ipc-configuration',
		name: 'ipc-configuration',
		component: () => import('../views/IPCConfiguration.vue')
	},
	{
		path: '/page/bots',
		name: 'bots',
		component: () => import('../views/Bots.vue')
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
		path: '/page/bot/:bot',
		name: 'bot',
		component: () => import('../views/Bot.vue')
	}
];
