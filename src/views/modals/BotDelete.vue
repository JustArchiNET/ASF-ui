<template>
	<main class="main-container main-container--bot-profile" v-if="bot">
		<h2 class="title" v-if="bot.nickname && nicknames">{{ $t('bot-delete', { name: bot.nickname }) }}</h2>
		<h2 class="title" v-else>{{ $t('bot-delete', { name: bot.name }) }}</h2>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center">
				<button class="button button--cancel" @click="onDelete">
					<font-awesome-icon icon="spinner" v-if="deleting" spin></font-awesome-icon>
					<span v-else>{{ $t('delete') }}</span>
				</button>

				<button class="button button--confirm" @click="$parent.close()">{{ $t('cancel') }}</button>
			</div>
		</div>
	</main>
</template>

<script>
	import delay from '../../utils/delay';

	import { mapGetters } from 'vuex';

	export default {
		name: 'bot',
		data() {
			return {
				deleting: false
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
			async onDelete() {
				this.deleting = true;

				try {
					await this.$http.del(`bot/${this.bot.name}`);
					await delay(1000);
					await this.$store.dispatch('bots/updateBot', { name: this.bot.name });
					this.$router.push({ name: 'bots' });
				} finally {
					this.deleting = false;
				}
			}
		}
	};
</script>
