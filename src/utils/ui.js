import * as http from "../plugins/http";

export const ui = {
	version: APP_RELEASE
};

export async function newReleaseAvailable() {
	const latestReleaseRaw = await http.post('WWW/Send', { URL: 'https://api.github.com/repos/JustArchiNET/ASF-ui/releases/latest' });
	const latestReleaseVersion = JSON.parse(latestReleaseRaw).tag_name;
	return (latestReleaseVersion > ui.version);
}
