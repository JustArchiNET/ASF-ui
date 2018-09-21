import { post } from './http';
import removeMarkdown from 'remove-markdown';

const defaultCommandsURL = 'https://raw.githubusercontent.com/wiki/JustArchi/ArchiSteamFarm/Commands.md';

function compareVersion(a, b) {
	let result = 0;

	const aValues = a.split('.');
	const bValues = b.split('.');

	aValues.forEach((value, index) => {
		if (result !== 0) return;

		if (value === bValues[index]) return;

		if (value > bValues[index]) result = 1;
		else result = -1;
	});

	return result;
}

async function getCommandsURL(version) {
	if (!version) return defaultCommandsURL;

	const releasesRaw = await post('WWW/Send', { URL: 'https://api.github.com/repos/JustArchi/ArchiSteamFarm/releases?per_page=10' });
	const releases = JSON.parse(releasesRaw);

	const currentReleaseIndex = releases.findIndex(release => release.tag_name === version);

	if (currentReleaseIndex === -1) {
		const latestTag = releases[0].tag_name;
		if (compareVersion(version, latestTag) === 1) return defaultCommandsURL;
		throw new Error(`Version ${version} is too old, command list unavailable`);
	}

	if (currentReleaseIndex === 0) return defaultCommandsURL;

	const nextReleaseTime = new Date(releases[currentReleaseIndex - 1].published_at);

	const wikiRevisionsRaw = await post('WWW/Send', { URL: 'https://github.com/JustArchi/ArchiSteamFarm/wiki/Commands/_history' });

	const wikiRevisionsHTML = document.createElement('html');
	wikiRevisionsHTML.innerHTML = wikiRevisionsRaw;

	const wikiRevisions = Array.from(wikiRevisionsHTML.querySelectorAll('.js-wiki-history-revision')).map(revisionHTML => ({
		releaseTime: new Date(revisionHTML.querySelector('relative-time').getAttribute('datetime')),
		version: revisionHTML.querySelector('.js-wiki-history-checkbox').value
	}));

	const latestWikiRevision = wikiRevisions.find(({ releaseTime }) => releaseTime < nextReleaseTime);
	return latestWikiRevision ? `https://github.com/JustArchi/ArchiSteamFarm/wiki/Commands/${latestWikiRevision.version}` : defaultCommandsURL;
}

function parseCommandsMD(commandsWikiMarkdown) {
	commandsWikiMarkdown = commandsWikiMarkdown.slice(commandsWikiMarkdown.indexOf('## Commands') + '## Commands'.length, commandsWikiMarkdown.length);
	commandsWikiMarkdown = commandsWikiMarkdown.slice(commandsWikiMarkdown.indexOf('\n'), commandsWikiMarkdown.indexOf('##')).trim();
	commandsWikiMarkdown = commandsWikiMarkdown.slice(commandsWikiMarkdown.indexOf('\n'), commandsWikiMarkdown.lastIndexOf('---')).trim();
	commandsWikiMarkdown = commandsWikiMarkdown.slice(commandsWikiMarkdown.indexOf('\n'), commandsWikiMarkdown.length).trim();

	return commandsWikiMarkdown.split('\n')
		.map(commandRow => commandRow.split(' | '))
		.map(([command, access, description]) => ({
			command: command.slice(1, -1),
			access: access ? access.slice(1, -1) : null,
			description: removeMarkdown(description)
		}));
}

function parseCommandsHTML(commandsWikiRaw) {
	const commandsWikiHTML = document.createElement('html');
	commandsWikiHTML.innerHTML = commandsWikiRaw;

	const commandsTableHTML = commandsWikiHTML.querySelector('#user-content-commands-1').parentElement.nextElementSibling;

	return Array.from(commandsTableHTML.querySelectorAll('tbody tr'))
		.map(tableRow => tableRow.textContent.trim().split('\n'))
		.map(([command, access, description]) => ({ command, access, description }));
}

export default async function fetchCommands(version) {
	const commandsURL = await getCommandsURL(version);

	const rawCommands = await post('WWW/Send', { URL: commandsURL });

	if (commandsURL === defaultCommandsURL) return parseCommandsMD(rawCommands);
	return parseCommandsHTML(rawCommands);
}
