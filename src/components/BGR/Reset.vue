<template>
  <div class="bgr__reset">
    <h3 class="subtitle">
      {{ title }}
    </h3>

    <div class="form-item">
      <div class="form-item__buttons form-item__buttons--center">
        <button class="button button--cancel" @click="$emit('reset')">
          <font-awesome-icon v-if="resetting" icon="spinner" spin></font-awesome-icon>
          <span v-else>{{ $t('reset') }}</span>
        </button>

        <button :key="'cancel'" class="button button--confirm" @click="$emit('cancel')">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'bgr-reset',
    props: {
      resetting: Boolean,
      title: String,
    },
  };
</script>
