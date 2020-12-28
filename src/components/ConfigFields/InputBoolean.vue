<template>
  <div class="form-item">
    <input-label :label="label" :has-description="hasDescription"></input-label>

    <div class="form-item__value">
      <div class="form-item__buttons">
        <button class="button" :class="{ 'button--active': value }" @click.prevent="value = true">
          ✔
        </button>
        <button class="button" :class="{ 'button--active': !value }" @click.prevent="value = false">
          ✖
        </button>
      </div>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'InputBoolean',
    mixins: [Input],
  };
</script>
