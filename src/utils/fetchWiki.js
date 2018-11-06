import { post } from '../plugins/http';

function compareVersion(a, b) {
	let result = 0;

	const aValues = a.split('.');
	const bValues = b.split('.');

	aValues.forEach((value, index) => {
		if (result !== 0) return;

		if (value === bValues[index]) return;

		if (value > bValues[index]) result = 1;
		else result = -1;
	});

	return result;
}

async function getURL(file, version) {
	const defaultURL = `https://github.com/JustArchiNET/ArchiSteamFarm/wiki/${file}`;

	if (!version) return defaultURL;

	const releasesRaw = await post('WWW/Send', { URL: 'https://api.github.com/repos/JustArchiNET/ArchiSteamFarm/releases?per_page=20' });
	const releases = JSON.parse(releasesRaw);

	const currentReleaseIndex = releases.findIndex(release => compareVersion(version, release.tag_name) > -1);

	if (currentReleaseIndex === -1) {
		const latestTag = releases[0].tag_name;
		if (compareVersion(version, latestTag) === 1) return defaultURL;
		return defaultURL;
	}

	if (currentReleaseIndex === 0) return defaultURL;

	const nextReleaseTime = new Date(releases[currentReleaseIndex - 1].published_at);
	const wikiRevisionsRaw = await post('WWW/Send', { URL: `https://github.com/JustArchiNET/ArchiSteamFarm/wiki/${file}/_history` });

	const wikiRevisionsHTML = document.createElement('html');
	wikiRevisionsHTML.innerHTML = wikiRevisionsRaw;

	const wikiRevisions = Array.from(wikiRevisionsHTML.querySelectorAll('.js-wiki-history-revision')).map(revisionHTML => ({
		releaseTime: new Date(revisionHTML.querySelector('relative-time').getAttribute('datetime')),
		version: revisionHTML.querySelector('.js-wiki-history-checkbox').value
	}));

	const latestWikiRevision = wikiRevisions.find(({ releaseTime }) => releaseTime < nextReleaseTime);
	return latestWikiRevision ? `https://github.com/JustArchiNET/ArchiSteamFarm/wiki/${file}/${latestWikiRevision.version}` : defaultURL;
}


export default async function fetchWiki(file, version) {
	const URL = await getURL(file, version);
	return await post('WWW/Send', { URL });
}
