<template>
	<main class="main-container main-container--modal">
		<template v-if="!bot">
			<h2 class="title" v-if="!bot">Not found!</h2>
		</template>

		<template v-else>
			<h2 class="title">{{ bot.name }}</h2>

			<h3 class="subtitle" v-if="loading"><font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon></h3>

			<template v-else-if="state === 'input'">
				<h3 class="subtitle" v-if="usedKeysCount || unusedKeysCount">{{ usedKeysCount }} used, {{ unusedKeysCount }} unused - <span class="bgr__reset" @click="onReset">reset</span></h3>

				<div class="form-item">
					<textarea class="form-item__textarea" cols="70" rows="15" title="BGR keys" placeholder="Insert your keys here" v-model="userInput" spellcheck="false"></textarea>
				</div>

				<div class="form-item">
					<div class="form-item__buttons form-item__buttons--center" v-if="state === 'input'">
						<button class="button button--confirm" @click="onCheck">Check</button>
					</div>
				</div>
			</template>

			<template v-else-if="state === 'check'">
				<div class="form-item">
					<div class="bgr__keys">
						<span class="bgr__key" v-if="noKeys"><strong>No key pairs detected</strong></span>
						<span v-for="(name, key) in keys" class="key">{{ key }} - {{ name }}</span>
					</div>
				</div>

				<div class="form-item">
					<div class="form-item__buttons form-item__buttons--center">
						<button class="button button--confirm" @click="onConfirm" v-if="!noKeys">
							<font-awesome-icon icon="spinner" v-if="confirming" spin></font-awesome-icon>
							<span v-else>Confirm</span>
						</button>

						<button class="button button--cancel" @click="onCancel" :key="'cancel'">Cancel</button>
					</div>
				</div>
			</template>
		</template>
	</main>
</template>

<script>
	import { get, post, del } from '../../utils/http';

	const keyRegex = /[0-9A-Z]{4,7}-[0-9A-Z]{4,7}-[0-9A-Z]{4,7}(?:(?:-[0-9A-Z]{4,7})?(?:-[0-9A-Z]{4,7}))?/;
	const commonDelimiters = [':', ';', '|', '-', ','];

	export default {
		name: 'bot-bgr',
		components: { },
		metaInfo() {
			return {
				title: `BGR - ${this.$route.params.bot}`
			};
		},
		data() {
			return {
				loading: true,
				confirming: false,
				state: 'input',
				unusedKeys: {},
				usedKeys: {},
				userInput: '',
				userDelimiter: ''
			};
		},
		computed: {
			unusedKeysCount() {
				return Object.keys(this.unusedKeys).length;
			},
			usedKeysCount() {
				return Object.keys(this.usedKeys).length;
			},
			bot() {
				return this.$store.getters['bots/bot'](this.$route.params.bot);
			},
			keys() {
				const lines = this.userInput
						.trim()
						.split(/\r?\n/)
						.map(line => line.trim())
						.filter(line => !!line);

				return this.parseKeys(lines);
			},
			noKeys() {
				return Object.keys(this.keys).length === 0;
			}
		},
		watch: {
			'$route': {
				immediate: true,
				handler: async function() {
					this.loading = true;
					const { UnusedKeys, UsedKeys } = await this.loadBGR();
					this.unusedKeys = UnusedKeys;
					this.usedKeys = UsedKeys;
					this.loading = false;
				}
			}
		},
		methods: {
			async loadBGR() {
				if (!this.bot) return { UnusedKeys: {}, UsedKeys: {} };
				return (await get(`bot/${this.bot.name}/GamesToRedeemInBackground`))[this.bot.name];
			},
			onCheck() {
				this.state = 'check';
			},
			async onConfirm() {
				this.confirming = true;

				try {
					await post(`bot/${this.bot.name}/GamesToRedeemInBackground`, { GamesToRedeemInBackground: this.keys });
					this.$parent.close();
				} finally {
					this.confirming = false;
				}
			},
			onCancel() {
				this.state = 'input';
			},
			async onReset() {
				await del(`bot/${this.bot.name}/GamesToRedeemInBackground`);
				this.unusedKeys = {};
				this.usedKeys = {};
			},
			detectKeyNamePair(line) {
				if (!keyRegex.test(line)) return { key: null, name: line };

				const key = keyRegex.exec(line)[0];
				const keyIndex = line.indexOf(key);
				const name = line.replace(key, '').trim();

				if (this.userDelimiter ) {
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
					}
				}

				return keys;
			}
		}
	};
</script>

<style lang="scss">
	.bgr__keys {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	.bgr__key {
		display: inline-block;
	}

	.bgr__reset {
		cursor: pointer;
	}
</style>
