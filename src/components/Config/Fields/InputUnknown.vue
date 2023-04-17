<template>
  <div class="form-item">
    <input-label :label="label" :hasDescription="hasDescription"></input-label>

    <div class="form-item__value">
      <span class="input-unknown">{{ $t('input-unknown-type') }}</span>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'InputUnknown',
    mixins: [Input],
  };
</script>

<style lang="scss">
  .input-unknown {
    color: var(--color-theme);
    font-weight: 600;
  }
</style>
