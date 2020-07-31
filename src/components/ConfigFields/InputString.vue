<template>
  <div class="form-item">
    <input-label :label="label" :has-description="hasDescription"></input-label>

    <div class="form-item__value">
      <input :id="field" v-model="value" class="form-item__input" type="text" :name="field" :placeholder="placeholder" @keypress="onKeyPress">
      <span v-if="hasErrors" class="form-item__error">{{ errorText }}</span>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'input-string',
    mixins: [Input],
    methods: {
      onKeyPress($event) {
        if (this.schema.type !== 'uint64') return true;

        const charCode = $event.which ? $event.which : $event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) return $event.preventDefault();
        return true;
      },
    },
  };
</script>
