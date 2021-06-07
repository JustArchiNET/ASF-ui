<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ $t('mass-editor-check', { n: selectedBots.length, nn: selectedConfigProperties.length }) }}

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
        <button class="button button--confirm" @click="$emit('save')">
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
      saving: { type: Boolean, default: false },
      config: { type: Object },
      selectedBots: { type: Array },
      selectedConfigProperties: { type: Array },
    },
    computed: {
      prettyConfig() {
        return JSON.stringify(this.config, null, 2);
      },
    },
  };
</script>

<style lang="scss">
  p:first-of-type {
    margin-top: 0;
  }
</style>
