<template>
	<main class="main-container">
		<template v-if="!bot">
			<h2 class="title" v-if="!bot">Not found!</h2>
		</template>

		<template v-else>
			<h2 class="title">{{ bot.name }}</h2>

			<h3 class="subtitle" v-if="loading">Loading</h3>

			<template v-else>
				<config-editor :fields="fields" :model="model" :categories="categories" @update="onUpdate"></config-editor>

				<div class="form-item">
					<div class="form-item__buttons">
						<button class="button button--confirm" @click="onUpdate">Save</button>
					</div>
				</div>
			</template>
		</template>
	</main>
</template>

<script>
	import ConfigEditor from '../components/ConfigEditor.vue';

	import { get, post } from '../utils/http';
	import fetchConfigSchema from '../utils/fetchConfigSchema';

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
		SteamParentalPIN: { placeholder: '<keep unchanged>' },
	};

	export default {
		name: 'bot',
		components: { ConfigEditor },
		metaInfo() {
			return {
				title: `Bot - ${this.$route.params.bot}`
			}
		},
		data() {
			return {
				loading: true,
				fields: [],
				model: {},
				categories
			}
		},
		computed: {
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

				const { body: fields } = await fetchConfigSchema('ArchiSteamFarm.BotConfig');
				const [{ BotConfig: model }] = await get(`bot/${this.bot.name}`);

				for (const key of Object.keys(extendedFields)) {
					if (fields[key]) fields[key] = { ...extendedFields[key], ...fields[key] };
				}

				this.model = model;
				this.fields = Object.keys(fields).map(key => fields[key]);
				this.loading = false;
			},
			async onUpdate() {
				await post(`bot/${this.bot.name}`, { BotConfig: this.model });
			}
		}
	}
</script>
