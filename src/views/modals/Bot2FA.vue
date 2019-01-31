<template>
	<main class="main-container" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>

		<div class="form-item">
			<div class="form-item__token">
				<input class="form-item__input form-item__input-token" type="text" :value="token" readonly>
			</div>
			<div class="form-item__buttons form-item__buttons--center form-item__buttons--column">
				<button class="button button--confirm" @click="copyToken">{{ $t('token-copy') }}</button>
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

			const response = await this.$http.get(`bot/${this.bot.name}/TwoFactorAuthentication/Token`);
			this.token = response[this.bot.name].Result;
		},
		methods: {
			async acceptTrades() {
				if (this.accepting) return;

				this.accepting = true;

				try {
					await this.$http.botAction(this.bot.name, 'TwoFactorAuthentication/Confirmations/Accept');
					this.$success(this.$t('2fa-accept-success'));
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
					await this.$http.botAction(this.bot.name, 'TwoFactorAuthentication/Confirmations/Cancel');
					this.$success(this.$t('2fa-cancel-success'));
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.canceling = false;
				}
			},
			copyToken() {
				copy(this.token);
				this.$info(this.$t('token-copied'));
			}
		}
	};
</script>

<style lang="scss">
	.form-item__token {
		padding-bottom: 1em;
		display: flex;
		justify-content: center;

		:focus {
			outline: none;
		}
	}

	.form-item__input-token {
		font-size: 2em;
		font-weight: bold;
		text-align: center;
		letter-spacing: 0.3em;
		width: 6em;
		height: 2em;

		.app--dark-mode & {
			border-color: var(--color-text-dark);
		}
	}
</style>
