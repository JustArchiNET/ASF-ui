<template>
    <main class="main-container main-container--fullheight commands">
        <h2 class="title">Commands</h2>

        <div class="container">
            <div class="terminal" @click="focusInput" ref="terminal">
                <div class="terminal__message" v-for="{ type, message } in log">
                    <span class="terminal__sign">{{ type === 'out' ? '>' : '<' }}</span>
                    <span class="terminal__text">{{ message }}</span>
                </div>
                <div class="terminal__input-wrapper">
                    <span class="terminal__sign">></span>
                    <input type="text" spellcheck="false" v-model="command" ref="terminal-input" class="terminal__input"
                           @keydown.enter="sendCommand" @keydown.tab.prevent="autocomplete" @keydown.up="historyPrevious" @keydown.down="historyNext">
                    <input type="text" spellcheck="false" v-model="autocompleteSuggestion" class="terminal__autocomplete">
                </div>
            </div>
        </div>
    </main>
</template>

<script>
  import { command } from '../utils/http';

  const asfCommands = ASF_COMMANDS;

  asfCommands.push({
    command: 'commands',
    description: 'Prints available commands'
  });

  const helpCommand = asfCommands.find(({ command }) => command === 'help');
  helpCommand.command = 'help <Command>';

  const commands = asfCommands.map(({ command }) => command.split(' ')[0]);
  const commandParameters = asfCommands.map(({ command }) => command.split(' '))
    .map(([command, ...params]) => ({ command, params }))
    .reduce((commandParameters, { command, params }) => (commandParameters[command] = params, commandParameters), {});

  export default {
    name: 'commands',
    metaInfo: { title: 'Commands' },
    components: {},
    data() {
      return {
        command: '',
        log: [],
        commandHistory: [],
        commandHistoryIndex: -1
      };
    },
    computed: {
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

          return this.command.replace(/./g, ' ') +
            (this.currentParameterValue.length ? ' ' : '') +
            this.suggestedParameters.slice(this.currentParameterValue.length ? this.currentParameterIndex : this.currentParameterIndex - 1).join(' ');
        }
      },
      suggestedCommand() {
        if (!this.command.length) return;
        return commands.find(command => command.startsWith(this.command));
      },
      suggestedParameters() {
        if (this.selectedCommand && commandParameters[this.selectedCommand])
          return commandParameters[this.selectedCommand];

        return [];
      },
      currentParameterIndex() {
        return this.command.split(' ').length - 1;
      },
      currentParameter() {
        return this.suggestedParameters[this.currentParameterIndex - 1];
      },
      currentParameterValue() {
        return this.command.split(' ')[this.currentParameterIndex];
      },
      suggestedParameterValue() {
        if (!this.currentParameterValue || !this.currentParameterValue.length) return;

        switch (this.currentParameter) {
          case '<Bot>':
          case '<Bots>':
            const suggestedBot = [...this.$store.getters['status/bots'].map(bot => bot.name), 'ASF']
              .find(name => name.startsWith(this.currentParameterValue));

            if (suggestedBot) return suggestedBot;

            return [...this.$store.getters['status/bots'].map(bot => bot.name), 'ASF']
              .find(name => name.toLowerCase().startsWith(this.currentParameterValue.toLowerCase()));
          case '<Command>':
            return commands.find(name => name.startsWith(this.currentParameterValue));
        }
      },
      selectedCommand() {
        return commands.find(command => command === this.command.split(' ')[0]);
      }
    },
    methods: {
      async sendCommand() {
        const commandToExecute = this.command.trim();
        this.command = '';

        if (!commandToExecute) return;

        this.commandHistoryIndex = -1;
        this.commandHistory.unshift(commandToExecute);
        this.commandHistory.slice(0, 20);

        this.log.push({ type: 'out', message: commandToExecute });
        const result = await this.executeCommand(commandToExecute);
        this.log.push({ type: 'in', message: result });
      },
      async executeCommand(commandToExecute) {
        switch(commandToExecute.split(' ')[0]) {
          case 'commands':
            return `Available commands: ${commands.join(', ')}`;
          case 'help':
            if (commandToExecute.split(' ')[1]) return this.commandHelp(commandToExecute.split(' ')[1]);
            return 'Usage: help <Command>, available commands: commands';
        }

        return command(commandToExecute)
      },
      commandHelp(command) {
        const asfCommand = asfCommands.find(asfCommand => asfCommand.command.split(' ')[0] === command);
        if (asfCommand) return asfCommand.description;
        return `There's no help text for ${command} yet!`;
      },
      focusInput() {
        this.$refs['terminal-input'].focus();
      },
      autocomplete() {
        if (!this.selectedCommand) this.command = this.suggestedCommand;
        if (this.selectedCommand && this.suggestedParameterValue) this.command = this.command.split(' ').slice(0, -1).join(' ') + ' ' + this.suggestedParameterValue;
      },
      historyPrevious() {
        if (this.commandHistoryIndex + 1 < this.commandHistory.length) {
          this.commandHistoryIndex++;
          this.command = this.commandHistory[this.commandHistoryIndex];
        }
      },
      historyNext() {
        if (this.commandHistoryIndex > 0) {
          this.commandHistoryIndex--;
          this.command = this.commandHistory[this.commandHistoryIndex];
        } else if (this.commandHistoryIndex === 0) {
          this.commandHistoryIndex = -1;
          this.command = '';
        }
      }
    },
    watch: {
      commandHistory(value) {
        localStorage.setItem('command-history', JSON.stringify(value));
      },
      log() {
        this.$nextTick(() => {
          this.$refs.terminal.scrollTop = Math.max(0, this.$refs.terminal.scrollHeight - this.$refs.terminal.clientHeight);
        });
      }
    },
    created() {
      const commandHistory = localStorage.getItem('command-history');
      if (commandHistory) this.commandHistory = JSON.parse(commandHistory);
    },
    mounted() {
      this.$refs['terminal-input'].focus();
    }
  };
</script>

<style lang="scss">
    .commands {
        display: grid;
        grid-template-rows: auto 1fr;

        > div {
            min-height: 0;
        }
    }
</style>