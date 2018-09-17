<template>
    <div class="config-editor">
        <component v-for="field in fields" :key="field.paramName" :is="componentFromType(field.type)" :schema="field" @update="updateModel"></component>
    </div>
</template>

<script>
    import InputString from './ConfigFields/InputString.vue';
    import InputBoolean from './ConfigFields/InputBoolean.vue';
    import InputNumber from './ConfigFields/InputNumber.vue';
    import InputFlag from './ConfigFields/InputFlag.vue';
    import InputSet from './ConfigFields/InputSet.vue';
    import InputEnum from './ConfigFields/InputEnum.vue';

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
        componentFromType(type) {
          switch(type) {
            case 'string':
            case 'bigNumber':
              return InputString;
            case 'boolean':
              return InputBoolean;
            case 'number':
            case 'smallNumber':
              return InputNumber;
            case 'flag':
              return InputFlag;
            case 'enum':
              return InputEnum;
            case 'hashSet':
              return InputSet;
          }
        },
        updateModel(value, field) {
          this.model[field] = value;
        }
      }
    }
</script>

<style lang="scss">
    .config-editor {

    }
</style>