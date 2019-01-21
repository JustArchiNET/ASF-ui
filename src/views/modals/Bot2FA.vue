<template>
	<main class="main-container" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>

		<div class="form-item">
			<input class="token" type="text" placeholder="-">
			<button class="button" @click="refreshToken" :title="$t('token-refresh')">
				<font-awesome-icon icon="sync-alt"></font-awesome-icon>
			</button>
			<button class="button" @click="copyToken" :title="$t('token-copy')">
				<font-awesome-icon icon="clipboard"></font-awesome-icon>
			</button>
		</div>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center">
				<button class="button button--confirm" @click="acceptTrades">{{ $t('2fa-ok') }}</button>
				<button class="button button--cancel" @click="declineTrades">{{ $t('2fa-no') }}</button>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import * as copy from 'copy-to-clipboard';

	export default {
		name: 'bot-2fa',
		components: {},
		data() {
			return {
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
			refreshToken() {
			},
			copyToken() {
				let token = 'D3XGP'; //just for testing

				copy(token);
				this.$info(this.$t('token-copied'));
			},
			acceptTrades() {
			},
			declineTrades() {
			}
		}
	};
</script>

<style lang="scss">
	.token{
		background: var(--color-background-light);
		font-size: 24px;
		width: 4.5em;
		text-align: center;
		vertical-align: middle;
		height: 2.66667em;
		border: 1px solid black;
		border-radius: .1875em;
	}
</style>
