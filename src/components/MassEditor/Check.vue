<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ $t('mass-editor-check', { n: selectedBots.length, nn: selectedProperties.length }) }}

      <div class="mass-editor__navigation pull-right">
        <button v-if="!saving" class="button" @click="$emit('back')">
          {{ $t('back') }}
        </button>
      </div>
    </div>

    <div class="mass-editor__content">
      <p>{{ $t('mass-editor-check-bots', { n: selectedBots.length }) }}</p>

      <BotsView
        :selectedBots="selectedBots"
        :selectable="false"
        :bots="selectedBots"
      ></BotsView>

      <p>{{ $t('mass-editor-check-values', { n: Object.keys(config).length }) }}</p>

      <pre><code>{{ prettyConfig }}</code></pre>

      <div class="form-item">
        <button class="button button--confirm" @click="onSave">
          <FontAwesomeIcon v-if="saving" icon="spinner" spin></FontAwesomeIcon>
          <span v-else>{{ $t('save') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import BotsView from './partials/BotsView.vue';

  export default {
    name: 'MassEditorCheck',
    components: {
      BotsView,
    },
    props: {
      config: { type: Object },
      selectedBots: { type: Array },
      selectedProperties: { type: Array },
    },
    data() {
      return {
        saving: false,
      };
    },
    computed: {
      prettyConfig() {
        return JSON.stringify(this.config, null, 2);
      },
    },
    methods: {
      async onSave() {
        if (this.saving) return;

        this.saving = true;

        // eslint-disable-next-line no-restricted-syntax
        for (const bot of this.selectedBots) {
          await this.saveConfigForBot(this.config, bot);
        }

        this.$success(this.$t('mass-editor-check-saved'));
        this.saving = false;
      },
      async saveConfigForBot(config, bot) {
        try {
          // fetch current bot config
          const { [bot.name]: { BotConfig: oldConfig } } = await this.$http.get(`bot/${bot.name}`);

          // we do not want to save identical config
          if (this.isSameConfig(config, oldConfig)) return;

          // overwrite current bot config with new one
          const botConfig = { ...oldConfig, ...config };

          await this.$http.post(`bot/${bot.name}`, { botConfig });
        } catch (err) {
          this.$error(err.message);
        }
      },
      isSameConfig(newConfig, oldConfig) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [property] of Object.entries(newConfig)) {
          const found = oldConfig[property] === newConfig[property];
          if (found) return true;
        }

        return false;
      },
    },
  };
</script>

<style lang="scss">
  p:first-of-type {
    margin-top: 0;
  }
</style>
