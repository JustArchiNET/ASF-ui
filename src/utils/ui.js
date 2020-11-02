import * as http from '../plugins/http';
import { state as asf, UPDATECHANNEL } from '../store/modules/asf';
import { set, get } from './storage';

export const ui = { gitCommitHash: APP_HASH };

async function isReleaseAvailable() {
  const updateChannel = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? 'releases' : 'releases/latest';
  const response = await http.post('www/send', { url: `https://api.github.com/repos/JustArchiNET/ArchiSteamFarm/${updateChannel}` });
  set('last-checked-for-update', Date.now());

  const latestRelease = JSON.parse(response);
  if (!latestRelease) return false;

  const latestVersion = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? latestRelease[0].tag_name : latestRelease.tag_name;
  set('latest-release', latestVersion);

  return (latestVersion > asf.version);
}

export async function newReleaseAvailable() {
  const lastChecked = get('last-checked-for-update');
  if (lastChecked && (lastChecked > (Date.now() - 60 * 60 * 1000))) return false;

  return isReleaseAvailable();
}
