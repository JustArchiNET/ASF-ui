<template>
	<main class="main-container main-container--bot-copy" v-if="bot">
		<h2 class="title">{{ $t('bot-new') }}</h2>

		<div class="container">
			<p class="container-description">{{ $t('bot-new-copy', {name: bot.name}) }}</p>

			<config-editor v-if="displayCategories" :fields="fields" :model="model" :categories="categories"></config-editor>
			<config-editor v-else :fields="fields" :model="model"></config-editor>

			<div class="form-item">
				<div class="form-item__buttons">
					<button class="button button--confirm" @click="onCreate">
						<font-awesome-icon icon="spinner" v-if="creating" spin></font-awesome-icon>
						<span v-else>{{ $t('create') }}</span>
					</button>

					<router-link tag="button" class="button button--cancel pull-right" :to="{ name: 'bot-config', params: { bot: bot.name } }">{{ $t('cancel') }}</router-link>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import ConfigEditor from '../../components/ConfigEditor.vue';
	import delay from '../../utils/delay';
	import botExists from '../../utils/botExists';
	import { get } from '../../utils/storage';

	import { mapGetters } from 'vuex';

	export default {
		name: 'bot-copy',
		data() {
			const categories = [
				{ name: this.$t('basic'), fields: ['Name', 'SteamLogin', 'SteamPassword'] }
			];

			const fields = [
				{
					defaultValue: '',
					param: 'Name',
					paramName: 'Name',
					type: 'string',
					description: this.$t('name-description')
				},
				{
					defaultValue: '',
					param: 'SteamLogin',
					paramName: 'SteamLogin',
					type: 'string',
					description: get(`cache:parameter-descriptions:${this.$i18n.locale}`).descriptions.SteamLogin

				},
				{
					defaultValue: '',
					param: 'SteamPassword',
					paramName: 'SteamPassword',
					type: 'string',
					description: get(`cache:parameter-descriptions:${this.$i18n.locale}`).descriptions.SteamPassword
				}
			];

			return {
				creating: false,
				categories,
				fields,
				model: {}
			};
		},
		components: { ConfigEditor },
		computed: {
			...mapGetters({
				displayCategories: 'settings/displayCategories',
				bots: 'bots/bots'
			}),
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			}
		},
		created() {
			if (!this.bot) this.$router.replace({ name: 'bots' });
			this.model = this.bot.config;
		},
		methods: {
			async onCreate() {
				if (this.creating) return;

				if (!this.model.Name) {
					this.$error(this.$t('bot-create-name'));
					return;
				}

				if (this.model.Name === 'ASF') {
					this.$error(this.$t('bot-create-name-asf'));
					return;
				}

				if (botExists(this.bots, this.model.Name)) {
					this.$error(this.$t('bot-create-name-exist', { name: this.model.Name }));
					return;
				}

				this.creating = true;

				try {
					await this.$http.post(`bot/${this.model.Name}`, { botConfig: this.model });
					this.$parent.close();
				} catch (err) {
					this.$error(err.message);
				} finally {
					this.creating = false;
				}
			}
		}
	};
</script>

<style lang="scss">
	.main-container--bot-copy {
		max-width: 1000px;
	}

	.container-description {
		text-align: center;
		margin-bottom: 2em;
	}
</style>
