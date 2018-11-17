<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('ui-configuration') }}</h2>

			<config-editor :fields="fields" :categories="categories" :model="model"></config-editor>

			<div class="form-item">
				<div class="form-item__buttons">
					<button class="button button--confirm" @click="save">{{ $t('save') }}</button>

					<dropdown :label="$t('debug')" class="button--confirm pull-right" :disabled="!sentryInstalled">
						<li class="dropdown__item" @click="captureSnapshot">{{ $t('capture-snapshot') }}</li>
						<li class="dropdown__item" @click="copyStoredEvents">{{ $t('copy-log') }}</li>
					</dropdown>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import ConfigEditor from '../components/ConfigEditor.vue';
	import Dropdown from '../components/utils/Dropdown.vue';
	import * as copy from 'copy-to-clipboard';

	import { mapGetters } from 'vuex';

	export default {
		name: 'ui-configuration',
		metaInfo() {
			return {
				title: this.$t('ui-configuration')
			};
		},
		components: { ConfigEditor, Dropdown },
		data() {
			const categories = [
				{ name: this.$t('general'), fields: [this.$t('default-page')] },
				{ name: this.$t('commands'), fields: [this.$t('timestamps')] },
				{ name: this.$t('bots'), fields: [this.$t('bot-nicknames')] },
				{ name: this.$t('debug'), fields: [this.$t('logging'), this.$t('reporting')] }
			];

			const fields = [
				{
					param: this.$t('default-page'),
					paramName: 'defaultView',
					type: 'enum',
					defaultValue: 'home',
					values: {
						[this.$t('home')]: 'home',
						[this.$t('commands')]: 'commands',
						[this.$t('bots')]: 'bots',
						[this.$t('log')]: 'log',
						[this.$t('last-visited-page')]: '_last-visited-page'
					},
					description: this.$t('default-page-description')
				},
				{
					param: this.$t('timestamps'),
					paramName: 'timestamps',
					type: 'boolean',
					description: this.$t('timestamps-description')
        },
				{
					param: this.$t('bot-nicknames'),
					paramName: 'nicknames',
					type: 'boolean',
					description: this.$t('bot-nicknames-description')
				},
				{
					param: this.$t('logging'),
					paramName: 'sentryInstalled',
					type: 'boolean',
					description: this.$t('logging-description')
				},
				{
					param: this.$t('reporting'),
					paramName: 'sentryReporting',
					type: 'boolean',
					description: this.$t('reporting-description')
				}
			];

			return {
				fields,
				categories,
				model: {
					defaultView: this.$store.getters['settings/defaultView'],
					timestamps: this.$store.getters['settings/timestamps'],
					nicknames: this.$store.getters['settings/nicknames'],
					sentryInstalled: this.$store.getters['settings/sentryInstalled'],
					sentryReporting: this.$store.getters['settings/sentryReporting']
				}
			};
		},
		computed: {
			...mapGetters({
				sentryInstalled: 'settings/sentryInstalled'
			})
		},
		methods: {
			save() {
				if (this.model.sentryInstalled) this.$sentry.install(this.$store);
				else this.$sentry.destroy();

				if (this.model.sentryReporting) this.$sentry.enableReporting();
				else this.$sentry.disableReporting();

				this.$store.dispatch('settings/setDefaultView', this.model.defaultView);
				this.$store.dispatch('settings/setTimestamps', this.model.timestamps);
				this.$store.dispatch('settings/setNicknames', this.model.nicknames);
				this.$store.dispatch('settings/setSentryInstalled', this.model.sentryInstalled);
				this.$store.dispatch('settings/setSentryReporting', this.model.sentryReporting);

				this.$success(this.$t('settings-saved'));
			},
			copyStoredEvents() {
				copy(JSON.stringify(this.$sentry.storedEvents));
				this.$info(this.$t('log-copied'));
			},
			captureSnapshot() {
				this.$sentry.captureSnapshot();
				this.$info(this.$t('snapshot-captured'));
			}
		}
	};
</script>
