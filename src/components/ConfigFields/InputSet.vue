<template>
    <div class="form-item">
        <label class="form-item__label" :for="field">
            {{ label }}
            <span v-if="required" class="form-item__required">*</span>
            <span v-if="description" class="form-item__description">{{ description }}</span>
        </label>

        <div class="input-option__items">
            <button v-for="(item, index) in value" class="button input-option__item" @click.prevent="removeElement(index)">{{ resolveOption(item) }}</button>
        </div>

        <div class="input-option__field">
            <select class="form-item__input" v-model="element" :id="field" v-if="isEnum" :disabled="!availableEnumValues.length">
                <option v-for="(enumValue, name) in enumValues" :value="enumValue" v-show="!value.includes(enumValue)">
                    {{ name }}
                </option>
                <option v-if="!availableEnumValues.length" :value="undefined" disabled>All values selected</option>
            </select>

            <input class="form-item__input" type="text" :id="field" :name="field" :placeholder="placeholder"
                   v-model="element" @keydown.enter="addElement" v-else-if="isString">

            <input class="form-item__input" type="number" :id="field" :name="field" :placeholder="placeholder"
                   v-model.number="element" @keydown.enter="addElement" v-else-if="isNumber">
            <button class="button" @click.prevent="addElement">Add</button>
        </div>
    </div>
</template>

<script>
  import { each } from 'lodash';
  import Input from './Input.vue';

  export default {
    mixins: [Input],
    name: 'input-set',
    computed: {
      isEnum() {
        return this.schema.values.type === 'enum';
      },
      isString() {
        return ['string', 'bigNumber'].includes(this.schema.values.type);
      },
      isNumber() {
        return ['number', 'smallNumber'].includes(this.schema.values.type);
      },
      availableEnumValues() {
        const availableEnumValues = [];

        for (const name in this.enumValues) {
          if (!Object.prototype.hasOwnProperty.call(this.enumValues, name)) continue;
          if (this.value.includes(this.enumValues[name])) continue;
          availableEnumValues.push(this.enumValues[name]);
        }

        return availableEnumValues;
      },
      enumValues() {
        if (!this.isEnum) return;
        return this.schema.values.values;
      }
    },
    data() {
      return {
        element: null
      };
    },
    created() {
      this.element = this.getDefaultElement();
    },
    methods: {
      getDefaultElement() {
        if (this.isEnum) return this.availableEnumValues[0];
        return null;
      },
      addElement() {
        if (!this.element && this.element !== 0) return;

        if (!this.value.includes(this.element)) {
          this.value.push(this.element);
        }

        this.element = this.getDefaultElement();
      },
      removeElement(index) {
        this.value.splice(index, 1);
        this.element = this.getDefaultElement();
      },
      resolveOption(value) {
        if (!this.isEnum) return value;
        return Object.keys(this.enumValues).find(key => this.enumValues[key] === value);
      }
    }
  };
</script>
