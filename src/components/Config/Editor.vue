<template>
  <div class="config-editor">
    <template v-if="nonEmptyCategories">
      <ConfigCategory v-for="category in nonEmptyCategories" :key="category.name" :name="category.name">
        <component :is="componentFromField(field)" v-for="field in categoryFields(category.name)" :key="field.param" class="form-item--config" :schema="field" :currentValue="model[field.paramName]" @update="updateModel"></component>
      </ConfigCategory>

      <ConfigCategory v-if="uncategorizedFields.length" key="Other" :name="$t('other')">
        <component :is="componentFromField(field)" v-for="field in uncategorizedFields" :key="field.param" class="form-item--config" :schema="field" :currentValue="model[field.paramName]" @update="updateModel"></component>
      </ConfigCategory>
    </template>

    <template v-if="!nonEmptyCategories">
      <fieldset class="config-uncategorized">
        <component :is="componentFromField(field)" v-for="field in uncategorizedFields" :key="field.param" class="form-item--config" :schema="field" :currentValue="model[field.paramName]" @update="updateModel"></component>
      </fieldset>
    </template>
  </div>
</template>

<script>
  import InputString from './Fields/InputString.vue';
  import InputBoolean from './Fields/InputBoolean.vue';
  import InputNumber from './Fields/InputNumber.vue';
  import InputFlag from './Fields/InputFlag.vue';
  import InputSet from './Fields/InputSet.vue';
  import InputList from './Fields/InputList.vue';
  import InputTag from './Fields/InputTag.vue';
  import InputEnum from './Fields/InputEnum.vue';
  import InputDictionary from './Fields/InputDictionary.vue';
  import InputUnknown from './Fields/InputUnknown.vue';
  import ConfigCategory from './Category.vue';

  export default {
    name: 'ConfigEditor',
    components: { ConfigCategory },
    props: {
      fields: {
        type: Array,
        required: true,
      },
      model: {
        type: Object,
        required: true,
      },
      categories: Array,
      descriptions: Object,
      extendedFields: Object,
      deleteDefaultValues: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    computed: {
      nonEmptyCategories() {
        if (!this.categories) return this.categories;

        return this.categories.filter(category => this.categoryFields(category.name).length);
      },
      uncategorizedFields() {
        if (!this.categories) return this.fields;

        const categorizedFields = this.categories.map(category => category.fields).reduce((categorizedFields, categoryFields) => [...categorizedFields, ...categoryFields], []);

        return this.fields.filter(field => !categorizedFields.includes(field.param));
      },
      categoryFields() {
        return categoryName => {
          if (!this.categories) return [];
          const category = this.categories.find(({ name }) => name === categoryName);
          if (!category) return [];
          return this.getFields(category.fields).sort((a, b) => category.fields.indexOf(a.paramName) - category.fields.indexOf(b.paramName));
        };
      },
      isValid() {
        return this.$children.every(child => child.isValid);
      },
    },
    mounted() {
      window.addEventListener('resize', this.computeLabelWidth);
      this.computeLabelWidth();
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.computeLabelWidth);
    },
    methods: {
      componentFromField(field) {
        switch (field.type) {
          case 'string':
          case 'uint64':
            return InputString;
          case 'boolean':
            return InputBoolean;
          case 'uint32':
          case 'uint16':
          case 'byte':
            return InputNumber;
          case 'flag':
            return InputFlag;
          case 'enum':
            return InputEnum;
          case 'hashSet':
          case 'list':
            if (['enum'].includes(field.values.type)) return (field.type === 'list') ? InputList : InputSet;
            if (['byte', 'uint16', 'uint32', 'uint64', 'string'].includes(field.values.type)) return InputTag;
            return InputUnknown;
          case 'dictionary':
            return InputDictionary;
          default:
            return InputUnknown;
        }
      },
      updateModel(value, field) {
        const fieldSchema = this.fields.find(fieldSchema => fieldSchema.paramName === field);
        const defaultCheck = this.deleteDefaultValues && fieldSchema && typeof fieldSchema.defaultValue !== 'undefined' && this.isDefault(value, fieldSchema);

        if (defaultCheck) {
          delete this.model[field];
        } else if (this.model[field] && this.model[field].constructor === Array && fieldSchema.type !== 'dictionary') {
          // eslint-disable-next-line vue/no-mutating-props
          this.model[field] = value.sort((a, b) => a - b);
        } else if (this.model[field] && this.model[field].constructor === Object && fieldSchema.type !== 'dictionary') {
          // eslint-disable-next-line vue/no-mutating-props
          this.model[field] = Object.keys(value).sort((a, b) => value[a] - value[b]);
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          this.model[field] = value;
        }
      },
      isDefault(value, fieldSchema) {
        return this.isEqual(value, fieldSchema.defaultValue, fieldSchema.type);
      },
      isEqual(a, b, type) {
        if (typeof a !== typeof b) return false;

        switch (type) {
          case 'uint32':
          case 'byte':
          case 'uint16':
          case 'uint64':
          case 'string':
          case 'boolean':
            return a === b;
          case 'hashSet':
            return a.length === b.length && a.every(item => b.includes(item));
          case 'list':
            return a.length === b.length && a.every((item, index) => item === b[index]);
          case 'dictionary':
            return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => a[key] === b[key]);
            // no default
        }

        return false;
      },
      getFields(names) {
        return this.fields.filter(field => names.includes(field.param));
      },
      computeLabelWidth() {
        this.$el.style.setProperty('--label-width', 'auto');

        this.$nextTick(() => {
          const labelWidth = Math.max(...Array.from(this.$el.querySelectorAll('.form-item__label')).map(el => Math.ceil(parseFloat(getComputedStyle(el).width))));
          this.$el.style.setProperty('--label-width', `${labelWidth}px`);
        });
      },
    },
  };
</script>

<style lang="scss">
  .config-editor {
    margin-bottom: 1em;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .config-uncategorized {
    border: 0 solid var(--color-border);
    padding: 0 1em 1em;
  }
</style>
