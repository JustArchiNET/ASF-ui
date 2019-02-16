import Vue from 'vue';

export function getLocaleForWiki() {
	return (Vue.i18n.locale !== 'en-US') ? '-' + Vue.i18n.locale : '';
}
