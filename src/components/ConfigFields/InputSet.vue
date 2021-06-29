<template>
  <div class="form-item">
    <input-label :label="label" :hasDescription="hasDescription"></input-label>

    <div class="form-item__value">
      <select :id="field" v-model="selectedElement" class="form-item__input" :disabled="!availableEnumValues.length" @change="addElement($event.target.value)">
        <option :value="null" disabled selected hidden>{{ $t('input-select-enum-value') }}</option>
        <option v-for="(enumValue, name) in enumValues" v-show="!value.includes(enumValue)" :key="name" :value="enumValue">
          {{ name }}
        </option>
        <option v-if="!availableEnumValues.length" :value="undefined" disabled>
          {{ $t('input-all-selected') }}
        </option>
      </select>

      <div class="input-option__items">
        <button v-for="(item, index) in value" :key="index" class="button input-option__item" @click.prevent="removeElement(item)">
          {{ resolveOption(item) }}
        </button>
      </div>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'InputSet',
    mixins: [Input],
    data() {
      return {
        selectedElement: null,
      };
    },
    computed: {
      availableEnumValues() {
        const availableEnumValues = [];

        Object.keys(this.enumValues).forEach(key => {
          if (this.value.includes(this.enumValues[key])) return;
          availableEnumValues.push(this.enumValues[key]);
        });

        return availableEnumValues;
      },
      enumValues() {
        return this.schema.values.values;
      },
    },
    created() {
      this.value.sort();
    },
    methods: {
      addElement(input) {
        const parsedInput = typeof (input) !== (typeof (0)) ? parseInt(input, 10) : input;

        if (this.value.includes(parsedInput)) return;

        this.value.push(parsedInput);
        this.value.sort();

        this.selectedElement = null;
      },
      removeElement(input) {
        if (typeof (input) !== (typeof (0))) {
          input = parseInt(input);
        }

        this.value = this.value.filter(item => item !== input);
      },
      resolveOption(value) {
        return Object.keys(this.enumValues).find(key => this.enumValues[key] === value);
      },
    },
  };
</script>
