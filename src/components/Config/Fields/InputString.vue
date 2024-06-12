<template>
  <div class="form-item">
    <input-label :label="label" :hasDescription="hasDescription"></input-label>

    <div class="form-item__value">
      <input :id="field" v-model="value" class="form-item__input" :type="fieldType" :name="field" :placeholder="placeholder" @focus="onFocus" @blur="onBlur" @keypress="onKeyPress">
      <span v-if="hasErrors" class="form-item__error">{{ errorText }}</span>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'InputString',
    mixins: [Input],
    data() {
      return {
        active: false,
      };
    },
    computed: {
      fieldType() {
        if (this.sensitive && !this.active) {
          return 'password';
        }

        return 'text';
      },
    },
    methods: {
      onFocus() {
        this.active = true;
      },
      onBlur() {
        this.active = false;
        if (this.value === '') this.value = this.defaultValue;
      },
      onKeyPress($event) {
        this.active = true;

        if (this.schema.type !== 'uint64') return true;

        const charCode = ($event.which) ? $event.which : $event.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) return $event.preventDefault();
        return true;
      },
    },
  };
</script>
