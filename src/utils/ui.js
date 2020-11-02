import * as http from '../plugins/http';
import { state as asf, UPDATECHANNEL } from '../store/modules/asf';
import { set, get } from './storage';

export const ui = { gitCommitHash: APP_HASH };

export async function newReleaseAvailable() {
  try {
    const lastChecked = get('last-checked-for-update');

    if (lastChecked) {
      const currentTimestamp = Date.now() - 60 * 60 * 1000;
      if (lastChecked > currentTimestamp) return false;
    }

    const updateChannel = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? 'releases' : 'releases/latest';
    const latestReleaseRaw = await http.post('www/send', { url: `https://api.github.com/repos/JustArchiNET/ArchiSteamFarm/${updateChannel}` });
    set('last-checked-for-update', Date.now());

    const latestReleaseVersion = JSON.parse(latestReleaseRaw);
    if (!latestReleaseVersion) return false;

    const latestVersion = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? latestReleaseVersion[0].tag_name : latestReleaseVersion.tag_name;
    set('latest-release', latestVersion);
    return (latestVersion > asf.version);
  } catch (err) {
    console.warn(err.message);
  }
}
