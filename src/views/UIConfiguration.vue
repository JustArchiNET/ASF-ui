<template>
	<main class="main-container">
		<div class="container">
			<config-editor :fields="fields" :categories="categories" :model="model"></config-editor>

			<div class="form-item">
				<div class="form-item__buttons">
					<button class="button button--confirm" @click="save">{{ $t('save') }}</button>

					<dropdown :label="$t('debug')" class="button--confirm pull-right" :disabled="!sentryInstalled">
						<li class="dropdown__item" @click="captureSnapshot">{{ $t('snapshot-capture') }}</li>
						<li class="dropdown__item" :class="{ 'dropdown__item--disabled': !storedEventsCount }" @click="copyStoredEvents">{{ $t('log-copy') }}</li>
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
				{ name: this.$t('general'), fields: [this.$t('default-page'), this.$t('notification-position'), this.$t('notify-release')] },
				{ name: this.$t('bots'), fields: [this.$t('bot-nicknames'), this.$t('bot-game-name'), this.$t('bot-fav-buttons')] },
				{ name: this.$t('debug'), fields: [this.$t('logging'), this.$t('reporting')] }
			];

			const fields = [
				{
					param: this.$t('default-page'),
					paramName: 'defaultView',
					type: 'enum',
					defaultValue: 'home',
					values: {
						[this.$t('bots')]: 'home',
						[this.$t('commands')]: 'commands',
						[this.$t('log')]: 'log',
						[this.$t('changelog')]: 'changelog',
						[this.$t('last-visited-page')]: '_last-visited-page'
					},
					description: this.$t('default-page-description')
				},
				{
					param: this.$t('notification-position'),
					paramName: 'notificationPosition',
					type: 'enum',
					defaultValue: 'rightBottom',
					values: {
						[this.$t('notification-position-left-top')]: 'leftTop',
						[this.$t('notification-position-left-bottom')]: 'leftBottom',
						[this.$t('notification-position-right-top')]: 'rightTop',
						[this.$t('notification-position-right-bottom')]: 'rightBottom',
						[this.$t('notification-position-center-top')]: 'centerTop',
						[this.$t('notification-position-center-bottom')]: 'centerBottom'
					},
					description: this.$t('notification-position-description')
				},
				{
					param: this.$t('notify-release'),
					paramName: 'notifyRelease',
					type: 'boolean',
					description: this.$t('notify-release-description')
				},
				{
					param: this.$t('bot-nicknames'),
					paramName: 'nicknames',
					type: 'boolean',
					description: this.$t('bot-nicknames-description')
				},
				{
					param: this.$t('bot-game-name'),
					paramName: 'gameName',
					type: 'boolean',
					description: this.$t('bot-game-name-description')
				},
				{
					param: this.$t('bot-fav-buttons'),
					paramName: 'favButtons',
					type: 'flag',
					defaultValue: 0,
					values: {
						[this.$t('bot-fav-buttons-none')]: 0,
						[this.$t('bot-fav-buttons-2fa')]: 1 << 0,
						[this.$t('bot-fav-buttons-bgr')]: 1 << 1,
						[this.$t('bot-fav-buttons-config')]: 1 << 2,
						[this.$t('bot-fav-buttons-pause')]: 1 << 3
					},
					description: this.$t('bot-fav-buttons-description')
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
					notificationPosition: this.$store.getters['settings/notificationPosition'],
					notifyRelease: this.$store.getters['settings/notifyRelease'],
					nicknames: this.$store.getters['settings/nicknames'],
					gameName: this.$store.getters['settings/gameName'],
					favButtons: this.$store.getters['settings/favButtons'],
					sentryInstalled: this.$store.getters['settings/sentryInstalled'],
					sentryReporting: this.$store.getters['settings/sentryReporting']
				},
				storedEvents: this.$sentry.storedEvents
			};
		},
		computed: {
			...mapGetters({
				sentryInstalled: 'settings/sentryInstalled'
			}),
			storedEventsCount() {
				return this.storedEvents.length;
			}
		},
		methods: {
			save() {
				if (this.model.sentryInstalled) this.$sentry.install(this.$store);
				else this.$sentry.destroy();

				if (this.model.sentryReporting) this.$sentry.enableReporting();
				else this.$sentry.disableReporting();

				this.$store.dispatch('settings/setDefaultView', this.model.defaultView);
				this.$store.dispatch('settings/setNotificationPosition', this.model.notificationPosition);
				this.$store.dispatch('settings/setNotifyRelease', this.model.notifyRelease);
				this.$store.dispatch('settings/setNicknames', this.model.nicknames);
				this.$store.dispatch('settings/setGameName', this.model.gameName);
				this.$store.dispatch('settings/setFavButtons', this.model.favButtons);
				this.$store.dispatch('settings/setSentryInstalled', this.model.sentryInstalled);
				this.$store.dispatch('settings/setSentryReporting', this.model.sentryReporting);

				this.$snotify.setDefaults({
					toast: {
						position: this.model.notificationPosition
					}
				});

				this.$success(this.$t('settings-saved'));
			},
			copyStoredEvents() {
				if (!this.storedEventsCount) return;
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
