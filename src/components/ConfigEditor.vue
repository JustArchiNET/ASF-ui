<template>
    <div class="config-editor">
        <component v-for="field in fields" :key="field.paramName" :is="componentFromField(field)" :schema="field" @update="updateModel"></component>
    </div>
</template>

<script>
    import InputString from './ConfigFields/InputString.vue';
    import InputBoolean from './ConfigFields/InputBoolean.vue';
    import InputNumber from './ConfigFields/InputNumber.vue';
    import InputFlag from './ConfigFields/InputFlag.vue';
    import InputSet from './ConfigFields/InputSet.vue';
    import InputTag from './ConfigFields/InputTag.vue';
    import InputEnum from './ConfigFields/InputEnum.vue';
    import InputDictionary from './ConfigFields/InputDictionary.vue';
    import InputUnknown from './ConfigFields/InputUnknown.vue';

    export default {
      name: 'config-editor',
      props: {
        fields: {
          type: Array,
          required: true
        },
        model: {
          type: Object,
          required: true
        }
      },
      methods: {
        componentFromField(field) {
          switch(field.type) {
            case 'string':
            case 'bigNumber':
              return InputString;
            case 'boolean':
              return InputBoolean;
            case 'number':
            case 'smallNumber':
            case 'tinyNumber':
              return InputNumber;
            case 'flag':
              return InputFlag;
            case 'enum':
              return InputEnum;
            case 'hashSet':
              if (['enum'].includes(field.values.type)) return InputSet;
              if (['tinyNumber', 'smallNumber', 'number', 'bigNumber', 'string'].includes(field.values.type)) return InputTag;
              return InputUnknown;
            case 'dictionary':
              return InputDictionary;
            default:
              return InputUnknown;
          }
        },
        updateModel(value, field) {
          const fieldSchema = this.fields.find(fieldSchema => fieldSchema.paramName === field);

          if (fieldSchema && typeof fieldSchema.defaultValue !== 'undefined' && this.isEqual(value, fieldSchema.defaultValue)) {
            delete this.model[field];
          } else {
            this.model[field] = value;
          }
        },
        isEqual(a, b) {
          if (typeof a !== typeof b) return false;

          switch (typeof a) {
            case 'number':
            case 'string':
              return a === b;
            case 'object':
              if (Array.isArray(a) && Array.isArray(b)) {
                return a.length === b.length && a.every((item, index) => item === b[index]);
              }

              if ('' + a === '[object Object]' && '' + b === '[object Object]') {
                return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => a[key] === b[key]);
              }

              return a === b;
          }

          return false;
        }
      }
    }
</script>

<style lang="scss">
    .config-editor {

    }
</style>