<template>
    <div class="form-item input-select">
        <label class="form-item__label" :for="field">
            {{ label }}
            <span v-if="required" class="form-item__required">*</span>
            <span v-if="description" class="form-item__description">{{ description }}</span>
        </label>

        <div class="input-select__field">
            <select class="form-item__input" v-model="flagValue" :id="field">
                <option v-for="(flagValue, name) in flags" :value="flagValue" v-show="flagValue === 0 || !((value & flagValue) === flagValue)">
                    {{ name }}
                </option>
            </select>
            <button class="button" @click.prevent="addFlag">Add</button>
        </div>

        <div class="input-select__items">
            <button v-for="i in 32" v-if="value & (1 << i)" class="button input-select__item" @click.prevent="removeFlag(1 << i)">
                {{ resolveFlagName(1 << i) }}
            </button>
        </div>
    </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    mixins: [Input],
    name: 'InputFlag',
    data() {
      return {
        flagValue: this.schema.defaultValue
      };
    },
    computed: {
      flags() {
        const flags = {};

        for (const name in this.schema.values) {
          if (!Object.prototype.hasOwnProperty.call(this.schema.values, name)) continue;
          flags[name] = parseInt(this.schema.values[name])
        }

        return flags;
      }
    },
    methods: {
      addFlag(flag = this.flagValue) {
        if (!this.flagValue && this.flagValue !== 0) return;

        if (this.flagValue === 0 || this.flagValue === '0') this.value = 0;
        this.value |= this.flagValue;
        this.flagValue = this.schema.defaultValue;
      },
      removeFlag(value) {
        this.value &= ~value;
      },
      resolveFlagName(value) {
        return Object.keys(this.flags).find(key => this.flags[key] === value);
      }
    }
  };
</script>

<style lang="scss">
    .input-select__field {
        display: grid;
        grid-template-columns: 4fr 1fr;
        grid-column-gap: 1em;
    }

    .input-select__items {
        margin-left: -0.5em;
        display: flex;
        flex-flow: row wrap;
    }

    .input-select__item {
        margin: 0.5em 0 0 0.5em;
        flex-shrink: 0;
        padding: 0.25em 0.5em;
        min-height: 0;
    }
</style>
