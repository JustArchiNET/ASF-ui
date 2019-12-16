import * as http from '../plugins/http';
import { state as asf, UPDATECHANNEL } from '../store/modules/asf';
import { set } from './storage';

export const ui = { release: APP_RELEASE };

export async function newReleaseAvailable(version) {
	const updateChannel = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? 'releases' : 'releases/latest';
	const latestReleaseRaw = await http.post('www/send', { url: `https://api.github.com/repos/JustArchiNET/ArchiSteamFarm/${updateChannel}` });
	const latestReleaseVersion = JSON.parse(latestReleaseRaw);

	if (!latestReleaseVersion) return;

	const latestVersion = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? latestReleaseVersion[0].tag_name : latestReleaseVersion.tag_name;
	set('version-latest-ArchiSteamFarm', latestVersion);
	return (latestVersion > version);
}
