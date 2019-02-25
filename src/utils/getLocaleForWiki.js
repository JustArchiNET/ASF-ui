export function getLocaleForWiki(locale) {
	return (locale !== 'en-US') ? `-${locale}` : '';
}
