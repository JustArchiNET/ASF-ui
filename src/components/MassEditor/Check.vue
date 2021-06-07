<template>
  <div class="overview">
    <p>{{ $t('mass-editor-check-bots', { n: selectedBots.length }) }}</p>

    <MassEditorBots :bots="selectedBots" :selectable="false"></MassEditorBots>

    <p>{{ $t('mass-editor-check-values', { n: Object.keys(config).length }) }}</p>

    <pre><code>{{ prettyConfig }}</code></pre>

    <div class="form-item">
      <button class="button button--confirm" @click="$emit('save')">
        <FontAwesomeIcon v-if="saving" icon="spinner" spin></FontAwesomeIcon>
        <span v-else>{{ $t('save') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
  import MassEditorBots from './Bots.vue';

  export default {
    name: 'MassEditorCheck',
    components: {
      MassEditorBots,
    },
    props: {
      saving: { type: Boolean, default: false },
      config: { type: Object },
      selectedBots: { type: Array },
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
