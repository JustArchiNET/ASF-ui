<template>
  <div class="overview">
    <p>{{ $t('mass-editor-check-bots') }}</p>

    <MassEditorBots :bots="selectedBots" :selectable="false"></MassEditorBots>

    <p>{{ $t('mass-editor-check-values') }}</p>

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
      config: { type: String },
      selectedBots: { type: Array },
    },
    computed: {
      prettyConfig() {
        return JSON.stringify(JSON.parse(this.config), null, 2);
      },
    },
  };
</script>

<style lang="scss">
  p:first-of-type {
    margin-top: 0;
  }
</style>
