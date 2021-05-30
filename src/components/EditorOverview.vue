<template>
  <div class="overview">
    <p>Selected bots:</p>

    <p>Config values that will be changed:</p>

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
    },
  };
</script>

<style lang="scss">
</style>
