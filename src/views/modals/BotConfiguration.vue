<template>
	<main class="main-container main-container--bot-configuration" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>

		<h3 class="subtitle" v-if="loading">
			<font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon>
		</h3>

		<div class="container" v-else>
			<config-editor v-if="displayCategories" :fields="fields" :model="model" :categories="categories"></config-editor>
			<config-editor v-else :fields="fields" :model="model"></config-editor>

			<div class="form-item">
				<div class="form-item__buttons">
					<button class="button button--confirm" @click="onSave">
						<font-awesome-icon icon="spinner" v-if="saving" spin></font-awesome-icon>
						<span v-else>{{ $t('save') }}</span>
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
	import botExists from '../../utils/botExists';
	import delay from '../../utils/delay';

	const extendedFields = {
		SteamLogin: { placeholder: '<keep unchanged>' },
		SteamPassword: { placeholder: '<keep unchanged>' },
		SteamParentalPIN: { placeholder: '<keep unchanged>' }
	};

	export default {
		name: 'bot-config',
		components: { ConfigEditor },
		data() {
			const categories = [
				{ name: this.$t('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'IsBotAccount', 'Paused'] },
				{ name: this.$t('security'), fields: ['PasswordFormat', 'UseLoginKeys'] },
				{ name: this.$t('access'), fields: ['SteamUserPermissions', 'SteamParentalPIN'] },
				{ name: this.$t('trade'), fields: ['SteamTradeToken', 'TradingPreferences', 'LootableTypes', 'MatchableTypes', 'AcceptGifts', 'DismissInventoryNotifications'] },
				{ name: this.$t('farming'), fields: ['FarmingOrders', 'SendTradePeriod', 'AutoSteamSaleEvent', 'IdlePriorityQueueOnly', 'IdleRefundableGames', 'FarmOffline', 'SendOnFarmingFinished', 'ShutdownOnFarmingFinished'] },
				{ name: this.$t('customization'), fields: ['SteamMasterClanID', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
				{ name: this.$t('performance'), fields: ['HoursUntilCardDrops'] }
			];

			return {
				loading: true,
				saving: false,
				fields: [],
				model: {},
				categories
			};
		},
		computed: {
			...mapGetters({
				version: 'asf/version',
				nicknames: 'settings/nicknames',
				displayCategories: 'settings/displayCategories',
				bots: 'bots/bots'
			}),
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
		created() {
			if (!this.bot) this.$router.replace({ name: 'bots' });
		},
		methods: {
			async loadConfig() {
				const [
					{ body: fields },
					{ [this.bot.name]: { BotConfig: model } },
					descriptions
				] = await Promise.all([
					fetchConfigSchema('ArchiSteamFarm.BotConfig'),
					this.$http.get(`bot/${this.bot.name}`),
					loadParameterDescriptions(this.version, this.$i18n.locale)
				]);

				Object.keys(model).forEach(key => {
					if (key.startsWith('s_')) delete model[key.substr(2)];
				});

				this.model = model;

				this.fields = [
					{
						defaultValue: this.bot.name,
						placeholder: this.bot.name,
						param: 'Name',
						paramName: 'Name',
						type: 'string',
						description: this.$t('name-description')
					},
					...Object.keys(fields).map(key => ({
						description: descriptions[key],
						...fields[key],
						...(extendedFields[key] || [])
					}))
				];

				this.loading = false;
			},
			async onSave() {
				if (this.saving) return;

				if (this.model.Name === 'ASF') {
					this.$error(this.$t('bot-create-name-asf'));
					return;
				}

				this.saving = true;

				try {
					await this.$http.post(`bot/${this.bot.name}`, { botConfig: this.model });

					if (this.bot.name !== this.model.Name) {
						if (botExists(this.bots, this.model.Name)) {
							this.$error(this.$t('bot-create-name-exist', { name: this.model.Name }));
							return;
						}

						await this.$http.post(`bot/${this.bot.name}/rename`, { newName: this.model.Name });
						await delay(1000);
						await this.$store.dispatch('bots/updateBot', { name: this.bot.name });
						await this.$store.dispatch('bots/updateBot', { name: this.model.Name });
						this.$router.push({ name: 'bots' });
						return;
					}

					this.$parent.back();
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.saving = false;
				}
			},
			async onDownload() {
				const element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(prepareModelToDownload(this.model)));
				element.setAttribute('download', `${this.bot.name}.json`);
				element.style.display = 'none';
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			}
		}
	};
</script>

<style lang="scss">
	.main-container--bot-configuration {
		max-width: 1000px;
	}
</style>
