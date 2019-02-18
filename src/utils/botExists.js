export default function botExists(bots, name) {
	for (const bot of bots) {
		if (bot.name === name) return true;
	}

	return false;
}
