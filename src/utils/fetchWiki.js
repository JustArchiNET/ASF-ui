import * as http from '../plugins/http';
import getLocaleForWiki from './getLocaleForWiki';
import createVirtualDOM from './createVirtualDOM';

async function getURL(page, version, locale) {
  const wikiLocale = getLocaleForWiki(locale);
  const defaultURL = `https://github.com/JustArchiNET/ArchiSteamFarm/wiki/${page}${wikiLocale}`;

  if (!version) return defaultURL;

  const currentRelease = await http.get('www/github/release');
  let nextRelease = currentRelease.ReleasedAt;

  if (version < currentRelease.Version) {
    const oldRelease = await http.get(`www/github/release/${version}`);
    nextRelease = oldRelease.ReleasedAt;
  }

  const nextReleaseTime = new Date(nextRelease);
  const wikiRevisionsRaw = await http.post('www/send', { url: `https://github.com/JustArchiNET/ArchiSteamFarm/wiki/${page}${wikiLocale}/_history` });

  const virtualDOM = createVirtualDOM(wikiRevisionsRaw);

  const wikiRevisions = Array.from(virtualDOM.querySelectorAll('.js-wiki-history-revision')).map(revisionHTML => ({
    releaseTime: new Date(revisionHTML.querySelector('relative-time').getAttribute('datetime')),
    version: revisionHTML.querySelector('.js-wiki-history-checkbox').value,
  }));

  const latestWikiRevision = wikiRevisions.find(({ releaseTime }) => releaseTime < nextReleaseTime);
  return latestWikiRevision ? `https://github.com/JustArchiNET/ArchiSteamFarm/wiki/${page}${wikiLocale}/${latestWikiRevision.version}` : defaultURL;
}

export default async function fetchWiki(page, version, locale) {
  const url = await getURL(page, version, locale);
  return http.post('www/send', { url });
}
