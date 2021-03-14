import * as http from '../plugins/http';
import getLocaleForWiki from './getLocaleForWiki';

async function getEndpoint(page, version, locale) {
  const wikiLocale = getLocaleForWiki(locale);
  const defaultEndpoint = `www/github/wiki/page/${page}${wikiLocale}`;

  if (!version) return defaultEndpoint;

  const currentRelease = await http.get('www/github/release');
  if (version >= currentRelease.Version) return defaultEndpoint;

  const oldRelease = await http.get(`www/github/release/${version}`);
  const nextReleaseTime = new Date(oldRelease.ReleasedAt);
  const wikiHistory = await http.get(`www/github/wiki/history/${page}${wikiLocale}`);

  const wikiRevisions = Object.entries(wikiHistory).map(revision => ({
    id: revision[0],
    releaseTime: new Date(revision[1]),
  }));

  wikiRevisions.sort((a, b) => new Date(b.releaseTime) - new Date(a.releaseTime));

  const latestWikiRevision = wikiRevisions.find(({ releaseTime }) => releaseTime < nextReleaseTime);
  return latestWikiRevision ? `www/github/wiki/page/${page}${wikiLocale}?revision=${latestWikiRevision.id}` : defaultEndpoint;
}

export default async function fetchWiki(page, version, locale) {
  const endpoint = await getEndpoint(page, version, locale);
  return http.get(endpoint);
}
