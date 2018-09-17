<template>
    <div class="form-item">
        <label class="form-item__label" :for="field">
            {{ label }}
            <span v-if="required" class="form-item__required">*</span>
            <span v-if="description" class="form-item__description">{{ description }}</span>
        </label>
        <select class="form-item__input" :name="field" :id="field" :required="required" v-model="value">
            <option v-for="(enumValue, name) in values" :value="enumValue">{{ name }}</option>
        </select>
    </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    mixins: [Input],
    name: 'InputEnum',
    computed: {
      values() {
        const values = {};

        for (const name in this.schema.values) {
          if (!Object.prototype.hasOwnProperty.call(this.schema.values, name)) continue;
          values[name] = parseInt(this.schema.values[name])
        }

        return values;
      }
    }
  };
</script>
