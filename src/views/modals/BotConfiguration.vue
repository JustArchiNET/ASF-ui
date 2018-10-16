<template>
	<main class="main-container main-container--modal main-container--bot-configuration">
		<template v-if="!bot">
			<h2 class="title" v-if="!bot">Not found!</h2>
		</template>

		<template v-else>
			<h2 class="title">{{ bot.name }}</h2>

			<h3 class="subtitle" v-if="loading"><font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon></h3>
			<div class="container" v-else>
				<config-editor :fields="fields" :model="model" :categories="categories" @update="onUpdate"></config-editor>

				<div class="form-item">
					<div class="form-item__buttons">
						<button class="button button--confirm" @click="onUpdate">Save</button>
					</div>
				</div>
			</div>
		</template>
	</main>
</template>

<script>
	import ConfigEditor from '../../components/ConfigEditor.vue';

	import { get, post } from '../../utils/http';
	import fetchConfigSchema from '../../utils/fetchConfigSchema';

	import { mapGetters } from 'vuex';
	import loadParameterDescriptions from '../../utils/loadParameterDescriptions';

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

	const extendedFields = {
		SteamLogin: { placeholder: '<keep unchanged>' },
		SteamPassword: { placeholder: '<keep unchanged>' },
		SteamParentalPIN: { placeholder: '<keep unchanged>' }
	};

	export default {
		name: 'bot-config',
		components: { ConfigEditor },
		metaInfo() {
			return {
				title: `Bot - ${this.$route.params.bot}`
			};
		},
		data() {
			return {
				loading: true,
				fields: [],
				model: {},
				categories
			};
		},
		computed: {
			...mapGetters({ version: 'status/version' }),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			}
		},
		watch: {
			'$route': {
				immediate: true,
				handler: 'loadConfig'
			}
		},
		methods: {
			async loadConfig() {
				if (!this.bot) return;

				const [
					{ body: fields },
					{ [this.bot.name]: { BotConfig: model } },
					descriptions
				] = await Promise.all([
					fetchConfigSchema('ArchiSteamFarm.BotConfig'),
					get(`bot/${this.bot.name}`),
					loadParameterDescriptions(this.version)
				]);

				Object.keys(model).forEach(key => {
					if (key.startsWith('s_')) delete model[key.substr(2)];
				});

				this.model = model;

				this.fields = Object.keys(fields).map(key => ({
					description: descriptions[key],
					...fields[key],
					...(extendedFields[key] || [])
				}));

				this.loading = false;
			},
			async onUpdate() {
				await post(`bot/${this.bot.name}`, { BotConfig: this.model });
				this.$parent.close();
			}
		}
	};
</script>

<style lang="scss">
	.main-container--bot-configuration {
		width: 1000px;
	}
</style>
