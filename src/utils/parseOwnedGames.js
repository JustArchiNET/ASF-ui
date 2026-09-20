// Parses the response of the "owns" command into a list of owned games
// The wording and the separator between appID and name are localized by ASF, so we only rely on the "app/<appID> <separator> <name>" structure
// Lines without bot prefix are skipped, since ASF appends a localized overview per game that mentions the same identifiers
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
