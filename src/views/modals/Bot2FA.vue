<template>
	<main class="main-container" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>

		<div class="form-item">
			<div class="form-item__token">
				<input class="form-item__input form-item__input-token" type="text" :value="token" readonly>
			</div>
			<div class="form-item__buttons form-item__buttons--center form-item__buttons--column">
				<button class="button button--confirm" @click="refreshToken">
					<font-awesome-icon icon="spinner" v-if="refreshing" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-token-refresh') }}</span>
				</button>
				<button class="button button--confirm" @click="copyToken">{{ $t('2fa-token-copy') }}</button>
				<button class="button button--confirm" @click="acceptTrades">
					<font-awesome-icon icon="spinner" v-if="accepting" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-accept') }}</span>
				</button>
				<button class="button button--cancel" @click="cancelTrades">
					<font-awesome-icon icon="spinner" v-if="canceling" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-cancel') }}</span>
				</button>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import * as copy from 'copy-to-clipboard';

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
			...mapGetters({
				nicknames: 'settings/nicknames'
			}),
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
		methods: {
			async acceptTrades() {
				if (this.accepting) return;

				this.accepting = true;

				try {
					const response = await this.$http.post(`bot/${this.bot.name}/twoFactorAuthentication/confirmations/accept`);

					if (response[this.bot.name].Success) {
						this.$success(this.$t('2fa-accept-success'));
					} else {
						this.$error(response[this.bot.name].Message);
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
					const response = await this.$http.post(`bot/${this.bot.name}/twoFactorAuthentication/confirmations/cancel`);
					
					if (response[this.bot.name].Success) {
						this.$success(this.$t('2fa-cancel-success'));
					} else {
						this.$error(response[this.bot.name].Message);
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
						this.$success(this.$t('2fa-token-refresh-success'));
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
		display: flex;
		justify-content: center;
		padding-bottom: 1em;

		:focus {
			outline: none;
		}
	}

	.form-item__input-token {
		font-size: 1.6em;
		font-weight: bold;
		height: 2em;
		letter-spacing: 0.5em;
		text-align: center;
		text-indent: 0.5em;
		width: 8em;

		.app--dark-mode & {
			border-color: var(--color-text-dark);
		}
	}
</style>
