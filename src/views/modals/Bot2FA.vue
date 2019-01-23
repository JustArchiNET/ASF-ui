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
	import { command } from '../../plugins/http';

	export default {
		name: 'bot-2fa',
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
				const result = await command('2faok', this.bot.name);
				this.$info(this.parseResultString(result));
			},
			async declineTrades() {
				const result = await command('2fano', this.bot.name);
				this.$info(this.parseResultString(result));
			},
			parseResultString(result) {
				return result
						.replace(`<${this.bot.name}> `, '') // Remove bot name
						.replace('<ASF> ', ''); // Remove <ASF> if the bot doesn't exist
			}
		}
	};
</script>
