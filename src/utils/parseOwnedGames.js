// Response of the "owns" command is localized, so we only rely on the "<bot> ... app/<appID> <separator> <name>" structure
// Lines of other bots and the overview that ASF appends per game are skipped
export default function parseOwnedGames(response, botName) {
  if (typeof response !== 'string') return [];

  const games = [];

  response.split(/\r?\n/).forEach(line => {
    if (!line.startsWith(`<${botName}> `)) return;

    const match = line.match(/app\/(\d+) \S+ (.+)$/);
    if (!match) return;

    games.push({ appid: parseInt(match[1], 10), name: match[2].trim() });
  });

  return games;
}
