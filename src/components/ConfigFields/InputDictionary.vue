<template>
  <div class="form-item">
    <input-label :label="label" :has-description="hasDescription"></input-label>

    <div class="form-item__value">
      <div class="input-option__field input-option__field--three">
        <input :id="`${field}-key`" v-model="elementKey" class="form-item__input" type="text" @keydown.enter="addElement">

        <select :id="`${field}-value`" v-model="elementValue" class="form-item__input">
          <option v-for="{ label, value } in availableEnumValues" :value="value">{{ label }}</option>
        </select>

        <button class="button" @click.prevent="addElement">{{ $t('add') }}</button>
      </div>

      <div class="input-option__items">
        <button v-for="(keyValue, key) in value" class="button input-option__item" @click.prevent="removeElement(key)">{{ key }} => {{ resolveValue(keyValue) }}</button>
      </div>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'input-dictionary',
    mixins: [Input],
    data() {
      return {
        elementKey: null,
        elementValue: null,
      };
    },
    computed: {
      availableEnumValues() {
        return this.enumValues;
      },
      enumValues() {
        return Object.entries(this.schema.additionalProperties['x-definition']).map(([label, value]) => ({ label, value }));
      },
      resolveValue() {
        return value => {
          const enumValue = this.enumValues.find(({ value: enumValue }) => value === enumValue);
          if (!enumValue) return value;
          return enumValue.label;
        };
      },
    },
    created() {
      this.elementKey = this.getDefaultKey();
      this.elementValue = this.getDefaultValue();
    },
    methods: {
      getDefaultKey() {
        return null;
      },
      getDefaultValue() {
        return this.availableEnumValues[0].value;
      },
      addElement() {
        if ((!this.elementValue && this.elementValue !== 0) || (!this.elementKey && this.elementKey !== 0)) return;

        this.$set(this.value, this.elementKey, this.elementValue);
        this.elementValue = this.getDefaultValue();
        this.elementKey = this.getDefaultKey();
      },
      removeElement(key) {
        this.$delete(this.value, key);
      },
    },
  };
</script>
