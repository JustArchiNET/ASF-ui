import fetchWiki from './fetchWiki';

export default async function loadParameterDescriptions(version) {
	const descriptionsCacheRaw = localStorage.getItem('cache:parameter-descriptions');
	if (descriptionsCacheRaw) {
		const { timestamp, descriptions } = JSON.parse(descriptionsCacheRaw);
		if (timestamp > Date.now() - 24 * 60 * 60 * 1000) return descriptions;
	}

	const descriptions = {};

	const configWiki = await fetchWiki('Configuration', version);
	const wikiHTML = document.createElement('html');
	wikiHTML.innerHTML = configWiki;
	window.wiki = wikiHTML;

	const parametersHTML = Array.from(wiki.querySelectorAll('p > code'))
		.filter(parameter => parameter.nextSibling && parameter.nextSibling.textContent && parameter.nextSibling.textContent.trim().startsWith('-'));

	for (const parameterHTML of parametersHTML) {
		const [parameterName, parameterDescription] = parameterHTML.parentElement.innerText.split('-', 2).map(part => part.trim());
		descriptions[parameterName] = parameterDescription;
	}

	localStorage.setItem('cache:parameter-descriptions', JSON.stringify({ timestamp: Date.now(), descriptions }));

	return descriptions
}
