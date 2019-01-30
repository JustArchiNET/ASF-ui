<template>
	<main class="main-container" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center form-item__buttons--column">
				<button class="button button--confirm" @click="getCurrentToken">{{ $t('token-copy') }}</button>
				<button class="button button--confirm" @click="acceptTrades">
					<font-awesome-icon icon="spinner" v-if="accepting" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-ok') }}</span>
				</button>
				<button class="button button--cancel" @click="declineTrades">
					<font-awesome-icon icon="spinner" v-if="declining" spin></font-awesome-icon>
					<span v-else>{{ $t('2fa-no') }}</span>
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
				declining: false
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
		created() {
			if (!this.bot) this.$router.replace({ name: 'bots' });
		},
		methods: {
			async acceptTrades() {
				if (this.accepting) return;

				this.accepting = true;

				try {
					await this.$http.botAction(this.bot.name, 'TwoFactorAuthentication/Confirmations/Accept');
					this.$success(this.$t('2fa-ok-success'));
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.accepting = false;
				}
			},
			async declineTrades() {
				if (this.declining) return;

				this.declining = true;

				try {
					await this.$http.botAction(this.bot.name, 'TwoFactorAuthentication/Confirmations/Deny');
					this.$success(this.$t('2fa-no-success'));
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.declining = false;
				}
			},
			async getCurrentToken() {
				const response = await this.$http.get(`bot/${this.bot.name}/TwoFactorAuthentication/Token`);
				const token = response[this.bot.name].Result;

				copy(token);
				this.$success(this.$t('token-copied'));
			}
		}
	};
</script>
