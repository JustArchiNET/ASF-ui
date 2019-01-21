<template>
	<main class="main-container" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>

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
			async acceptTrades() {
			},
			async declineTrades() {
			}
		}
	};
</script>
