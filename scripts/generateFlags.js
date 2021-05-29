const fs = require('fs');

module.exports = function generateFlags() {
  const files = fs.readdirSync('./src/i18n/locale');

  const countries = files
    .filter(fileName => fileName.endsWith('.json'))
    .filter(fileName => fileName !== 'lol-US.json') // Ignore LOLCAT file since 'svg-country-flags' does not support it
    .map(fileName => ((fileName === 'default.json') ? 'en-US' : fileName.replace('.json', '')))
    .map(locale => ((locale === 'sr-CS') ? 'rs' : locale.split('-')[1].toLowerCase()));

  const fileContent = countries
    .map(country => `export { default as ${country} } from 'svg-country-flags/png100px/${country}.png';`)
    .join('\n');

  fs.writeFileSync('./generated/flags.js', fileContent);
};
