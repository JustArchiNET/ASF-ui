<template>
  <div class="overview">
    <p>{{ selectedBots }}</p>

    <p>{{ selectedConfigValues }}</p>

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
      selectedConfigValues() {
        return `Config values that will be changed: ${this.config}`;
      },
    },
    mounted() {
      const test = JSON.stringify(this.config, null, 4);
      console.log(test);
    },
  };
</script>

<style lang="scss">
</style>
