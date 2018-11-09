<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('ui-configuration') }}</h2>

			<config-editor :fields="fields" :categories="categories" :model="model"></config-editor>

			<div class="form-item">
				<div class="form-item__buttons">
					<button class="button button--confirm" @click="save">{{ $t('save') }}</button>

					<template v-if="model.sentryInstalled && !model.sentryReporting || storedEventsCount">
						<button class="button button--disabled pull-right" v-if="!storedEventsCount">No events logged</button>
						<button class="button button--confirm pull-right" @click="copyStoredEvents" v-else>Copy log to clipboard</button>
					</template>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import * as storage from '../utils/storage';
	import ConfigEditor from '../components/ConfigEditor.vue';
	import * as copy from 'copy-to-clipboard';

	export default {
		name: 'ui-configuration',
		metaInfo() {
			return {
				title: this.$t('ui-configuration')
			};
		},
		components: { ConfigEditor },
		data() {
			const categories = [
				{ name: 'General', fields: ['Default page'] },
				{ name: 'Debug', fields: ['Logging', 'Reporting'] }
			];

			const fields = [
				{
					param: 'Default page',
					paramName: 'defaultView',
					type: 'enum',
					defaultValue: 'home',
					values: {
						[this.$t('home')]: 'home',
						[this.$t('commands')]: 'commands',
						[this.$t('bots')]: 'bots',
						[this.$t('log')]: 'log',
						[this.$t('last-visited-page')]: '_last-visited-page'
					}
				},
				{
					param: 'Logging',
					paramName: 'sentryInstalled',
					type: 'boolean',
					description: 'Install sentry plugin to prepare error logs.'
				},
				{
					param: 'Reporting',
					paramName: 'sentryReporting',
					type: 'boolean',
					description: 'Automatically upload error reports. Logging needs to be enabled.'
				}
			];

			return {
				fields,
				categories,
				model: {
					defaultView: get('settings:default-view'),
					sentryInstalled: this.$sentry.installed,
					sentryReporting: this.$sentry.reporting
				},
				storedEvents: this.$sentry.storedEvents
			}
		},
		computed: {
			storedEventsCount() {
				return this.storedEvents.length;
			}
		},
		methods: {
			save() {
				const model = this.model;
				if (model.defaultView) set('settings:default-view', model.defaultView);
				model.sentryInstalled ? this.$sentry.install() : this.$sentry.destroy();
				model.sentryReporting ? this.$sentry.enableReporting() : this.$sentry.disableReporting();
				this.$success('Settings saved!');
			},
			copyStoredEvents() {
				copy(JSON.stringify(this.storedEvents));
			}
		}
	};
</script>
