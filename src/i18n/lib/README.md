# mole-i18n
<!-- Archi named it: https://yko.im/LSmY.png -->

## Setup:
```JS
// load vue and vuex instance
import Vue from 'vue';
import Vuex from 'vuex';

// load i18n module
import i18n from './';

// Initialize store, you can reuse existing one
const store = new Vuex.Store();

// Add translations
const translationsEn = {
	welcome: 'Welcome, {name}!',
	messages: 'You have {messages} new messages'
};

const translationsPL = {
	messages: 'Masz {messages} nowych wiadomości'
};

// Initialize plugin
Vue.use(i18n, store, {
	locale: 'pl',
	fallbackLocale: 'en',
	translations: {
		pl: translationsPL,
		en: translationsEn
	}
});
```

```HTML
<div>
	<h1>{{ $t('welcome', { name: 'Mark' }) }}</h1>
	<p>{{ $t('messages', { messages: 5 }) }}</p>
</div>
```

## Options
- `locale` - current locale
- `fallbackLocale` - locale to fallback to if translation unavailable
- `translations` - an object of pre-loaded translations
- `availableLocales` - an array of locales available via `require.context` - `{ locale, fileName }`
- `requireLocale` - `require.context` instance

## `require.context`
You can use webpack's `require.context` to lazy load locales when needed.
```JS
const requireLocale = require.context('../locale', false, /.json$/, 'lazy');

const availableLocales = requireLocale.keys().map(fileName => {
	if (fileName === './default.json') return { name: 'en-US', fileName };
	return { name: fileName.replace('./', '').replace('.json', ''), fileName };
});

Vue.use(i18n, store, {
	locale: 'en-US',
	availableLocales,
	requireLocale
});
```

## API
Module exposes `i18n` object as `Vue.i18n` and `$vm.$i18n`, additionally, `$vm.$t` helper is available

- `i18n.locales` provides a list of currently cached locales
- `i18n.availableLocales` contains a list of all available locales 
- `i18n.locale` and `$vm.$i18n.fallbackLocale` contains current and fallback locale codes respectively
- `i18n.load(locale)` loads given locale file from `availableLocales`
- `i18n.set(locale)` sets given locale, calls `i18n.load` when `!i18n.has(locale)` 
- `i18n.has(locale)` checks whether the locale is cached
- `i18n.translate(key, defaultString, values)` translates given key in current locale

## Usage
The plugin will try to find given key in translations of currently defined locale and return respective translation. 
If the string is not found in current locale translations, fall back to non regional locale, fallback locale, defaultString and then to key itself.

```HTML
<div>
	<!-- Some localized text -->
	<h1>{{ $t('Some localized text') }}</h1>
</div>
```

It may be easier to use proper translation key instead of default text.
```HTML
<div>
	<!-- Default text -->
	<h1>{{ $t('translation.key', 'Default text') }}</h1>
</div>
```

You can use placeholders in translation strings.
```HTML
<div>
	<!-- You have 5 new messages -->
	<h1>{{ $t('You have {count} new messages', { count: 5 }) }}</h1>
</div>
```

Pluralization is supported with cldr.
```HTML
<div>
	<!-- You have one new message -->
	<h1>{{ $t('You have {PLURAL:count|one new message|{count} new messages', { count: 1 }) }}</h1>
	<!-- You have 5 new messages -->
	<h1>{{ $t('You have {PLURAL:count|one new message|{count} new messages', { count: 5 }) }}</h1>
</div>
```

Remember different languages can have multiple plural forms, these are automatically supported thanks to cldr.
```HTML
<div>
	<!-- Mam 1 banana -->
	<h1>{{ $t('Mam {PLURAL:count|{count} banana|{count} banany|{count} bananów}', { count: 1 ) }}</h1>
	<!-- Mam 2 banany -->
	<h1>{{ $t('Mam {PLURAL:count|{count} banana|{count} banany|{count} bananów}', { count: 2 ) }}</h1>
	<!-- Mam 5 bananów -->
	<h1>{{ $t('Mam {PLURAL:count|{count} banana|{count} banany|{count} bananów}', { count: 5 ) }}</h1>
</div>
```
