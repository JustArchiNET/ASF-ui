import { set, get } from '../utils/storage';

export default {
	install(Vue) {
		if (this.installed) return;
		this.installed = true;

		const $sentry = {
			installed: false,
			reporting: JSON.parse(get('sentry:reporting', false)),
			storedEvents: []
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

		$sentry.install = async () => {
			if ($sentry.installed) return;

			const Sentry = $sentry.Sentry = await import('@sentry/browser');

			Sentry.init({
				dsn: SENTRY_DSN,
				release: COMMITHASH,
				integrations: [new Sentry.Integrations.Vue({ Vue })],
				beforeSend: event => {
					console.log($sentry.reporting, event);
					if ($sentry.reporting) return event;
					$sentry.storedEvents.push(event);
					return null;
				}
			});

			$sentry.installed = true;
			set('sentry:active', true);
		};

		Vue.prototype.$sentry = $sentry;

		const active = get('sentry:active');
		if (active && JSON.parse(active)) $sentry.install();
	}
}
