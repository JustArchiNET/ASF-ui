import Vue from 'vue';
import humanizeDuration from 'humanize-duration';

export default function getLocaleForHD() {
	const supportedLanguages = humanizeDuration.getSupportedLanguages();
	const { locale, noRegionalLocale } = Vue.i18n;
	if (locale === 'zh-CN') return 'zh_CN';
	if (locale === 'zh-TW') return 'zh_TW';
	if (locale === 'zh-HK') return 'zh_CN';
	if (supportedLanguages.includes(noRegionalLocale)) return noRegionalLocale;
	return 'en';
}
