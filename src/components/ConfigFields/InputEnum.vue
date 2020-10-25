<template>
  <div class="form-item">
    <input-label :label="label" :has-description="hasDescription"></input-label>

    <div class="form-item__value">
      <select :id="field" v-model="value" class="form-item__input" :name="field">
        <option v-for="{ label, value } in enums" :value="value">{{ label }}</option>
      </select>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'input-enum',
    mixins: [Input],
    computed: {
      enums() {
        return Object.entries(this.schema['x-definition']).map(([label, value]) => ({ label, value }));
      },
    },
  };
</script>
