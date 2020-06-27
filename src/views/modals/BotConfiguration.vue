<template>
	<main v-if="bot" class="main-container main-container--bot-configuration">
		<h2 v-if="bot.nickname && nicknames" class="title">
			{{ bot.nickname }}
		</h2>
		<h2 v-else class="title">
			{{ bot.name }}
		</h2>

		<h3 v-if="loading" class="subtitle">
			<font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon>
		</h3>

		<div v-else class="container">
			<config-editor v-if="displayCategories" :fields="fields" :model="model" :categories="categories"></config-editor>
			<config-editor v-else :fields="fields" :model="model"></config-editor>

			<div class="form-item">
				<div class="form-item__buttons">
					<button class="button button--confirm" @click="onSave">
						<font-awesome-icon v-if="saving" icon="spinner" spin></font-awesome-icon>
						<span v-else>{{ $t('save') }}</span>
					</button>
					<router-link tag="button" class="button button--confirm" :to="{ name: 'bot-copy', params: { bot: bot.name } }">
						{{ $t('bot-copy') }}
					</router-link>

					<button class="button button--link pull-right" @click="onDownload">
						{{ $t('download-raw-config') }}
					</button>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import ConfigEditor from '../../components/ConfigEditor.vue';
	import loadParameterDescriptions from '../../utils/loadParameterDescriptions';
	import prepareModelToDownload from '../../utils/prepareModelToDownload';
	import { getType } from '../../utils/swagger/parse';

	export default {
		name: 'bot-config',
		components: { ConfigEditor },
		data() {
			const categories = [
				{ name: this.$t('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword', 'Enabled', 'Paused', 'OnlineStatus', 'BotBehaviour'] },
				{ name: this.$t('security'), fields: ['PasswordFormat', 'UseLoginKeys'] },
				{ name: this.$t('access'), fields: ['SteamUserPermissions', 'SteamParentalCode'] },
				{ name: this.$t('trade'), fields: ['SteamTradeToken', 'AcceptGifts', 'SendTradePeriod', 'SendOnFarmingFinished', 'TradingPreferences', 'LootableTypes', 'TransferableTypes', 'MatchableTypes'] },
				{ name: this.$t('farming'), fields: ['FarmingOrders', 'AutoSteamSaleEvent', 'IdlePriorityQueueOnly', 'IdleRefundableGames', 'FarmOffline', 'ShutdownOnFarmingFinished'] },
				{ name: this.$t('customization'), fields: ['SteamMasterClanID', 'RedeemingPreferences', 'GamesPlayedWhileIdle', 'CustomGamePlayedWhileFarming', 'CustomGamePlayedWhileIdle'] },
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
			$route: {
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
					schema,
					{ [this.bot.name]: { BotConfig: model } },
					descriptions
				] = await Promise.all([
					getType('BotConfig'),
					this.$http.get(`bot/${this.bot.name}`),
					loadParameterDescriptions(this.version, this.$i18n.locale)
				]);

				Object.keys(schema).forEach(name => {
					if (name.startsWith('s_')) {
						const paramName = name.substr(2);
						delete model[paramName]
						delete schema[paramName]
					}
				});

				const extendedFields = {
					SteamLogin: { placeholder: this.$t('keep-unchanged') },
					SteamPassword: { placeholder: this.$t('keep-unchanged') },
					SteamParentalCode: { placeholder: this.$t('keep-unchanged') }
				};

				this.fields = Object.keys(schema).map(name => ({
					description: descriptions[name.replace('s_', '')],
					...schema[name],
					...(extendedFields[name] || {}),
					param: name.replace('s_', ''),
					paramName: name
				}));
				this.model = model;
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
					this.$parent.back();
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.saving = false;
				}
			},
			async onDownload() {
				const element = document.createElement('a');
				element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(prepareModelToDownload(this.model))}`);
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
		max-width: 800px;
		width: 100vw;
	}
</style>
