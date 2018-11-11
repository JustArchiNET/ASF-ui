<template>
	<main class="main-container main-container--center">
		<div class="container container--small">
			<h2 class="title">{{ $t('ui-configuration') }}</h2>

			<config-editor :fields="fields" :categories="categories" :model="model"></config-editor>

			<div class="form-item">
				<div class="form-item__buttons">
					<button class="button button--confirm" @click="save">{{ $t('save') }}</button>

					<div class="pull-right">
						<button class="button button--confirm" v-if="model.sentryInstalled" @click="captureSnapshot">{{ $t('capture-snapshot') }}</button>

						<template v-if="model.sentryInstalled && !model.sentryReporting || storedEventsCount">
							<button class="button button--disabled" v-if="!storedEventsCount">{{ $t('no-events') }}</button>
							<button class="button button--confirm" @click="copyStoredEvents" v-else>{{ $t('copy-log') }}</button>
						</template>
					</div>
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
				{ name: this.$t('general'), fields: [this.$t('default-page')] },
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
					defaultView: storage.get('settings:default-view'),
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
				if (model.defaultView) storage.set('settings:default-view', model.defaultView);
				model.sentryInstalled ? this.$sentry.install(this.$store) : this.$sentry.destroy();
				model.sentryReporting ? this.$sentry.enableReporting() : this.$sentry.disableReporting();
				this.$success(this.$t('settings-saved'));
			},
			copyStoredEvents() {
				copy(JSON.stringify(this.storedEvents));
				this.$info(this.$t('log-copied'));
			},
			captureSnapshot() {
				this.$sentry.captureSnapshot();
				this.$info(this.$t('snapshot-captured'));
			}
		}
	};
</script>
