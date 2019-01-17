<template>
	<main class="main-container">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ bot.nickname }}</h2>
		<h2 class="title" v-else>{{ bot.name }}</h2>
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
		}
	};
</script>
