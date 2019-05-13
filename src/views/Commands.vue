<template>
	<main class="main-container main-container--fullheight commands">
		<div class="container">
			<div ref="terminal" class="terminal" @click="focusInput">
				<div v-for="{ type, message } in log" class="terminal-message">
					<span class="terminal-message__sign">{{ type === 'out' ? '>' : '<' }}</span>
					<span class="terminal-message__content">{{ message }}</span>
				</div>
				<div class="terminal__input-wrapper">
					<span class="terminal-message__sign sign-input" @click="sendCommand">></span>
					<input ref="terminal-input" type="text" spellcheck="false" :value="command" class="terminal__input" @input="command = $event.target.value"
						@keydown.enter="sendCommand" @keydown.tab.prevent="autocomplete" @keydown.up="historyPrevious" @keydown.down="historyNext"
						@keydown.ctrl.76="clearTerminal" @keydown.ctrl.65="jumpToStart" @keydown.ctrl.75="removeAfterCursor">
					<input v-model="autocompleteSuggestion" type="text" spellcheck="false" class="terminal__input terminal__input--autocomplete">
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapGetters } from 'vuex';
	import * as storage from '../utils/storage';
	import fetchWiki from '../utils/fetchWiki';
	import getSelectedText from '../utils/getSelectedText';

	class CommandsCache {
		constructor(maxLength) {
			this._cache = [];
			this._maxLength = maxLength;
		}

		get length() {
			return this._cache.length;
		}

		get(index) {
			return this._cache[index] || '';
		}

		add(el) {
			if (this.get(0) === el) return;
			this._cache.unshift(el);
			this.save();
		}

		trim() {
			while (this.length > this._maxLength) this._cache.pop();
		}

		save() {
			storage.set('command-history', this._cache);
		}

		load() {
			const commandHistory = storage.get('command-history');
			if (commandHistory && Array.isArray(commandHistory)) this._cache = commandHistory;
			this.trim();
		}
	}

	export default {
		name: 'commands',
		metaInfo() {
			return {
				title: this.$t('commands')
			};
		},
		data() {
			return {
				command: '',
				log: [],
				commandHistory: new CommandsCache(20),
				commandHistoryIndex: -1,
				asfCommands: [],
				lastTabPressTime: 0
			};
		},
		computed: {
			...mapGetters({ version: 'asf/version' }),
			commands() {
				return [
					...this.asfCommands.filter(({ command }) => command !== 'help'),
					{ command: 'commands', description: this.$t('terminal-commands') },
					{ command: 'help <Command>', description: this.$t('terminal-help') }
				];
			},
			commandsNames() {
				return this.commands.map(command => command.command.split(' ')[0]);
			},
			commandsParameters() {
				return this.commands.map(({ command }) => command.split(' '))
					.map(([command, ...params]) => ({ command, params }))
					.reduce((commandParameters, { command, params }) => (commandParameters[command] = params, commandParameters), {});
			},
			autocompleteSuggestion() {
				if (this.suggestedCommand) return this.command.replace(/./g, ' ') + this.suggestedCommand.substr(this.command.length);

				if (this.selectedCommand) {
					if (!this.suggestedParameters || !this.suggestedParameters.length) return;

					if (this.suggestedParameterValue) {
						return [
							this.command.replace(/./g, ' ') + this.suggestedParameterValue.slice(this.currentParameterValue.length),
							...this.suggestedParameters.slice(this.currentParameterIndex)
						].join(' ');
					}

					const remainingParameters = this.suggestedParameters.slice(this.currentParameterValue.length ? this.currentParameterIndex : this.currentParameterIndex - 1);
					if (!remainingParameters.length && this.currentParameter) remainingParameters.push(this.currentParameter);

					return this.command.replace(/./g, ' ')
						+ (this.currentParameterValue.length ? ' ' : '')
						+ remainingParameters.join(' ');
				}
			},
			suggestedCommand() {
				if (!this.command) return;
				return this.commandsNames.find(command => command.startsWith(this.command));
			},
			suggestedParameters() {
				if (this.selectedCommand && this.commandsParameters[this.selectedCommand]) return this.commandsParameters[this.selectedCommand];

				return [];
			},
			currentParameterIndex() {
				return this.command.split(' ').length - 1;
			},
			currentParameter() {
				if (!this.suggestedParameters.length) return;

				const currentParameter = this.suggestedParameters[this.currentParameterIndex - 1];
				if (currentParameter) return currentParameter;

				const lastParameter = this.suggestedParameters[this.suggestedParameters.length - 1];
				if (lastParameter.substr(-2, 1) === 's') return lastParameter;
			},
			currentParameterValue() {
				if (this.currentParameter && this.currentParameter.substr(-2, 1) === 's') {
					const currentParameterValue = this.command.split(' ')[this.currentParameterIndex].split(',');
					return currentParameterValue[currentParameterValue.length - 1];
				}

				return this.command.split(' ')[this.currentParameterIndex];
			},
			suggestedParameterValue() {
				if (!this.currentParameterValue || !this.currentParameterValue.length) return;
				if (!this.currentParameter) return;

				switch (this.currentParameter.toLowerCase()) {
				case '<bot>':
				case '<bots>':
				case '<targetbot>':
					const suggestedBot = [...this.$store.getters['bots/bots'].map(bot => bot.name), 'ASF']
						.find(name => name.startsWith(this.currentParameterValue));

					if (suggestedBot) return suggestedBot;

					return [...this.$store.getters['bots/bots'].map(bot => bot.name), 'ASF']
						.find(name => name.toLowerCase().startsWith(this.currentParameterValue.toLowerCase()));
				case '<command>':
					return this.commandsNames.find(name => name.startsWith(this.currentParameterValue));
				case '<modes>':
					if (this.selectedCommand === 'transfer') {
						return ['All', 'Background', 'Booster', 'Card', 'Emoticon', 'Foil', 'Gems', 'Unknown']
							.find(name => name.toLowerCase().startsWith(this.currentParameterValue.toLowerCase()));
					}

					if (this.selectedCommand === 'redeem^') {
						return ['FD', 'FF', 'FKMD', 'SD', 'SF', 'SI', 'SKMG', 'V']
							.find(name => name.toLowerCase().startsWith(this.currentParameterValue.toLowerCase()));
					}

					return;
				case '<type>':
					if (this.selectedCommand !== 'input') return;

					return ['DeviceID', 'Login', 'Password', 'SteamGuard', 'SteamParentalCode', 'TwoFactorAuthentication']
						.find(name => name.toLowerCase().startsWith(this.currentParameterValue.toLowerCase()));
				case '<settings>':
					if (this.selectedCommand !== 'privacy') return;

					return ['Private', 'FriendsOnly', 'Public']
						.find(name => name.toLowerCase().startsWith(this.currentParameterValue.toLowerCase()));
				}
			},
			selectedCommand() {
				if (!this.command) return;
				return this.commandsNames.find(command => command === this.command.split(' ')[0]);
			}
		},
		watch: {
			log() {
				this.$nextTick(() => {
					this.$refs.terminal.scrollTop = Math.max(0, this.$refs.terminal.scrollHeight - this.$refs.terminal.clientHeight);
				});
			}
		},
		async created() {
			this.commandHistory.load();
			this.asfCommands = await this.loadCommands();
		},
		mounted() {
			this.$refs['terminal-input'].focus();
		},
		methods: {
			async sendCommand() {
				const commandToExecute = this.command.trim();
				this.command = '';

				if (!commandToExecute) return;

				this.commandHistoryIndex = -1;
				this.commandHistory.add(commandToExecute);

				const response = { type: 'in', message: '...' };

				this.log.push({ type: 'out', message: commandToExecute });
				this.log.push(response);

				try {
					const result = await this.executeCommand(commandToExecute);
					response.message = result.trim();
				} catch (err) {
					response.message = `Error: ${err.message}`;
				}
			},
			async executeCommand(commandToExecute) {
				switch (commandToExecute.split(' ')[0]) {
				case 'commands':
					return this.$t('terminal-available-commands', { commands: this.commandsNames.join(', ') });
				case 'help':
					if (commandToExecute.split(' ')[1]) return this.commandHelp(commandToExecute.split(' ')[1]);
					return this.$t('terminal-help-text');
				}

				return this.$http.command(commandToExecute);
			},
			commandHelp(command) {
				const asfCommand = this.commands.find(asfCommand => asfCommand.command.split(' ')[0] === command);
				if (asfCommand) return asfCommand.description;
				return this.$t('terminal-no-help', { command });
			},
			focusInput() {
				const selectedText = getSelectedText();
				if (selectedText) return;
				this.$refs['terminal-input'].focus();
			},
			autocomplete() {
				if (!this.selectedCommand) this.command = this.suggestedCommand || '';

				if (this.selectedCommand && this.suggestedParameterValue) {
					const splitCommand = this.command.split(' ');
					const splitCurrentParameter = splitCommand[splitCommand.length - 1].split(',');

					this.command = [...splitCommand.slice(0, -1), [...splitCurrentParameter.slice(0, -1), this.suggestedParameterValue].join(',')].join(' ');
				} else if (this.command === '') {
					const tabPressTime = Date.now();
					if (tabPressTime - this.lastTabPressTime <= 500) this.command = 'commands';
					this.lastTabPressTime = tabPressTime;
				}
			},
			historyPrevious() {
				if (this.commandHistoryIndex + 1 < this.commandHistory.length) {
					this.commandHistoryIndex++;
					this.command = this.commandHistory.get(this.commandHistoryIndex);
				}

				this.moveCursorToEnd();
			},
			historyNext() {
				if (this.commandHistoryIndex > 0) {
					this.commandHistoryIndex--;
					this.command = this.commandHistory.get(this.commandHistoryIndex);
				} else if (this.commandHistoryIndex === 0) {
					this.commandHistoryIndex = -1;
					this.command = '';
				}
			},
			clearTerminal() {
				this.log = [];
			},
			jumpToStart() {
				this.$refs['terminal-input'].focus();
				this.$refs['terminal-input'].setSelectionRange(0, 0);
			},
			removeAfterCursor() {
				const pos = this.$refs['terminal-input'].selectionStart;
				this.command = this.command.substr(0, pos);
			},
			moveCursorToEnd() {
				const el = this.$refs['terminal-input'];
				const len = this.command.length;

				if (el.setSelectionRange) setTimeout(() => el.setSelectionRange(len, len), 0);
				else this.command = this.command;
			},
			parseCommandsHTML(commandsWikiRaw) {
				const commandsWikiHTML = document.createElement('html');
				commandsWikiHTML.innerHTML = commandsWikiRaw;
				const commandsTableHTML = commandsWikiHTML.querySelector('h2 > a').parentElement.nextElementSibling;

				return Array.from(commandsTableHTML.querySelectorAll('tbody tr'))
					.map(tableRow => tableRow.textContent.trim().split('\n'))
					.map(([command, access, description]) => ({ command, access, description }));
			},
			async fetchCommands() {
				const { locale } = this.$i18n;
				const wiki = await fetchWiki('Commands', this.version, locale);
				const commands = this.parseCommandsHTML(wiki);

				storage.set(`cache:asf-commands:${locale}`, { timestamp: Date.now(), commands });

				return commands;
			},
			async loadCommands() {
				const { locale } = this.$i18n;
				const commandsCache = storage.get(`cache:asf-commands:${locale}`);

				if (commandsCache) {
					const { timestamp, commands } = commandsCache;
					if (timestamp > Date.now() - 24 * 60 * 60 * 1000) return commands;
				}

				return this.fetchCommands();
			}
		}
	};
</script>

<style lang="scss">
	.commands {
		display: grid;
		grid-template-rows: 1fr;

		> div {
			min-height: 0;
		}
	}

	.sign-input {
		cursor: pointer;
	}
</style>
