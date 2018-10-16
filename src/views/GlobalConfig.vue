<template>
	<main class="main-container">
		<h2 class="title">Global Config</h2>

		<div class="container">
			<template v-if="loading">
				<h3 class="subtitle">
					<font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon>
				</h3>
			</template>
			<template v-else>
				<config-editor :fields="fields" :model="model" :categories="categories" :descriptions="descriptions"></config-editor>

				<div class="form-item">
					<div class="form-item__buttons">
						<button class="button button--confirm" @click="onSave">
							<font-awesome-icon icon="spinner" v-if="saving" spin></font-awesome-icon>
							<span v-else>Save</span>
						</button>

						<button class="button button--link pull-right" @click="onDownload">Download raw configuration file</button>
					</div>
				</div>
			</template>
		</div>
	</main>
</template>

<script>
	import ConfigEditor from '../components/ConfigEditor.vue';
	import loadParameterDescriptions from '../utils/loadParameterDescriptions';

	import { get, post } from '../utils/http';
	import fetchConfigSchema from '../utils/fetchConfigSchema';

	import { mapGetters } from 'vuex';
	import prepareModelToDownload from '../utils/prepareModelToDownload';
	import delay from '../utils/delay';

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
				loading: true,
				saving: false,
				fields: [],
				model: {},
				descriptions: {},
				categories
			};
		},
		computed: {
				...mapGetters({ version: 'status/version' })
		},
		async created() {
			const [
				{ GlobalConfig: model },
				{ body: fields },
				descriptions
			] = await Promise.all([
				get('ASF'),
				fetchConfigSchema('ArchiSteamFarm.GlobalConfig'),
				loadParameterDescriptions(this.version)
			]);

			Object.keys(model).forEach(key => {
				if (key.startsWith('s_')) delete model[key.substr(2)];
			});

			this.model = model;

			this.fields = Object.keys(fields).map(key => ({
				description: descriptions[key],
				...fields[key]
			}));

			this.loading = false;
		},
		methods: {
			async onSave() {
				if (this.saving) return;

				this.saving = true;

				try {
					await post('ASF', { GlobalConfig: this.model });
					await this.waitForRestart();
				} finally {
					this.saving = false;
				}
			},
			async waitForRestart(timeout = 120000) {
				const timeStarted = Date.now();

				while (timeStarted > Date.now() - timeout) {
					await this.$store.dispatch('status/updateASF');
					if (Date.now() - this.$store.getters['status/startTime'].getTime() < 10000) return;
					await delay(1000);
				}

				throw new Error('Restart not detected within timeout')
			},
			async onDownload() {
				const element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(prepareModelToDownload(this.model)));
				element.setAttribute('download', 'ASF.json');
				element.style.display = 'none';
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			}
		}
	};
</script>
