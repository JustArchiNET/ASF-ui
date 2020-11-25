import * as http from '../plugins/http';
import { state as asf, UPDATECHANNEL } from '../store/modules/asf';
import { set, get } from './storage';

export const ui = { gitCommitHash: APP_HASH };

export async function isReleaseAvailable() {
  const lastChecked = get('last-checked-for-update');
  if (lastChecked && (lastChecked > (Date.now() - 60 * 60 * 1000))) {
    const latestCachedVersion = get('latest-release');
    return (latestCachedVersion > asf.version);
  }

  const updateChannel = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? 'releases' : 'releases/latest';
  const response = await http.post('www/send', { url: `https://api.github.com/repos/JustArchiNET/ArchiSteamFarm/${updateChannel}` });
  set('last-checked-for-update', Date.now());

  const latestRelease = JSON.parse(response);
  if (!latestRelease) return false;

  const latestVersion = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? latestRelease[0].tag_name : latestRelease.tag_name;
  set('latest-release', latestVersion);

  return (latestVersion > asf.version);
}
