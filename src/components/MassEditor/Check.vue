<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ title }}

      <div class="mass-editor__navigation pull-right">
        <button v-if="!saving" class="button" @click="$emit('back')">
          {{ $t('back') }}
        </button>
      </div>
    </div>

    <div class="mass-editor__content">
      <p>{{ selectedBotsText }}</p>
      <BotsView :selectedBots="selectedBots" :selectable="false" :bots="selectedBots"></BotsView>

      <p>{{ selectedPropertiesText }}</p>
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
  import isSameConfig from '../../utils/isSameConfig';

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
      title() {
        return this.$t('mass-editor-check', { n: this.selectedBots.length, nn: this.selectedProperties.length });
      },
      selectedBotsText() {
        this.$t('mass-editor-check-bots', { n: this.selectedBots.length });
      },
      selectedPropertiesText() {
        return this.$t('mass-editor-check-values', { n: Object.keys(this.config).length });
      },
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

        this.$success(this.$t('mass-editor-check-saved', { n: this.selectedBots.length }));
        this.saving = false;
      },
      async saveConfigForBot(config, bot) {
        try {
          // fetch current bot config
          const { [bot.name]: { BotConfig: oldConfig } } = await this.$http.get(`bot/${bot.name}`);

          // we do not want to save identical config
          if (isSameConfig(config, oldConfig)) return;

          // overwrite current bot config with new one
          const botConfig = { ...oldConfig, ...config };

          await this.$http.post(`bot/${bot.name}`, { botConfig });
        } catch (err) {
          this.$error(err.message);
        }
      },
    },
  };
</script>

<style lang="scss">
  p:first-of-type {
    margin-top: 0;
  }
</style>
