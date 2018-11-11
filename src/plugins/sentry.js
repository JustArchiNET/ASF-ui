import { set, get } from '../utils/storage';

function prepareStoreSnapshot(store) {
	const state = JSON.parse(JSON.stringify(store.state));

	// Private
	delete state.auth.password;

	// Not needed / empty / JSON incompatible
	delete state.auth.initialized;
	delete state.i18n.translations;

	return state;
}

export default {
	install(Vue) {
		if (this.installed) return;
		this.installed = true;

		const $sentry = {
			installed: false,
			reporting: JSON.parse(get('sentry:reporting', false)),
			storedEvents: [],
			tags: [],
		};

		$sentry.disableReporting = () => {
			$sentry.reporting = false;
			set('sentry:reporting', false);
		};

		$sentry.enableReporting = () => {
			$sentry.reporting = true;
			set('sentry:reporting', true);

			// Report stored events
			if ($sentry.storedEvents.length && $sentry.Sentry) {
				// Hacky hacky, but works, check code https://github.com/getsentry/sentry-javascript, don't count on docs :)
				$sentry.storedEvents.forEach(event => $sentry.Sentry.getCurrentHub().getClient().getBackend().sendEvent(event));
				$sentry.storedEvents.splice(0, $sentry.storedEvents.length);
			}
		};

		$sentry.destroy = () => {
			if (!$sentry.installed) return;
			set('sentry:active', false);
			// There's no easy, manual way to destroy Sentry client. Reload.
			setImmediate(() => window.location.reload());
		};

		$sentry.install = async store => {
			if ($sentry.installed) return;

			const Sentry = $sentry.Sentry = await import('@sentry/browser');

			Sentry.init({
				dsn: SENTRY_DSN,
				release: APP_VERSION,
				debug: APP_DEBUG,
				environment: APP_DEBUG ? 'development' : 'production',
				integrations: [new Sentry.Integrations.Vue({ Vue })],
				beforeSend: event => {
					if (store) {
						if (!event.extra) event.extra = {};
						event.extra.store = prepareStoreSnapshot(store);
					}

					if ($sentry.reporting) return event;
					$sentry.storedEvents.push(event);
					return null;
				}
			});

			Sentry.configureScope(scope => {
				$sentry.tags.forEach(({ tag, value }) => scope.setTag(tag, value));
			});

			$sentry.installed = true;
			set('sentry:active', true);
		};

		$sentry.setTag = (tag, value) => {
			$sentry.tags.push({ tag, value }); // Save tags for later

			if (!$sentry.installed) return;

			$sentry.Sentry.configureScope(scope => {
				scope.setTag(tag, value);
			});
		};

		$sentry.captureSnapshot = (name = 'Snapshot') => {
			if (!$sentry.installed) return;

			$sentry.Sentry.captureMessage(name);
		};

		Vue.prototype.$sentry = $sentry;
	}
}
