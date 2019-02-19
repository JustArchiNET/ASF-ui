import * as http from "../plugins/http";
import { state as asf, updateChannels } from "../store/modules/asf";

export const ui = {
	version: APP_RELEASE
};

export async function newReleaseAvailable(repo, version) {
	const updateChannel = (asf.updateChannel === updateChannels.EXPERIMENTAL) ? 'releases' : 'releases/latest';
	const latestReleaseRaw = await http.post('www/send', { url: `https://api.github.com/repos/JustArchiNET/${repo}/${updateChannel}` });
	const latestReleaseVersion = (asf.updateChannel === updateChannels.EXPERIMENTAL) ? JSON.parse(latestReleaseRaw)[0].tag_name : JSON.parse(latestReleaseRaw).tag_name;
	return (latestReleaseVersion > version);
}
