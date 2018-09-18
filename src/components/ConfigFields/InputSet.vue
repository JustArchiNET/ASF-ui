<template>
    <div class="form-item">
        <label class="form-item__label" :for="field">
            {{ label }}
            <span v-if="required" class="form-item__required">*</span>
            <span v-if="description" class="form-item__description">{{ description }}</span>
        </label>

        <template v-if="isEnum">
            <div class="input-option__items">
                <button v-for="(item, index) in value" class="button input-option__item" @click.prevent="removeElement(index)">{{ resolveOption(item) }}</button>
            </div>

            <div class="input-option__field">
                <select class="form-item__input" v-model="element" :id="field" :disabled="!availableEnumValues.length">
                    <option v-for="(enumValue, name) in enumValues" :value="enumValue" v-show="!value.includes(enumValue)">
                        {{ name }}
                    </option>
                    <option v-if="!availableEnumValues.length" :value="undefined" disabled>All values selected</option>
                </select>

                <button class="button" @click.prevent="addElement">Add</button>
            </div>
        </template>

        <template v-if="isString || isNumber">
            <div class="form-item__input form-item__input--tag-wrapper" :class="{ 'form-item__input--focus': focus }">
                <button v-for="(item, index) in value" class="form-item__tag" @click.prevent="removeElement(index)">
                    {{ resolveOption(item) }} <font-awesome-icon class="form-item__tag-remove" icon="times"></font-awesome-icon>
                </button>
                <input class="form-item__input form-item__input--tag" type="text" @keydown="onKeyDown" @focus="onFocus" @blur="onBlur" v-model="element">
            </div>
        </template>
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
        focus: false,
        element: ''
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
        if (this.value.includes(this.element)) return;

        this.value.push(this.element);
        this.element = this.getDefaultElement();
      },
      removeElement(index) {
        this.value.splice(index, 1);
        this.element = this.getDefaultElement();
      },
      resolveOption(value) {
        if (!this.isEnum) return value;
        return Object.keys(this.enumValues).find(key => this.enumValues[key] === value);
      },
      onKeyDown($event) {
        const charCode = ($event.which) ? $event.which : $event.keyCode;

        if (charCode === 13 || charCode === 9) {
          this.addElement();
          return $event.preventDefault();
        }

        if (charCode === 8 && (!this.element || !this.element.length)) {
          this.value.splice(-1);
          return $event.preventDefault();
        }

        if (this.isNumber) {
          if (charCode > 31 && (charCode < 48 || charCode > 57)) return $event.preventDefault();
          return true;
        }
      },
      onFocus() {
        this.focus = true;
      },
      onBlur() {
        this.focus = false;
      }
    }
  };
</script>
