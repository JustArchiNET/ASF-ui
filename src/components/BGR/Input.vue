<template>
	<div class="bgr__input">
		<div class="form-item">
			<textarea v-model="userInput" class="form-item__textarea" cols="70" rows="15" :placeholder="$t('bgr-keys-insert') + '\n\n' + $t('bgr-keys-insert-example')" spellcheck="false"></textarea>
		</div>

		<div class="form-item">
			<div class="form-item__buttons form-item__buttons--center">
				<button class="button button--confirm" @click="$emit('check', keys, userInput)">
					{{ $t('check') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	const keyRegex = /[0-9A-Z]{4,7}-[0-9A-Z]{4,7}-[0-9A-Z]{4,7}(?:(?:-[0-9A-Z]{4,7})?(?:-[0-9A-Z]{4,7}))?/;
	const commonDelimiters = [':', ';', '|', '-', ','];

	export default {
		name: 'bgr-input',
		data() {
			return {
				userInput: '',
				userDelimiter: ''
			};
		},
		computed: {
			keys() {
				const lines = this.userInput
					.trim()
					.split(/\r?\n/)
					.map(line => line.trim())
					.filter(line => !!line);

				return this.parseKeys(lines);
			}
		},
		methods: {
			detectKeyNamePair(line) {
				if (!keyRegex.test(line)) return { key: null, name: line };

				const key = keyRegex.exec(line)[0];
				const keyIndex = line.indexOf(key);
				const name = line.replace(key, '').trim();

				if (this.userDelimiter) {
					const delimiterIndex = keyIndex === 0 ? name.indexOf(this.userDelimiter) : name.lastIndexOf(this.userDelimiter);
					return { key, name: name.slice(delimiterIndex, this.userDelimiter.length).trim() };
				}

				const possibleDelimiter = name.charAt(keyIndex === 0 ? 0 : name.length - 1);
				if (commonDelimiters.includes(possibleDelimiter)) return { key, name: name.slice(keyIndex === 0 ? 1 : 0, name.length - (keyIndex === 0 ? 0 : 1)).trim() }; // Covers both ':<name>' and ': <name>' (':\t\t\s\s\t\t<name>' too)

				return { key, name };
			},
			parseKeys(lines) {
				const keys = {};

				// Don't blame me for standard for just yet...
				for (let i = 0; i < lines.length; ++i) {
					const line = lines[i];

					const keyNamePair = this.detectKeyNamePair(line);

					if (keyNamePair.key && keyNamePair.name) {
						keys[keyNamePair.key] = keyNamePair.name;
						continue;
					}

					// See?
					const nextLine = lines[i + 1];
					const nextKeyNamePair = this.detectKeyNamePair(nextLine);

					if (nextKeyNamePair.name && !nextKeyNamePair.key && !keyNamePair.name) {
						keys[keyNamePair.key] = nextKeyNamePair.name;
					} else if (!nextKeyNamePair.name && nextKeyNamePair.key && !keyNamePair.key) {
						keys[nextKeyNamePair.key] = keyNamePair.name;
					} else if (keyNamePair.key) {
						keys[keyNamePair.key] = keyNamePair.key;
					}
				}

				return keys;
			}
		}
	};
</script>
