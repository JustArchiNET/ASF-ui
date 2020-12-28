<template>
  <div v-if="usedKeysCount || unusedKeysCount" class="bgr__status form-item">
    <div class="form-item__buttons form-item__buttons--center">
      <button class="button" @click="$emit('show-used')">
        {{ $t('bgr-used-keys-count', { count: usedKeysCount }) }}
      </button>
      <button class="button" @click="$emit('show-unused')">
        {{ $t('bgr-unused-keys-count', { count: unusedKeysCount }) }}
      </button>
      <button class="button" @click="$emit('reset')">
        {{ $t('reset') }}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BgrStatus',
    props: {
      usedKeys: Object,
      unusedKeys: Object,
    },
    computed: {
      unusedKeysCount() {
        return Object.keys(this.unusedKeys).length;
      },
      usedKeysCount() {
        return Object.keys(this.usedKeys).length;
      },
    },
  };
</script>

<style lang="scss">
	.bgr__status {
		color: var(--color-text-disabled);
		margin: 0.5em 0 1em;
	}
</style>
