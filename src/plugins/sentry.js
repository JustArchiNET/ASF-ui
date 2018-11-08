export default {
	install(Vue) {
		if (this.installed) return;
		this.installed = true;

		const $sentry = {
			client: null,
			reporting: false,
			storedEvents: []
		};

		$sentry.disableReporting = () => $sentry.reporting = false;
		$sentry.enableReporting = () => $sentry.reporting = true;
		$sentry.destroy = () => $sentry.client = null;

		$sentry.install = async () => {
			if ($sentry.client) return;

			const Sentry = await import('@sentry/browser');

			$sentry.client = new Sentry.BrowserClient({
				dsn: SENTRY_DSN,
				release: COMMITHASH,
				integrations: [new Sentry.Integrations.Vue({ Vue })],
				beforeSend: event => {
					if ($sentry.reporting) return event;
					$sentry.storedEvents.push(event);
					return null;
				}
			});
		};

		Vue.prototype.$sentry = $sentry;
	}
}
