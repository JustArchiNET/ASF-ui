import * as http from "../plugins/http";
import { state as asf, UPDATECHANNEL} from "../store/modules/asf";

export const ui = {
	version: APP_RELEASE
};

export async function newReleaseAvailable(repo, version) {
	const updateChannel = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? 'releases' : 'releases/latest';
	const latestReleaseRaw = await http.post('www/send', { url: `https://api.github.com/repos/JustArchiNET/${repo}/${updateChannel}` });
	const latestReleaseVersion = JSON.parse(latestReleaseRaw);

	if (!latestReleaseVersion) return;

	const latestVersion = (asf.updateChannel === UPDATECHANNEL.EXPERIMENTAL) ? latestReleaseVersion[0].tag_name : latestReleaseVersion.tag_name;
	return (latestVersion > version);
}
