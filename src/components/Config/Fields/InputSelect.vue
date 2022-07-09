<template>
  <div class="form-item">
    <input-label :label="label" :hasDescription="hasDescription"></input-label>

    <div class="form-item__value">
      <div class="input-option__field input-option__field--three">
        <Multiselect
          v-model="elementKey"
          v-bind="{
            label: 'label',
            trackBy: 'key',
            multiple: false,
            options: this.botOptions,
            closeOnSelect: true,
            taggable: true,
            placeholder: '',
            deselectLabel: '',
            selectLabel: '',
            selectedLabel: '',
            tagPlaceholder: $t('tag-placeholder'),
          }"
          @tag="addSteamId"
        >
        </Multiselect>

        <select v-if="valueIsEnum" :id="`${field}-value`" v-model="elementValue" class="form-item__input">
          <option v-for="(enumValue, name) in schema.value.values" :key="name" :value="enumValue">
            {{ name }}
          </option>
        </select>

        <button class="button" @click.prevent="addElement">
          {{ $t('add') }}
        </button>
      </div>

      <div class="input-option__items">
        <button v-for="(keyValue, key) in value" :key="key" class="button input-option__item" @click.prevent="removeElement(key)">
          {{ key }} => {{ resolveValue(keyValue) }}
        </button>
      </div>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Input from './Input.vue';
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'InputSelect',
    mixins: [Input],
    components: {
      Multiselect,
    },
    data() {
      return {
        elementKey: null,
        elementValue: null,
      };
    },
    computed: {
      ...mapGetters({
        bots: 'bots/bots',
      }),
      valueIsEnum() {
        return this.schema.value.type === 'enum';
      },
      valueAvailableEnumValues() {
        const availableEnumValues = [];

        Object.keys(this.schema.value.values).forEach(key => {
          availableEnumValues.push(this.schema.value.values[key]);
        });

        return availableEnumValues;
      },
      botOptions() {
        return this.bots.map(bot => ({ label: `${bot.name} (${bot.nickname})`, key: bot.steamid }));
      },
    },
    created() {
      this.elementKey = this.getDefaultKey();
      this.elementValue = this.getDefaultValue();
    },
    methods: {
      getDefaultKey() {
        return null;
      },
      getDefaultValue() {
        if (this.valueIsEnum) return this.valueAvailableEnumValues[0];
        return null;
      },
      resolveValue(value) {
        if (!this.valueIsEnum) return value;
        return Object.keys(this.schema.value.values).find(key => this.schema.value.values[key] === value);
      },
      addElement() {
        if ((!this.elementValue && this.elementValue !== 0) || (!this.elementKey && this.elementKey !== 0)) return;

        this.$set(this.value, this.elementKey.key, this.elementValue);
        this.elementValue = this.getDefaultValue();
        this.elementKey = this.getDefaultKey();
      },
      removeElement(key) {
        this.$delete(this.value, key);
      },
      addSteamId(steamId) {
        this.elementKey = { label: steamId, key: steamId };
      },
    },
  };
</script>

<style lang="scss">
  @import "../../../style/partials/multiselect";
</style>
