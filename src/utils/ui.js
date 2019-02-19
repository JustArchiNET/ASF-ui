import * as http from "../plugins/http";

export const ui = {
	version: APP_RELEASE
};

export async function newReleaseAvailable(repo, version) {
	const latestReleaseRaw = await http.post('www/send', { url: `https://api.github.com/repos/JustArchiNET/${repo}/releases/latest` });
	const latestReleaseVersion = JSON.parse(latestReleaseRaw).tag_name;
	return (latestReleaseVersion > version);
}
