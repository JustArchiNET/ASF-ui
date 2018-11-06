<template>
	<main class="main-container main-container--modal main-container--bot-create">
			<h2 class="title">{{ $t('bot-new') }}</h2>

			<h3 class="subtitle" v-if="loading"><font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon></h3>
			<div class="container" v-else>
				<config-editor :fields="fields" :model="model" :categories="categories"></config-editor>

				<div class="form-item">
					<div class="form-item__buttons">
						<button class="button button--confirm" @click="onCreate">
							<font-awesome-icon icon="spinner" v-if="creating" spin></font-awesome-icon>
							<span v-else>{{ $t('create') }}</span>
						</button>

						<button class="button button--link pull-right" @click="onDownload">{{ $t('download-raw-config') }}</button>
					</div>
				</div>
			</div>
	</main>
</template>

<script>
	import ConfigEditor from '../../components/ConfigEditor.vue';

	import fetchConfigSchema from '../../utils/fetchConfigSchema';

	import { mapGetters } from 'vuex';
	import loadParameterDescriptions from '../../utils/loadParameterDescriptions';
	import prepareModelToDownload from '../../utils/prepareModelToDownload';
	import delay from '../../utils/delay';

	const categories = [
		{ name: 'Basic', fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'IsBotAccount', 'Paused'] },
		{ name: 'Security', fields: ['PasswordFormat', 'UseLoginKeys'] },
		{ name: 'Access', fields: ['SteamUserPermissions', 'SteamParentalPIN'] },
		{ name: 'Community', fields: ['HandleOfflineMessages'] },
		{ name: 'Trade', fields: ['SteamTradeToken', 'TradingPreferences', 'LootableTypes', 'MatchableTypes', 'AcceptGifts', 'DismissInventoryNotifications'] },
		{ name: 'Farming', fields: ['FarmingOrders', 'SendTradePeriod', 'AutoSteamSaleEvent', 'IdlePriorityQueueOnly', 'IdleRefundableGames', 'FarmOffline', 'SendOnFarmingFinished', 'ShutdownOnFarmingFinished'] },
		{ name: 'Customization', fields: ['SteamMasterClanID', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
		{ name: 'Performance', fields: ['HoursUntilCardDrops'] }
	];

	export default {
		name: 'bot-create',
		components: { ConfigEditor },
		metaInfo() {
			return {
				title: `Create new bot`
			};
		},
		data() {
			return {
				loading: true,
				creating: false,
				fields: [],
				model: {},
				categories
			};
		},
		computed: {
			...mapGetters({ version: 'status/version' })
		},
		async created() {
			await this.loadConfig();
		},
		methods: {
			async loadConfig() {
				const [{ body: fields }, descriptions] = await Promise.all([
					fetchConfigSchema('ArchiSteamFarm.BotConfig'),
					loadParameterDescriptions(this.version)
				]);

				this.model = {};

				this.fields = [
					{
						defaultValue: '',
						param: 'Name',
						paramName: 'Name',
						type: 'string',
						description: '<code>string</code> type with no default value. This property is required and defines bot name - it is used for identification purpose inside ASF only. Must be unique for each bot.'
					},
					...Object.keys(fields).map(key => ({
						description: descriptions[key],
						...fields[key]
					}))
				];

				this.loading = false;
			},
			async onCreate() {
				if (!this.model.Name || this.creating) return;

				this.creating = true;

				try {
					await this.$http.post(`bot/${this.model.Name}`, { BotConfig: this.model });
					await delay(1000);
					await this.$store.dispatch('bots/updateBot', { name: this.model.Name });
					this.$parent.close();
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.creating = false;
				}
			},
			async onDownload() {
				const element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(prepareModelToDownload(this.model)));
				element.setAttribute('download', `${this.model.Name}.json`);
				element.style.display = 'none';
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			}
		}
	};
</script>

<style lang="scss">
	.main-container--bot-create {
		width: 1000px;
	}
</style>
