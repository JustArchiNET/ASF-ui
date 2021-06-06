<template>
  <div class="overview">
    <span>{{ selectedBots }}</span>

    <p>Config values that will be changed:</p>

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
  export default {
    name: 'EditorOverview',
    props: {
      saving: { type: Boolean, default: false },
      selectedBotNames: { type: Array },
      config: { type: String },
    },
    computed: {
      selectedBots() {
        return `Selected bots: ${this.selectedBotNames.join(', ')}`;
      },
      prettyConfig() {
        return JSON.stringify(JSON.parse(this.config), null, 2);
      },
    },
  };
</script>

<style lang="scss">
</style>
