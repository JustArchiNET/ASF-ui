import { indexOf as pluralIndexOf } from 'plurals-cldr';

const RE_TOKEN_LIST_VALUE = /^(\d)+/;
const RE_TOKEN_PLURAL_VALUE = /^PLURAL:+/;

function getTokenType(value) {
	if (RE_TOKEN_LIST_VALUE.test(value)) return 'list';
	if (RE_TOKEN_PLURAL_VALUE.test(value)) return 'plural';
	return 'named';
}

export default class Formatter {
	constructor() {
		this._caches = new Map();
	}

	static parse(message) {
		const tokens = [];
		let position = 0;

		let text = '';
		while (position < message.length) {
			let char = message[position++];

			if (char === '{') {
				if (text) tokens.push({ type: 'text', value: text });
				text = '';

				let value = '';
				char = message[position++];

				let intend = 1;
				while (intend !== 0) {
					if (char === '{') intend++;
					if (char === '}') intend--;

					if (intend === 0) break;

					value += char;
					char = message[position++];
				}

				const type = getTokenType(value);

				tokens.push({ type, value });
			} else {
				text += char;
			}
		}

		if (text) tokens.push({ type: 'text', value: text });

		return tokens;
	}

	compile(tokens, values, locale) {
		return tokens.map(token => this.compileToken(token, values, locale)).join('');
	}

	compileToken(token, values, locale) {
		switch (token.type) {
			case 'text':
				return token.value;
			case 'list':
				return values[parseInt(token.value.trim(), 10)];
			case 'plural':
				return this.compilePluralToken(token, values, locale);
			case 'named':
				return values[token.value.trim()];
			default:
				return '';
		}
	}

	compilePluralToken(token, values, locale) {
		// token = { type: 'plural', value: 'PLURAL:<name>|<singular>|<plural1>|<plural2>' }

		const [plural, ...forms] = token.value.split('|');
		const [_, value] = plural.split(':');

		const pluralizationValue = this.compileToken({ type: getTokenType(value), value }, values, locale);
		const pluralizationIndex = pluralIndexOf(locale, parseInt(pluralizationValue, 10));

		const formIndex = Math.min(pluralizationIndex, forms.length - 1);
		return this.interpolate(forms[formIndex], values, locale);
	}

	interpolate(message, values, locale = 'en-US') {
		const tokens = this._caches.has(message) ? this._caches.get(message) : Formatter.parse(message);
		if (!this._caches.has(message)) this._caches.set(message, tokens);
		return this.compile(tokens, values, locale);
	}
}
