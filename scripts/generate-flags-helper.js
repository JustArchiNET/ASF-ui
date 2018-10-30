const fs = require('fs');

const files = fs.readdirSync('./src/i18n/locale');

const countries = files
	.filter(fileName => fileName.endsWith('.json'))
	.map(fileName => fileName === 'default.json' ? 'en-US' : fileName.replace('.json', ''))
	.map(locale => locale === 'sr-CS' ? 'rs' : locale.split('-')[1].toLowerCase());

const fileContent = countries
	.map(country => `export { default as ${country} } from 'svg-country-flags/png100px/${country}.png';`)
	.join('\n');

fs.writeFileSync('./src/utils/flags.js', fileContent);
