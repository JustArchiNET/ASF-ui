<template>
	<main class="main-container">
		<h2 class="title">Global Config</h2>

		<div class="container">
			<config-editor :fields="fields" :model="model" :categories="categories" @update="onUpdate"></config-editor>

			<div class="form-item">
				<div class="form-item__buttons">
					<button class="button button--confirm">Save</button>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import ConfigEditor from '../components/ConfigEditor.vue';

	import { get, post } from '../utils/http';
	import fetchConfigSchema from '../utils/fetchConfigSchema';

	const categories = [
		{ name: 'Basic', fields: ['SteamOwnerID'] },
		{ name: 'Trade', fields: ['MaxTradeHoldDuration'] },
		{ name: 'Customization', fields: ['AutoRestart', 'Blacklist', 'CommandPrefix', 'CurrentCulture', 'Statistics', 'SteamMessagePrefix'] },
		{ name: 'Remote Access', fields: ['Headless', 'IPC', 'IPCPassword'] },
		{ name: 'Connection', fields: ['ConnectionTimeout', 'SteamProtocols', 'WebProxy', 'WebProxyPassword', 'WebProxyUsername'] },
		{ name: 'Performance', fields: ['ConfirmationsLimiterDelay', 'FarmingDelay', 'GiftsLimiterDelay', 'IdleFarmingPeriod', 'InventoryLimiterDelay', 'LoginLimiterDelay', 'MaxFarmingTime', 'OptimizationMode', 'WebLimiterDelay'] },
		{ name: 'Updates', fields: ['UpdateChannel', 'UpdatePeriod'] },
		{ name: 'Advanced', fields: ['Debug'] }
	];

	export default {
		name: 'global-config',
		metaInfo: { title: 'Global Config' },
		components: { ConfigEditor },
		data() {
			return {
				fields: [],
				model: {},
				categories
			};
		},
		async created() {
			const { GlobalConfig: model } = await get('ASF');
			const schema = await fetchConfigSchema('ArchiSteamFarm.GlobalConfig');
			this.model = model;
			this.fields = Object.keys(schema.body).map(key => schema.body[key]);
		},
		methods: {
			async onUpdate(model) {
				return;
				// await post('ASF', { GlobalConfig: model });
			}
		}
	};
</script>
