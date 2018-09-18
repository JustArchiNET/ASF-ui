<template>
    <div class="form-item">
        <label :for="field" class="checkbox" @click.self="value = !value">
            <button class="button button--small" :class="{ 'button--active': !value }" @click.prevent="value = false">✖</button>
            <button class="button button--small" :class="{ 'button--active': value }" @click.prevent="value = true">✔</button>
            {{ label }}
            <span v-if="required" class="req">*</span>
        </label>
    </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    mixins: [Input],
    name: 'input-boolean'
  };
</script>
