<template>
  <div class="form-item">
    <input-label :label="label" :has-description="hasDescription"></input-label>

    <div class="form-item__value">
      <div class="input-option__field">
        <select :id="field" v-model="element" class="form-item__input" :disabled="!availableEnumValues.length">
          <option v-for="{ label, value } in availableEnumValues" :value="value">{{ label }}</option>
          <option v-if="!availableEnumValues.length" :value="null" disabled>{{ $t('input-all-selected') }}</option>
        </select>

        <button class="button" @click.prevent="addElement">
          {{ $t('add') }}
        </button>
      </div>

      <div class="input-option__items">
        <button v-for="(item, index) in value" class="button input-option__item" @click.prevent="removeElement(index)">
          {{ resolveValue(item) }}
        </button>
      </div>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'input-set',
    mixins: [Input],
    data() {
      return {
        element: null,
      };
    },
    computed: {
      availableEnumValues() {
        return this.enumValues.filter(({ value }) => !this.value.includes(value));
      },
      enumValues() {
        return Object.entries(this.schema.items['x-definition']).map(([label, value]) => ({ label, value }));
      },
      resolveValue() {
        return (value) => {
          const enumValue = this.enumValues.find(({ value: enumValue }) => value === enumValue);
          if (!enumValue) return value;
          return enumValue.label;
        };
      },
    },
    created() {
      this.value.sort();
      this.element = this.getDefaultElement();
    },
    methods: {
      getDefaultElement() {
        return this.availableEnumValues[0] ? this.availableEnumValues[0].value : null;
      },
      addElement() {
        if (!this.element && this.element !== 0) return;
        if (this.value.includes(this.element)) return;

        this.value.push(this.element);
        this.value.sort();

        this.element = this.getDefaultElement();
      },
      removeElement(index) {
        this.value.splice(index, 1);
        this.element = this.getDefaultElement();
      },
    },
  };
</script>
