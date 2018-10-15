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

	const parametersHTML = Array.from(wiki.querySelectorAll('h3 > code'));

	for (const parameterHTML of parametersHTML) {
		const parameterName = parameterHTML.innerText;

		const parameterDescription = [];
		let description = parameterHTML.parentElement.nextElementSibling;

		while (description && description.tagName.toLowerCase() !== 'hr') {
			parameterDescription.push(description.outerHTML);
			description = description.nextElementSibling;
		}

		descriptions[parameterName] = parameterDescription.join(' ');
	}

	localStorage.setItem('cache:parameter-descriptions', JSON.stringify({ timestamp: Date.now(), descriptions }));

	return descriptions;
}
