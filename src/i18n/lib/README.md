# mole-i18n
<!-- Archi named it: https://yko.im/LSmY.png -->

- `$vm.$i18n.locales` provides a list of currently cached locales
- `$vm.$i18n.availableLocales` contains a list of all available locales 
- `$vm.$i18n.locale` and `$vm.$i18n.fallbackLocale` contains current and fallback locale codes respectively
- `$vm.$i18n.set(locale)` sets given locale. If available, cache will be used, otherwise it'll download required file from server
- `$vm.$i18n.has(locale)` checks whether the locale is cached


