import * as http from '../plugins/http';
import { state as asf, UPDATECHANNEL } from '../store/modules/asf';
import { set, get } from './storage';

// eslint-disable-next-line no-undef
export const ui = { gitCommitHash: APP_HASH };

export async function isReleaseAvailable() {
  const lastChecked = get('last-checked-for-update');

  if (lastChecked && (lastChecked > (Date.now() - 60 * 60 * 1000))) {
    const latestCachedVersion = get('latest-release');
    return (latestCachedVersion > asf.version);
  }

  const endpoint = (asf.updateChannel === UPDATECHANNEL.PRERELEASE) ? 'www/github/release' : 'www/github/release/latest';
  const release = await http.get(endpoint);

  set('latest-release', release.Version);
  set('last-checked-for-update', Date.now());

  return (release.Version > asf.version);
}
