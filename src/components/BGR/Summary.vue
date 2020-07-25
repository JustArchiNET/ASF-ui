<template>
  <div class="bgr__summary">
    <h3 class="subtitle bgr__summary-title">
      {{ title }}
    </h3>

    <div class="form-item">
      <bgr-keys :keys="keys"></bgr-keys>
    </div>

    <div class="form-item">
      <div class="form-item__buttons form-item__buttons--center">
        <button v-if="!noKeys" class="button button--confirm" @click="copyKeys">
          {{ $t('keys-copy') }}
        </button>
        <button :key="'back'" class="button button--confirm" @click="$emit('back')">
          {{ $t('back') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import * as copy from 'copy-to-clipboard';
  import BgrKeys from './Keys.vue';

  export default {
    name: 'bgr-summary',
    components: { BgrKeys },
    props: {
      keys: Object,
      title: String,
    },
    computed: {
      noKeys() {
        return Object.keys(this.keys).length === 0;
      },
    },
    methods: {
      copyKeys() {
        let keys = '';

        for (const key in this.keys) {
          if (this.keys.hasOwnProperty(key)) {
            keys += `${this.keys[key]}\t${key}\n`;
          }
        }

        copy(keys);
        this.$info(this.$t('keys-copied'));
      },
    },
  };
</script>

<style lang="scss">
	.bgr__summary-title {
		margin-bottom: 0.5em;
	}
</style>
