<template>
  <div class="form-item input-option">
    <input-label :label="label" :has-description="hasDescription"></input-label>

    <div class="form-item__value">
      <div class="input-option__field">
        <select :id="field" v-model="flagValue" class="form-item__input" :disabled="!availableFlags.length">
          <option v-for="{ label, flag } in availableFlags" :value="flag">{{ label }}</option>
          <option :value="null" disabled v-if="!availableFlags.length">{{ $t('input-all-selected') }}</option>
        </select>

        <button class="button" @click.prevent="addFlag">
          {{ $t('add') }}
        </button>
      </div>

      <div class="input-option__items">
        <button v-for="i in 32" v-if="value & (1 << i)" class="button input-option__item" @click.prevent="removeFlag(1 << i)">
          {{ resolveFlagName(1 << i) }}
        </button>
      </div>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Input from './Input.vue';

  export default {
    name: 'input-flag',
    mixins: [Input],
    data() {
      return {
        flagValue: null,
      };
    },
    computed: {
      availableFlags() {
        return this.flags.filter(({ flag }) => (flag & this.value) !== flag);
      },
      flags() {
        return Object.entries(this.schema['x-definition'])
          .map(([label, flag]) => ({
            label,
            flag,
          }))
          .filter(({ flag }) => flag % 2 === 0 || flag === 1);
      },
    },
    created() {
      this.setDefaultFlag();
    },
    methods: {
      setDefaultFlag() {
        this.flagValue = !this.availableFlags.length ? null : this.availableFlags[0].flag;
      },
      addFlag() {
        if (!this.flagValue) return;
        if (!this.flagValue && this.flagValue !== 0) return;
        if (this.flagValue === 0) this.value = 0;

        this.value |= this.flagValue;
        this.setDefaultFlag();
      },
      removeFlag(value) {
        this.value &= ~value;
        if (!this.flagValue) this.setDefaultFlag();
      },
      resolveFlagName(value) {
        const flag = this.flags.find(({ flag }) => flag === value);
        if (!flag) return value;
        return flag.label;
      },
    },
  };
</script>
