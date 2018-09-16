const got = require('got');

async function fetchCommands() {
  let { body: commandsWiki } = await got('https://raw.githubusercontent.com/wiki/JustArchi/ArchiSteamFarm/Commands.md');
  commandsWiki = commandsWiki.slice(commandsWiki.indexOf('## Commands') + '## Commands'.length, commandsWiki.length);
  commandsWiki = commandsWiki.slice(commandsWiki.indexOf('\n'), commandsWiki.indexOf('##')).trim();
  commandsWiki = commandsWiki.slice(commandsWiki.indexOf('\n'), commandsWiki.lastIndexOf('---')).trim();
  commandsWiki = commandsWiki.slice(commandsWiki.indexOf('\n'), commandsWiki.length).trim();

  return commandsWiki.split('\n')
    .map(commandRow => commandRow.split(' | '))
    .map(([command, access, description]) => ({
      command: command.slice(1, -1),
      access: access.slice(1, -1),
      description
    }));
}

module.exports = fetchCommands;