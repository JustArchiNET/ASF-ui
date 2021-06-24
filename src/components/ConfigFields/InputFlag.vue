<template>
  <div class="form-item input-option">
    <input-label :label="label" :hasDescription="hasDescription"></input-label>

    <div class="form-item__value">
      <select :id="field" v-model="selectedElement" class="form-item__input" @change="addFlag($event.target.value)">
        <!-- TODO - add that text to localization instead of hardcoding it -->
        <option :value="null" disabled selected hidden>Select Option</option>
        <option v-for="(enumValue, name) in flags" v-show="enumValue === 0 || !((value & enumValue) === enumValue)" :key="name" :value="enumValue">
          {{ name }}
        </option>
      </select>

      <div class="input-option__items">
        <button v-for="enumValue in getSelectedFlagValues()" :key="enumValue" class="button input-option__item" @click.prevent="removeFlag(enumValue)">
          {{ resolveFlagName(enumValue) }}
        </button>
      </div>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'InputFlag',
    mixins: [Input],
    data() {
      return {
        selectedElement: null,
      };
    },
    computed: {
      flags() {
        return this.schema.values;
      },
    },
    methods: {
      getSelectedFlagValues() {
        return [...Array(32).keys()].map(i => 1 << i).filter(val => this.value & val);
      },
      addFlag(input) {
        if (typeof (input) !== typeof (0)) {
          input = parseInt(input, 10);
        }

        if (!input && input !== 0) return;

        if (input === 0) {
          this.value = 0;
        } else {
          this.value |= input;
        }

        this.selectedElement = null;
      },
      removeFlag(value) {
        this.value &= ~value;
      },
      resolveFlagName(value) {
        return Object.keys(this.flags).find(key => this.flags[key] === value);
      },
    },
  };
</script>
