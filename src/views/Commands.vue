<template>
    <main class="main-container main-container--fullheight commands">
        <h2 class="title">Commands</h2>

        <div class="container container--fullheight">
            <div class="terminal" @click="focusInput">
                <div class="terminal__message" v-for="{ type, message } in log">
                    <span class="terminal__sign">{{ type === 'out' ? '>' : '<' }}</span>
                    <span class="terminal__text">{{ message }}</span>
                </div>
                <div class="terminal__input">
                    <span class="terminal__sign">></span>
                    <input type="text" spellcheck="false" v-model="command" ref="terminal-input"
                           @keydown.enter="sendCommand" @keydown.tab.prevent="autocomplete">
                    <span class="terminal__autocomplete"><span>{{ command }}</span>{{ autocompleteSuggestion }}</span>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
  import { command } from '../utils/http';

  const commands = [
    '2fa', '2fano', '2faok', 'addlicense', 'bl', 'bladd', 'blrm', 'exit', 'farm', 'help', 'input', 'ib', 'ibadd',
    'ibrm', 'iq', 'iqadd', 'iqrm', 'loot', 'loot@', 'loot^', 'loot&', 'nickname', 'owns', 'password', 'pause', 'pause~',
    'pause&', 'play', 'privacy', 'redeem', 'redeem^', 'rejoinchat', 'restart', 'resume', 'start', 'stats', 'status',
    'stop', 'transfer', 'unpack', 'update', 'version'
  ];

  const commandParameters = {
    '2fa': ['bot'],
    '2fano': ['bot'],
    '2faok': ['bot'],
    addlicense: ['id'],
    bladd: ['appid'],
    blrm: ['appid'],
    farm: ['appid'],
    loot: ['bot'],
    nickname: ['bot', 'name'],
    password: ['bot'],
    pause: ['bot'],
    play: ['appid'],
    redeem: ['key'],
    resume: ['bot'],
    start: ['bot'],
    status: ['bot'],
    stop: ['bot'],
    transfer: ['bot', 'type', 'bot'],
    unpack: ['bot']
  };

  export default {
    name: 'commands',
    components: {},
    data() {
      return {
        command: '',
        log: []
      };
    },
    computed: {
      autocompleteSuggestion() {
        if (this.suggestedCommand) return this.suggestedCommand.substr(this.command.length);

        if (this.selectedCommand) {
          if (!this.suggestedParameters || !this.suggestedParameters.length) return;

          if (this.suggestedParameterValue) {
            return [
              this.suggestedParameterValue.slice(this.currentParameterValue.length),
              ...this.suggestedParameters.slice(this.currentParameterIndex)
            ].join(' ');
          }

          return ' ' + this.suggestedParameters.slice(this.currentParameterValue.length ? this.currentParameterIndex : this.currentParameterIndex - 1).join(' ');
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
          case 'bot':
            return this.$store.getters['status/bots'].map(bot => bot.name).find(name => name.startsWith(this.currentParameterValue));
        }
      },
      selectedCommand() {
        return commands.find(command => command === this.command.split(' ')[0]);
      }
    },
    methods: {
      async sendCommand() {
        const commandToSend = this.command.trim();
        this.command = '';

        if (!commandToSend) return;

        this.log.push({ type: 'out', message: commandToSend });
        const result = await command(commandToSend);

        this.log.push({ type: 'in', message: result });
      },
      focusInput() {
        this.$refs['terminal-input'].focus();
      },
      autocomplete() {
        if (!this.selectedCommand) this.command = this.suggestedCommand;
        if (this.selectedCommand && this.suggestedParameterValue) this.command += this.suggestedParameterValue.slice(this.currentParameterValue.length);
      }
    }
  };
</script>

<style lang="scss">
    .commands {
        display: grid;
        grid-template-rows: auto 1fr;
    }
</style>