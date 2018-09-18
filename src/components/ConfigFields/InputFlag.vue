<template>
    <div class="form-item input-option">
        <label class="form-item__label" :for="field">
            {{ label }}
            <span v-if="required" class="form-item__required">*</span>
            <span v-if="description" class="form-item__description">{{ description }}</span>
        </label>

        <div class="input-option__items">
            <button v-for="i in 32" v-if="value & (1 << i)" class="button input-option__item" @click.prevent="removeFlag(1 << i)">
                {{ resolveFlagName(1 << i) }}
            </button>
        </div>

        <div class="input-option__field">
            <select class="form-item__input" v-model="flagValue" :id="field">
                <option v-for="(flagValue, name) in flags" :value="flagValue" v-show="flagValue === 0 || !((value & flagValue) === flagValue)">
                    {{ name }}
                </option>
            </select>
            <button class="button" @click.prevent="addFlag">Add</button>
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
        return this.schema.values;
      }
    },
    methods: {
      addFlag() {
        if (!this.flagValue && this.flagValue !== 0) return;

        if (this.flagValue === 0) this.value = 0;
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
