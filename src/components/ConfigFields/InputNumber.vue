<template>
    <div class="form-item">
        <label class="form-item__label" :for="field">
            {{ label }}
            <span v-if="required" class="form-item__required">*</span>
            <span v-if="description" class="form-item__description">{{ description }}</span>
        </label>
        <input class="form-item__input" type="number" :name="field" :id="field" :placeholder="placeholder" :required="required" :class="{ error: invalid }"
               v-model.number="value" @blur="onBlur">
        <span v-if="invalid" class="form-item__error">{{ errors.join(' ') }}</span>
    </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    mixins: [Input],
    name: 'input-number',
    computed: {
      errors() {
        return this.validate(this.value);
      },
      valid() {
        return this.errors.length === 0;
      },
      invalid() {
        return this.errors.length !== 0;
      }
    },
    methods: {
      onBlur() {
        if (this.value === '') this.value = this.defaultValue;
      }
    }
  };
</script>
