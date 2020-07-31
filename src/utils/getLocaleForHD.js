import Vue from 'vue';
import humanizeDuration from 'humanize-duration';

export default function getLocaleForHD() {
  const supportedLanguages = humanizeDuration.getSupportedLanguages();
  const { locale, noRegionalLocale } = Vue.i18n;

  switch (locale) {
    case 'zh-CN':
      return 'zh_CN';
    case 'zh-TW':
    case 'zh-HK':
      return 'zh_TW';
    default:
      if (supportedLanguages.includes(noRegionalLocale)) return noRegionalLocale;
      return 'en';
  }
}
