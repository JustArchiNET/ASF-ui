export default function botExists(bots, name) {
  const targetBot = bots.filter(bot => bot.name === name);
  if (targetBot.length > 0) return true;
  return false;
}
