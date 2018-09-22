export default [
	{
		path: '/',
		name: 'home',
		component: () => import('../views/Home.vue')
	},
	{
		path: '/setup',
		name: 'setup',
		component: () => import('../views/Setup.vue'),
		meta: { noPasswordRequired: true }
	},
	{
		path: '/ipc-configuration',
		name: 'ipc-configuration',
		component: () => import('../views/IPCConfiguration.vue')
	},
	{
		path: '/bots',
		name: 'bots',
		component: () => import('../views/Bots.vue')
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
		path: '/config',
		name: 'global-config',
		component: () => import('../views/GlobalConfig.vue')
	},
	{
		path: '/bot/:bot',
		name: 'bot',
		component: () => import('../views/Bot.vue')
	}
];
