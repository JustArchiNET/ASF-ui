import Vue from 'vue';

export default function getLocaleForHD() {
	const { locale } = Vue.i18n;

	if (locale === 'zh-CN') return 'zh_CN';
	if (locale === 'zh-TW') return 'zh_TW';
	if (locale === 'zh-HK') return 'zh_CN';
	return Vue.i18n.noRegionalLocale;
}
