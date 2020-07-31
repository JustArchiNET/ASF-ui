<template>
  <div class="form-item">
    <input-label :label="label" :has-description="hasDescription"></input-label>

    <div class="form-item__value">
      <div class="input-option__field">
        <div class="form-item__input form-item__input--tag-wrapper" :class="{ 'form-item__input--focus': focus }">
          <button v-for="(item, index) in value" class="form-item__tag" @click.prevent="removeElement(index)">
            <span class="form-item__tag-value">{{ item }}</span>
            <font-awesome-icon class="form-item__tag-remove" icon="times"></font-awesome-icon>
          </button>

          <input v-model="element" class="form-item__input form-item__input--tag" type="text" @keydown="onKeyDown" @focus="onFocus" @blur="onBlur">
        </div>

        <button class="button" @click.prevent="addElement">
          {{ $t('add') }}
        </button>
      </div>
      
      <span v-if="hasErrors" class="form-item__error">{{ errorText }}</span>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';
  import validator from '../../utils/validator';

  export default {
    name: 'input-tag',
    mixins: [Input],
    data() {
      return {
        focus: false,
        element: '',
      };
    },
    computed: {
      isString() {
        return ['string'].includes(this.schema.items.type);
      },
      isNumber() {
        return ['integer'].includes(this.schema.items.type);
      },
      errors() {
        if (validator.hasOwnProperty(this.schema.items.type)) return validator[this.schema.items.type](this.element);
        return [];
      },
      isValid() {
        return true;
      },
    },
    watch: {
      element(newValue, oldValue) {
        if (isNaN(newValue)) this.element = oldValue;
      },
    },
    methods: {
      addElement() {
        if (this.hasErrors) return;

        const element = this.isNumber ? parseInt(this.element, 10) : this.element;

        if (!element && element !== 0) return;
        if (this.value.includes(element)) return;

        this.value.push(element);
        this.element = '';
      },
      removeElement(index) {
        this.value.splice(index, 1);
        this.element = '';
      },
      onKeyDown($event) {
        const charCode = ($event.which) ? $event.which : $event.keyCode;

        if ([9, 13, 188, 32].includes(charCode)) {
          this.addElement();
          return $event.preventDefault();
        }

        if (charCode === 8 && (!this.element || !this.element.length)) {
          this.value.splice(-1);
          return $event.preventDefault();
        }
      },
      onFocus() {
        this.focus = true;
      },
      onBlur() {
        this.focus = false;
      },
    },
  };
</script>
