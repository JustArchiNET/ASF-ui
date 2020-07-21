<template>
	<main v-if="bot" class="main-container">
		<h2 v-if="bot.nickname && nicknames" class="title">
			{{ bot.nickname }}
		</h2>
		<h2 v-else class="title">
			{{ bot.name }}
		</h2>

		<div class="form-item">
			<div class="form-item__token">
				<input class="form-item__input form-item__input-token" type="text" :value="token" readonly>
				<div class="form-item__buttons form-item__buttons--column">
					<button class="button button--helper" :title="$t('2fa-token-refresh')" @click="refreshToken">
						<font-awesome-icon v-if="refreshing" icon="spinner" size="lg" spin></font-awesome-icon>
						<font-awesome-icon v-else icon="redo-alt" size="lg"></font-awesome-icon>
					</button>
					<button class="button button--helper" :title="$t('2fa-token-copy')" @click="copyToken">
						<font-awesome-icon icon="clipboard" size="lg"></font-awesome-icon>
					</button>
				</div>
			</div>
			<div class="form-item__buttons form-item__buttons--center form-item__buttons--column">
				<button class="button button--confirm" @click="acceptTrades">
					<font-awesome-icon v-if="accepting" icon="spinner" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-accept') }}</span>
				</button>
				<button class="button button--cancel" @click="cancelTrades">
					<font-awesome-icon v-if="canceling" icon="spinner" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-cancel') }}</span>
				</button>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import * as copy from 'copy-to-clipboard';
	import delay from '../../utils/delay';

	export default {
		name: 'bot-2fa',
		data() {
			return {
				accepting: false,
				canceling: false,
				refreshing: false,
				token: '-----'
			};
		},
		computed: {
			...mapGetters({ nicknames: 'settings/nicknames' }),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			}
		},
		async created() {
			if (!this.bot) this.$router.replace({ name: 'bots' });

			this.refreshing = true;

			try {
				const response = await this.$http.get(`bot/${this.bot.name}/twoFactorAuthentication/token`);

				if (response[this.bot.name].Result && response[this.bot.name].Success) {
					this.token = response[this.bot.name].Result;
				} else {
					this.$error(response[this.bot.name].Message);
				}
			} catch (err) {
				this.$error(err.message);
			} finally {
				this.refreshing = false;
			}
		},
		watch: {
			async token() {
				if (this.token === '-----') return;
				await delay(30000); // Steam 2FA token is only valid for 30 seconds
				this.token = '-----';
			}
		},
		methods: {
			async acceptTrades() {
				if (this.accepting) return;

				this.accepting = true;

				try {
					const bot = this.bot.name;
					const response = await this.$http.post(`bot/${bot}/twoFactorAuthentication/confirmations/accept`);
					
					if (response[bot].Success) {
						this.$success(this.$t('2fa-accept-success', { bot: bot }));
					} else {
						this.$error(response[bot].Message);
					}
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.accepting = false;
				}
			},
			async cancelTrades() {
				if (this.canceling) return;

				this.canceling = true;

				try {
					const bot = this.bot.name;
					const response = await this.$http.post(`bot/${bot}/twoFactorAuthentication/confirmations/cancel`);

					if (response[bot].Success) {
						this.$success(this.$t('2fa-cancel-success', { bot: bot }));
					} else {
						this.$error(response[bot].Message);
					}
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.canceling = false;
				}
			},
			async refreshToken() {
				if (this.refreshing) return;

				this.refreshing = true;
				this.token = '-----';

				try {
					const response = await this.$http.get(`bot/${this.bot.name}/twoFactorAuthentication/token`);

					if (response[this.bot.name].Result && response[this.bot.name].Success) {
						this.token = response[this.bot.name].Result;
					} else {
						this.$error(response[this.bot.name].Message);
					}
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.refreshing = false;
				}
			},
			copyToken() {
				copy(this.token);
				this.$info(this.$t('2fa-token-copied'));
			}
		}
	};
</script>

<style lang="scss">
	.form-item__token {
		display: grid;
		grid-column-gap: 0.75em;
		grid-template-columns: 1fr auto;
		justify-content: center;
		padding-bottom: 1em;

		:focus {
			outline: none;
		}
	}

	.form-item__input-token {
		font-size: 2.4em;
		font-weight: bold;
		height: 2.3em;
		letter-spacing: 0.3em;
		text-align: center;
		text-indent: 0.3em;
		width: 6em;

		.app--dark-mode & {
			border-color: var(--color-text-dark);
		}
	}

	.button--helper {
		max-width: 2em;
	}
</style>
