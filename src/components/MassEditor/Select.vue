<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ $t('mass-editor-properties') }}

      <div class="mass-editor__navigation pull-right">
        <button class="button" @click="$emit('back')">
          {{ $t('back') }}
        </button>

        <button class="button" :disabled="isNextDisabled" :title="nextTitle" @click="$emit('next')">
          {{ $t('next') }}
        </button>
      </div>
    </div>

    <div class="mass-editor__content">
      <Multiselect
        v-model="selection"
        v-bind="multiselectConfig"
        @select="selectOption"
        @remove="removeOption"
        @input="updateModel"
        @open="openSelection"
        @close="closeSelection"
      >
        <span slot="noResult">
          {{ $t('mass-editor-search-not-found') }}
        </span>
      </Multiselect>
    </div>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'MassEditorSelect',
    components: {
      Multiselect,
    },
    props: {
      loading: { type: Boolean },
      options: { type: Array },
      selectedProperties: { type: Array },
    },
    data() {
      return {
        selection: this.selectedProperties,
        multiselectConfig: {
          label: 'param',
          trackBy: 'param',
          loading: this.loading,
          multiple: true,
          options: this.options,
          closeOnSelect: false,
          placeholder: this.$t('mass-editor-properties-placeholder'),
          deselectLabel: this.$t('mass-editor-properties-deselect'),
          selectLabel: this.$t('mass-editor-properties-select'),
          selectedLabel: this.$t('mass-editor-properties-selected'),
        },
      };
    },
    computed: {
      nextTitle() {
        return (this.selectedProperties.length === 0) ? this.$t('mass-editor-properties-disabled') : null;
      },
      isNextDisabled() {
        return this.selectedProperties.length === 0;
      },
    },
    methods: {
      selectOption(option) {
        this.$emit('select', option);
      },
      removeOption(option) {
        this.$emit('remove', option);
      },
      updateModel(model) {
        this.$emit('update', model);
      },
      openSelection() {
        this.multiselectConfig.placeholder = this.$t('mass-editor-search');
      },
      closeSelection() {
        this.multiselectConfig.placeholder = this.$t('mass-editor-properties-placeholder');
      },
    },
  };
</script>

<style lang="scss">
  @import "../../style/partials/multiselect";
</style>
